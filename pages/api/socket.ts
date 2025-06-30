import { NextApiRequest, NextApiResponse } from 'next';
import { Server as IOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Socket as NetSocket } from 'net';
import { ServerToClientEvents, ClientToServerEvents, AnnouncementData } from '../../types/socket';
import { parse } from 'cookie';
import prisma from "@/lib/prisma";

interface SocketServer extends HTTPServer {
    io?: IOServer<ClientToServerEvents, ServerToClientEvents>;
}

interface SocketWithIO extends NetSocket {
    server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO;
}

async function getUserRole(req: any) {
    try {
        const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
        const userData = await prisma?.session.findFirst({
            where: {
                sessionToken: cookies.token
            },
            include: {
                user: {
                    select: {
                        role: true,
                    }
                }
            }
        })
        return {
            userData: userData?.user
        }
    } catch (error) {
        return {
            userData: null
        }
    }
}


async function getUserRoomPremission(req: NextApiRequest, roomID: string) {
    try {
        const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
        const userRooms = await prisma?.session.findFirst({
            where: {
                sessionToken: cookies.token
            },
            include: {
                user: {
                    select: {
                        rooms: true,
                    }
                }
            }
        })
        if (userRooms?.id !== roomID)
            return true
        return false
    } catch (error) {
        return false
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
    if (res.socket.server.io) {
        console.log('Socket.io already running');
        res.end();
        return;
    }

    console.log('Starting Socket.io server...');

    const io = new IOServer<ClientToServerEvents, ServerToClientEvents>(res.socket.server, {
        path: '/api/socket',
        addTrailingSlash: false,
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // Handle joining rooms
        socket.on('join_room', async (room: any) => {
            socket.join(room.id);
            console.log(room.id)
            // const allowJoin = await getUserRoomPremission(req, room)
            // console.log("allowJoin:", allowJoin)
            // if (allowJoin) {
            console.log(`Socket ${socket.id} joined room: ${room.id}`);

            // Notify room about new user (optional)
            socket.to(room.id).emit('user_joined_room', {
                userId: socket.id,
                roomId: room.id
            });
            // }
        });

        // Handle leaving rooms
        socket.on('leave_room', (roomId: string) => {
            socket.leave(roomId);
            console.log(`Socket ${socket.id} left room: ${roomId}`);
        });

        // Handle admin announcements
        socket.on('send_announcement', async (data: AnnouncementData) => {
            console.log('Broadcasting announcement to room:', data.roomId);
            // const { userData } = await getUserRole(req)
            // if (userData) {
            // if (userData!.role == "ADMIN") {
            console.log("Massege sent on:", data)
            const announcement = await prisma?.anoouncement.create({
                data: {
                    type: (data.type).toUpperCase() as 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR',
                    message: data.message,
                }
            })
            if (announcement) {
                io.to(data.roomId).emit('announcement', data);
            }
            // }
            // }
        });


        // Handle admin announcements
        socket.on('send_notification', async (data: AnnouncementData) => {
            const { userData } = await getUserRole(req)
            if (userData) {
                if (userData!.role == "ADMIN") {
                    console.log("Massege sent")
                    io.to(data.roomId).emit('announcement', data);
                }
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    res.end();
}
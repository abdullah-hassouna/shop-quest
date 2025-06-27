import { NextApiRequest, NextApiResponse } from 'next';
import { Server as IOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Socket as NetSocket } from 'net';
import { ServerToClientEvents, ClientToServerEvents, AnnouncementData } from '../../types/socket';

interface SocketServer extends HTTPServer {
    io?: IOServer<ClientToServerEvents, ServerToClientEvents>;
}

interface SocketWithIO extends NetSocket {
    server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO;
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
        socket.on('join_room', (roomId: string) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room: ${roomId}`);

            // Notify room about new user (optional)
            socket.to(roomId).emit('user_joined_room', {
                userId: socket.id,
                roomId
            });
        });

        // Handle leaving rooms
        socket.on('leave_room', (roomId: string) => {
            socket.leave(roomId);
            console.log(`Socket ${socket.id} left room: ${roomId}`);
        });

        // Handle admin announcements
        socket.on('send_announcement', (data: AnnouncementData) => {
            console.log('Broadcasting announcement to room:', data.roomId);

            // Send to specific room
            io.to(data.roomId).emit('announcement', data);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    res.end();
}
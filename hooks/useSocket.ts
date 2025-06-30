import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAnnouncementStore } from '@/store/announcement-store';
import { Room } from '@prisma/client';

// type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const useSocket = (userRooms: Room[] = []) => {
    const socketRef = useRef<any | null>(null);
    const { addAnnouncement, setConnectedRooms, setConnectionStatus } = useAnnouncementStore();
    let formattedRooms: string[]
    useEffect(() => {
        const initSocket = async () => {
            formattedRooms = userRooms.map(room => room.id)
            await fetch('/api/socket');

            socketRef.current = io({
                path: '/api/socket',
            });

            const socket = socketRef.current;

            socket.on('connect', () => {
                console.log('Connected to server');
                setConnectionStatus(true);

                // Join user rooms
                formattedRooms.forEach(roomId => {
                    socket.emit('join_room', roomId);
                });

                console.log(formattedRooms)
                setConnectedRooms(formattedRooms);
            });

            socket.on('disconnect', () => {
                console.log('Disconnected from server');
                setConnectionStatus(false);
            });

            socket.on('announcement', (data: any) => {
                console.log('Received announcement:', data);
                addAnnouncement(data);
            });
        };

        initSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    // Update rooms when userRooms changes
    useEffect(() => {
        console.log("socketRef.current: ", socketRef.current)
        if (socketRef.current && socketRef.current.connected) {
            const socket = socketRef.current;

            // Leave old rooms and join new ones
            userRooms.forEach(roomId => {
                socket.emit('join_room', roomId);
            });

            setConnectedRooms(formattedRooms);
        }
    }, [userRooms, setConnectedRooms]);

    return socketRef.current;
};
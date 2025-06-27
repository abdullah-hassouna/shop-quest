import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { useAnnouncementStore } from '@/store/announcement-store';
import { ServerToClientEvents, ClientToServerEvents } from '@/types/socket';

// type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const useSocket = (userRooms: string[] = []) => {
    const socketRef = useRef<any | null>(null);
    const { addAnnouncement, setConnectedRooms, setConnectionStatus } = useAnnouncementStore();

    useEffect(() => {
        // Initialize socket connection
        const initSocket = async () => {
            await fetch('/api/socket');

            socketRef.current = io({
                path: '/api/socket',
            });

            const socket = socketRef.current;

            socket.on('connect', () => {
                console.log('Connected to server');
                setConnectionStatus(true);

                // Join user rooms
                userRooms.forEach(roomId => {
                    socket.emit('join_room', roomId);
                });

                setConnectedRooms(userRooms);
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
        if (socketRef.current && socketRef.current.connected) {
            const socket = socketRef.current;

            // Leave old rooms and join new ones
            userRooms.forEach(roomId => {
                socket.emit('join_room', roomId);
            });

            setConnectedRooms(userRooms);
        }
    }, [userRooms, setConnectedRooms]);

    return socketRef.current;
};
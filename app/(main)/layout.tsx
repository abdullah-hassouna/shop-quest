import { ChatRoomInterface, getUserRooms } from '@/actions/chat-rooms/get-user-rooms';
import Navbar from '@/components/NavBar';
import React from 'react';

const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className=''>
            <Navbar />
            <div className='py-20'>{children}</div>
        </div>
    );
};

export default layout;

import { ChatRoomInterface, getUserRooms } from '@/actions/chat-rooms/get-user-rooms';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import React from 'react';

const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className='flex flex-col min-h-screen'>
            <Navbar />
            <main className='flex-grow'>{children}</main>
            <Footer />
        </div>
    );
};

export default layout;

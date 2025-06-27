import Navbar from '@/components/NavBar';
import React from 'react';

const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const getUserRooms = () => {
        // This is where you'd typically get the user's rooms from your auth context
        // For example: return user.rooms || ['general'];
        return ['general', 'vip-customers']; // Example default rooms
    };
    return (
        <div className=''>
            <Navbar userRooms={getUserRooms()} />
            <div className='py-20'>{children}</div>
        </div>
    );
};

export default layout;

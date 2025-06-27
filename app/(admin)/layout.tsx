"use client"

import getUserSession from '@/actions/auth/regisreation/get-user-session';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react';

const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    useEffect(() => {
        const getCurrentUserRole = async () => {
            try {
                const { success, sessionExpired, userData } = await getUserSession();
                console.log(userData)
                if (success && !sessionExpired && userData) {
                    if (!userData!.role.startsWith('ADMIN')) {
                        return redirect('/');
                    }
                } else {
                    return redirect('/');
                }
            } catch (error) {
                console.error("Error fetching user session:", error);
                return redirect('/');
            }
        }
        getCurrentUserRole();
    }, []);
    return (
        <div className=''>
            <div className='py-20'>{children}</div>
        </div>
    );
};

export default layout;

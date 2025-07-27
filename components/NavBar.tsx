'use client';

import { useState, useEffect, useRef, } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, User, Menu, X, LogOut, Search, Heart } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import logoutAction from '@/actions/auth/regisreation/logout-action';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cart-store';
import useUserDataStore, { UserState } from '@/store/user-store';
import { useAnnouncementStore } from '@/store/announcement-store';
import { useSocket } from '@/hooks/useSocket';
import getUserSession from '@/actions/auth/regisreation/get-user-session';
import { getAnnouncementTypeColor } from '@/lib/utils';
import MobileDrawer from './MobileDrawer';
import { useCallAnnouncements } from '@/hooks/useCallAnnouncements';


export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const cartItems = useCartStore((state) => state.cart);
    const { user, removeUser, addUser } = useUserDataStore((state: UserState) => state);
    const [showNotifications, setShowNotifications] = useState(false);
    const {
        addAnnouncement,
        getLastAnnouncement,
        unreadCount,
        isConnected,
        markAllAsRead,
        connectedRooms
    } = useAnnouncementStore();


    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications && unreadCount > 0) {
            markAllAsRead();
        }
    };

    useEffect(() => {
        const storeNewUserData = async () => {
            setIsLoading(true)
            const { sessionExpired, success, userData } = await getUserSession();
            if (success && !sessionExpired && userData) {
                addUser(userData)
            } else if (user.email) {
                removeUser()
            }
            setIsLoading(false)
        }

        if (user.email == '') {
            storeNewUserData()
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node)
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        const { success, redirect } = await logoutAction();
        if (success) { router.push(redirect); }
        removeUser()
        setIsMobileMenuOpen(false); // Close mobile menu on logout
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.length) {
            router.push(`/search?searchTerm=${searchQuery}`);
            setIsMobileMenuOpen(false); // Close mobile menu on search
        }
    };

    const handleMenuItemClick = () => {
        setIsMobileMenuOpen(false); // Close mobile menu on item click
    };


    useSocket(user.rooms);
    useCallAnnouncements(addAnnouncement)

    console.log(getLastAnnouncement().map((announcement) => (
        announcement)))
    const MobileDrawerPropsData = {
        user: user,
        isMobileMenuOpen: isMobileMenuOpen,
        handleSearch: handleSearch,
        searchQuery: searchQuery,
        setSearchQuery: setSearchQuery,
        handleMenuItemClick: handleMenuItemClick,
        handleLogout: handleLogout,
    }
    return (
        <nav className='bg-primary-foreground mb-5'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 '>
                <div className='flex items-center justify-between h-20'>
                    <div className='flex items-center'>
                        <Link href='/' className='flex flex-shrink-0'>
                            <img className='h-24 w-24 p-5 rounded-full' src={"shopquest-high-resolution-logo-only.png"} />
                            <img className='h-24 py-5 w-auto max-md:hidden' src={"shopquest-high-resolution-logo-grayscale-transparent.png"} />
                        </Link>
                    </div>
                    <div>

                    </div>
                    <div className='flex items-center space-x-6'>
                        <Link href='/search' className="relative">
                            <Search className='h-6 w-6 text-gray-600 hover:text-primary cursor-pointer' />
                        </Link>
                        <Heart className='h-6 w-6 text-gray-600 hover:text-primary cursor-pointer' />
                        <Link href='/cart' className="relative">
                            <ShoppingCart className='h-6 w-6 text-gray-600 hover:text-primary' />
                            {cartItems.length > 0 && (
                                <span className='absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary rounded-full'>
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>
                        {isLoading ? <>Loading...</> : ((!user!.email) ? (
                            <Link href='/auth'>
                                <Button
                                    variant='outline'
                                    className='text-primary border-primary hover:bg-primary hover:text-white'
                                >
                                    Login
                                </Button>
                            </Link>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant='ghost'
                                        className='relative h-10 w-10 rounded-full'
                                    >
                                        <Avatar className='h-10 w-10 cursor-pointer'>
                                            <AvatarImage src={user.image!} alt={user.name!} />
                                            <AvatarFallback className='bg-primary text-white'>
                                                {user.name?.at(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='w-56' align='end' forceMount>
                                    <DropdownMenuLabel className='font-normal'>
                                        <div className='flex flex-col space-y-1'>
                                            <p className='text-sm font-medium leading-none text-primary'>
                                                {user.name}
                                            </p>
                                            <p className='text-xs leading-none text-gray-400'>
                                                {user?.role}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link href='/profile' className='flex w-full items-center'>
                                            <User className='mr-2 h-4 w-4' />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href='/orders' className='flex w-full items-center'>
                                            <ShoppingCart className='mr-2 h-4 w-4' />
                                            <span>Orders</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className='cursor-pointer'
                                        onClick={handleLogout}
                                    >
                                        <LogOut className='mr-2 h-4 w-4' />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ))}
                    </div>
                    <div className='md:hidden flex items-center'>
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? (
                                <X className='h-6 w-6 text-gray-600' />
                            ) : (
                                <Menu className='h-6 w-6 text-gray-600' />
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <MobileDrawer {...MobileDrawerPropsData} />
        </nav >
    );
}

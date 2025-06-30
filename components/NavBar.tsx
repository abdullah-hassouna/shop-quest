'use client';

import { useState, useEffect, useRef, } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboardIcon, BellIcon } from 'lucide-react';
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
        <nav>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b-2 border-gray-200'>
                <div className='flex items-center justify-between h-16'>
                    <div className='flex items-center'>
                        <Link href='/' className='flex-shrink-0'>
                            <span className='text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent'>
                                ShopQuest
                            </span>
                        </Link>
                    </div>
                    <div className='hidden md:flex items-center space-x-4 '>
                        Rooms:{user.rooms.map((room: any) => (room.id))}

                        <div className='mr-64'>
                            <form onSubmit={handleSearch}>
                                <Input
                                    type='text'
                                    placeholder='Search products...'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className='bg-gray-100 border-gray-400 min-w-48 '
                                />
                            </form>
                        </div>

                        <div className='flex items-center space-x-4 relative'>
                            {user.role &&
                                < Link
                                    href='/dashboard'
                                    className='text-gray-600 hover:text-purple-500'
                                >
                                    <LayoutDashboardIcon />
                                </Link>
                            }

                            {/* Notification Bell */}
                            <div className="relative">
                                <button
                                    onClick={handleNotificationClick}
                                    className="text-gray-600 hover:text-purple-500 focus:text-purple-500 flex items-center justify-center p-0 cursor-pointer"
                                >
                                    <BellIcon />

                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                                        <div className="py-1 max-h-96 overflow-y-auto">
                                            <div className="px-4 py-2 border-b border-gray-200">
                                                <h3 className="text-sm font-medium text-gray-900">
                                                    Announcements ({getLastAnnouncement().length})
                                                </h3>
                                            </div>

                                            {getLastAnnouncement().length === 0 ? (
                                                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                    No announcements yet
                                                </div>
                                            ) : (
                                                getLastAnnouncement().map((annoc) => (
                                                    <div
                                                        key={annoc.id}
                                                        className={`px-4 py-3 border-b border-gray-100 ${getAnnouncementTypeColor(annoc.type)}`}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <p className='text-black'>{annoc.message}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>


                            <Link href='/cart' onClick={handleMenuItemClick}>
                                <ShoppingCart className='h-5 w-5 text-gray-600 hover:text-purple-500' />
                                {cartItems.length > 0 && (
                                    <span className='absolute top-[-3px] right-[-3px] inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full'>
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>
                        </div>
                        {isLoading ? <>Loading...</> : ((!user!.email) ? (
                            <div className='flex space-x-2'>
                                <div>
                                    <Link href='/auth'>
                                        <Button
                                            variant='outline'
                                            className='bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent border-2 border-gray-300 cursor-pointer'
                                        >
                                            Login
                                        </Button>
                                    </Link>
                                </div>
                                <div>
                                    <Link href='/auth?new-account=1'>
                                        <Button className='bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white cursor-pointer'>
                                            Sign Up
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant='ghost'
                                        className='relative h-8 w-8 rounded-full'
                                    >
                                        <Avatar className='h-8 w-8 cursor-pointer'>
                                            <AvatarImage src={user.image!} alt={user.name!} />
                                            <AvatarFallback className='bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white'>
                                                {user.name?.at(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='w-56 ' align='end' forceMount>
                                    <DropdownMenuLabel className='font-normal'>
                                        <div className='flex flex-col space-y-1'>
                                            <p className='text-sm font-medium leading-none bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent'>
                                                {user.name}
                                            </p>
                                            <p className='text-xs leading-none text-gray-400'>
                                                {user?.role}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className='bg-purple-800' />
                                    <DropdownMenuItem className='focus:text-purple-600'>
                                        <Link href='/profile' className='flex w-full'>
                                            <User className='mr-2 h-4 w-4' />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem className='focus:text-purple-600'>
                                        <Link href='/orders' className='flex w-full'>
                                            <ShoppingCart className='mr-2 h-4 w-4' />
                                            <span>Orders</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className='bg-purple-800' />
                                    <DropdownMenuItem
                                        className=' focus:text-purple-600 cursor-pointer'
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
                                <X className='h-6 w-6 text-gray-300' />
                            ) : (
                                <Menu className='h-6 w-6 text-gray-300' />
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <MobileDrawer {...MobileDrawerPropsData} />
        </nav >
    );
}

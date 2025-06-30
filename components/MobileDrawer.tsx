import React, { useRef, } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Input } from './ui/input';
import Link from 'next/link';
import { Avatar, AvatarFallback } from './ui/avatar';
import { UserDataInterface } from '@/types/user-data-type';

interface MobileDrawerProps {
    user: UserDataInterface;
    isMobileMenuOpen: boolean;
    handleSearch: (e: React.FormEvent) => void;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    handleMenuItemClick: () => void;
    handleLogout: () => void;
}

function MobileDrawer({ user, isMobileMenuOpen, handleSearch, searchQuery, setSearchQuery, handleMenuItemClick, handleLogout }: MobileDrawerProps) {
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    return (isMobileMenuOpen && (
        <div ref={mobileMenuRef} className='md:hidden bg-gray-100'>
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
                <form onSubmit={handleSearch} className='mb-4'>
                    <Input
                        type='text'
                        placeholder='Search products...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='bg-white  '
                    />
                </form>

                <Popover>
                    <PopoverTrigger>Open</PopoverTrigger>
                    <PopoverContent>Place content for the popover here.</PopoverContent>
                </Popover>


                <Link
                    href='/cart'
                    className='block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-purple-500'
                    onClick={handleMenuItemClick}
                >
                    Cart
                </Link>
            </div>
            <div className='border-t border-gray-700 pt-4 pb-3'>
                {user!.email && (
                    <div className='flex items-center px-5 mb-3'>
                        <div className='flex-shrink-0'>
                            <Avatar className='h-8 w-8 border-2 border-gray-700'>
                                <AvatarFallback>
                                    {user.name?.split(" ").map((char: string) => char.toLocaleUpperCase()).join("")}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className='ml-3'>
                            <div className='text-base font-medium bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent'>
                                {user.name}
                            </div>
                            <div className='text-sm font-medium text-gray-500'>
                                {user?.role}
                            </div>
                        </div>
                    </div>
                )}
                {user!.email ? (
                    <div className='mt-3 px-2 space-y-1'>
                        <Link
                            href='/profile'
                            className='block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-purple-500'
                            onClick={handleMenuItemClick}
                        >
                            Your Profile
                        </Link>

                        <Link
                            href='/orders'
                            className='block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-purple-500'
                            onClick={handleMenuItemClick}
                        >
                            Orders
                        </Link>
                        <button
                            onClick={handleLogout}
                            className='block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-purple-500 w-full text-left cursor-pointer'
                        >
                            Log out
                        </button>
                    </div>
                ) : (
                    <div className='mt-3 px-2 space-y-1'>
                        <Link
                            href='/auth?type=login'
                            className='block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-purple-500'
                            onClick={handleMenuItemClick}
                        >
                            Login
                        </Link>
                        <Link
                            href='/auth?type=signup'
                            className='block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-purple-500'
                            onClick={handleMenuItemClick}
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </div>
    ))
}

export default MobileDrawer
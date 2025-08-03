import React, { useRef, } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Input } from './ui/input';
import Link from 'next/link';
import { Avatar, AvatarFallback } from './ui/avatar';
import { UserDataInterface } from '@/types/user-data-type';
import { LogOut, Package, Search, ShoppingCart } from 'lucide-react';
import { AvatarImage } from '@radix-ui/react-avatar';

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
            <div className='border-b border-gray-700 pt-4 pb-3'>
                {user!.email ? (
                    <>
                        <Link
                            href='/profile'
                            className='block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-purple-500 cursor-pointer'
                            onClick={handleMenuItemClick}
                        >
                            <div className='flex items-center px-5 mb-3'>
                                <div className='flex-shrink-0'>

                                    <Avatar className='h-8 w-8 border-2 border-gray-700'>
                                        <AvatarImage src={user.image!} alt={user.name!} />
                                        <AvatarFallback>
                                            {user.name?.split(" ").map((char: string) => char.toLocaleUpperCase()).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className='ml-3'>
                                    <div className='text-base font-medium '>
                                        {user.name}
                                    </div>
                                    <div className='text-sm font-medium text-gray-500'>
                                        {user?.role}
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <div className='mt-3 px-2 space-y-1'>
                            <Link
                                href='/orders'
                                className='flex gap-5 px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-purple-500'
                                onClick={handleMenuItemClick}
                            >
                                <Package className='h-6 w-6 text-gray-600 hover:text-primary' />
                                Orders

                            </Link>
                            <button
                                onClick={handleLogout}
                                className='flex gap-5 px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-purple-500 w-full text-left cursor-pointer'
                            >
                                <LogOut className='h-6 w-6 text-gray-600 hover:text-primary' />
                                Log out
                            </button>
                        </div>
                    </>
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

                <div className='mt-3 px-2 space-y-1'>
                    <Link
                        href='/cart'
                        className='flex gap-5 px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-purple-500'
                        onClick={handleMenuItemClick}
                    >
                        <ShoppingCart className='h-6 w-6 text-gray-600 hover:text-primary' />
                        Cart
                    </Link>
                    <Link href='/search' className="flex gap-5 px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-purple-500">
                        <Search className='h-6 w-6 text-gray-600 hover:text-primary' />
                        Search
                    </Link>
                </div>
            </div>
        </div >
    ))
}

export default MobileDrawer
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import getUserSession from '@/actions/auth/regisreation/get-user-session';
import logoutAction from '@/actions/auth/regisreation/logout-action';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cart-store';
import useUserDataStore, { UserData, UserState } from '@/store/user-store';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const cartItems = useCartStore((state) => state.cart);
    const { user, addUser, removeUser } = useUserDataStore((state: UserState) => state);
    const [firstLetter, setFirstLetter] = useState<string>("U");

    useEffect(() => {
        async function fetchUser() {
            try {
                setIsLoading(true);
                const { userData, } = (await getUserSession());
                setFirstLetter(userData?.name?.split(" ").map(char => char.toLocaleUpperCase()).join("")[0] || "U");
                if (userData) addUser(userData as unknown as UserData);
                setIsLoading(false);
            } catch (error) {
                console.error({ error });
                removeUser()
                setIsLoading(false);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
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

                        <div>
                            <Link href='/cart' onClick={handleMenuItemClick}>
                                <Button
                                    size='icon'
                                    className='relative bg-transparent hover:bg-transparent cursor-pointer pt-2'
                                    variant='ghost'
                                >
                                    <ShoppingCart className='h-5 w-5 text-gray-600 hover:text-purple-500' />
                                    {cartItems.length > 0 && (
                                        <span className='absolute top-[-3px] right-[-3px] inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full'>
                                            {cartItems.length}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        </div>
                        {isLoading && (
                            <div className='flex items-center'>
                                <Avatar className='h-8 w-8 cursor-pointer'>
                                    <AvatarFallback className='bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white'>
                                        {firstLetter}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        )}

                        {user!.email && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant='ghost'
                                        className='relative h-8 w-8 rounded-full'
                                    >
                                        <Avatar className='h-8 w-8 cursor-pointer'>
                                            <AvatarFallback className='bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white'>
                                                {firstLetter}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='w-56 ' align='end' forceMount>
                                    <DropdownMenuLabel className='font-normal'>
                                        <div className='flex flex-col space-y-1'>
                                            <p className='text-sm font-medium leading-none bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent'>
                                                {
                                                    user.name
                                                }
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
                        )}
                        {!user!.email && isLoading === false && (
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
                        )}
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

            {isMobileMenuOpen && (
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
                                            {user.name?.split(" ").map(char => char.toLocaleUpperCase()).join("")}
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
            )}
        </nav>
    );
}

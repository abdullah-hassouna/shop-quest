'use client';

import { useState, useEffect } from 'react';

import { Package, DollarSign, Calendar, Edit2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import getUserSession from '@/actions/auth/regisreation/get-user-session';
import { getOrders } from '@/actions/orders/get-orders';
import type { Order, OrderItem } from "@prisma/client"
import { redirect } from 'next/navigation';
import useUserDataStore, { UserState } from '@/store/user-store';
import EditUserDataForm from '@/components/forms/edit-user-data';
import ChangeProfileImgDialog from '@/components/dialogs/change-profile-img';

interface UserStats {
  lifetimeOrders: number;
  lifetimeSpent: number;
  yearlyOrders: number;
  yearlySpent: number;
  monthlyOrders: number;
  monthlySpent: number;
}

export default function ProfilePage() {
  const { user, addUser, removeUser } = useUserDataStore((state: UserState) => state);
  const [totalOrders, setTotalOrders] = useState<number>(0)
  const [itemsOrders, setItemsOrders] = useState<OrderItem[]>([])

  const [stats, setStats] = useState<UserStats>({
    lifetimeOrders: 0,
    lifetimeSpent: 0,
    yearlyOrders: 0,
    yearlySpent: 0,
    monthlyOrders: 0,
    monthlySpent: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const { sessionExpired } = await getUserSession();
      if (sessionExpired) {
        removeUser();
        setIsLoading(false);
        redirect('/auth');
      }
      const { orders } = await getOrders();
      if (orders) {
        orders.forEach((order) => {
          setTotalOrders(prev => (order.total + prev));
          setItemsOrders(prev => [...(order.items || []), ...prev] as OrderItem[]);
        })
      }

      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className='min-h-screen  p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold text-center mb-12  bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent'>
          My Profile
        </h1>

        {isLoading ? (
          <div className='flex items-center justify-center pt-7'>
            <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900'></div>
          </div>
        ) : (
          <div className='flex flex-col gap-8'>
            <div className='bg-gray-2 border-2 p-6 rounded-lg shadow-lg '>
              <div className='flex items-center space-x-4'>
                <Avatar className='relative group cursor-pointer h-24 w-24 text-6xl text-purple-500'>
                  <AvatarImage src={user.image} alt={user.name} />
                  <ChangeProfileImgDialog children={<div className='absolute flex justify-center transition-all rounded-full ease-in-out items-center translate-x-[-50%] left-[50%] h-24 w-24 translate-y-[-50%] top-[200%] opacity-50 group-hover:top-[50%] bg-black'>
                    <Edit2 />
                  </div>}>
                  </ChangeProfileImgDialog>
                  <AvatarFallback className='bg-purple-500 text-gray-100'>
                    {user.name.split(" ")[0].charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className='text-2xl font-semibold text-purple-500'>
                    {user.name}
                  </h2>
                  <p className='text-gray-500'>{user.role}</p>
                </div>
              </div>
            </div>
            <div className='border-2 p-6 rounded-lg shadow-lg'>
              <h3 className='text-xl font-semibold mb-4 text-purple-500'>
                My Stats
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <StatCard
                  icon={<Package className='h-8 w-8 text-purple-500' />}
                  title='Lifetime Orders'
                  value={stats.lifetimeOrders}
                />
                <StatCard
                  icon={<DollarSign className='h-8 w-8 text-purple-500' />}
                  title='Lifetime Spent'
                  value={`$${stats.lifetimeSpent.toFixed(2)}`}
                />
                <StatCard
                  icon={<Calendar className='h-8 w-8 text-purple-500' />}
                  title='This Year'
                  value={`${stats.yearlyOrders} orders`}
                  subvalue={`$${stats.yearlySpent.toFixed(2)} spent`}
                />
              </div>
            </div>
            <EditUserDataForm {...user} />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  subvalue,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subvalue?: string;
}) {
  return (
    <div className='bg-gray-100 p-4 rounded-lg flex items-center space-x-4'>
      {icon}
      <div>
        <h4 className='text-sm font-medium text-gray-500'>{title}</h4>
        <p className='text-2xl font-bold text-purple-500'>{value}</p>
        {subvalue && <p className='text-sm text-gray-700'>{subvalue}</p>}
      </div>
    </div>
  );
}

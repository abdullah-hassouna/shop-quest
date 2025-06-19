'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  XSquareIcon,
} from 'lucide-react';
import type { Order } from '@prisma/client'
import { getOrderItems, getOrders, OrderInterface } from '@/actions/orders/get-orders';
import { redirect, useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import getUserSession from '@/actions/auth/regisreation/get-user-session';


interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number | null;
}

interface OrderItem {
  id: number;
  createdDate: string;
  statusIdentifier: string;
  totalSum: string;
  products: Product[];
}

type orderStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED"

const orderStatusIcons = {
  PENDING: <Package className='w-5 h-5 text-yellow-500' />,
  SHIPPED: <Truck className='w-5 h-5 text-blue-500' />,
  DELIVERED: <CheckCircle className='w-5 h-5 text-green-500' />,
  CANCELLED: <AlertCircle className='w-5 h-5 text-red-500' />,
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalOrders, setOrderTotals] = useState<number>(0)

  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const { sessionExpired } = await getUserSession();
      if (sessionExpired) {
        setIsLoading(false);
        redirect('/auth');
      }
      const { orders } = await getOrders();
      if (orders !== undefined) {
        setOrders(orders)
        let total = 0;
        orders.forEach((order) => {
          total += order.total;
        });
        setOrderTotals(() => total);
      }
      setIsLoading(false);
    };

    fetchOrders();
  }, []);

  async function callOrderItems(id: string, called: boolean): Promise<void> {
    if (!called) {
      const { orderItems, success, error } = await getOrderItems(id);

      console.log(orderItems)
      if (success) {
        setOrders(prev => prev.map(order => (order.id === id ? { ...order, items: orderItems, itemsCalled: true } : order)))
      } else {
        console.log(error)
      }
    }
  }

  return (
    <div className='min-h-screen p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold text-center mb-12  bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent'>
          My Orders
        </h1>

        {isLoading ? (
          <div className='flex items-center justify-center pt-7'>
            <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900'></div>
          </div>
        ) : (
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            {orders?.map((order: OrderInterface) => (
              <div
                key={order.id}
                className='bg-gray-100 rounded-lg shadow-lg mb-6 overflow-hidden border-2'
              >
                <div className='p-6'>
                  <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-2xl font-semibold text-purple-500'>
                      Order #{order.createdAt.toLocaleDateString()}
                    </h2>
                    <Badge className={` text-white bg-purple-900`}>
                      {
                        orderStatusIcons[order.status as orderStatus]
                      }
                      <span className='ml-2 capitalize'>
                        {order.status}
                      </span>
                    </Badge>
                  </div>
                  <div className='flex justify-between text-gray-600 mb-4'>
                    <span>
                      Order Date: {order.createdAt.toDateString()}
                    </span>
                    <span>Total: ${order.total.toFixed(2)}</span>
                  </div>
                  <div className='w-full'>
                    <div className='border-t border-gray-300 pt-4'>
                      <div className='space-y-4 mt-4'>
                        <Accordion type="single" collapsible>
                          <AccordionItem value="item-1">
                            <AccordionTrigger onClick={() => callOrderItems(order.id, order.itemsCalled)}>
                              <p className='text-xl'>
                                Items
                              </p>
                            </AccordionTrigger>
                            <AccordionContent className='space-y-3'>
                              {order.items ? order.items.map(i => <div
                                key={i.id}
                                className='flex is-center space-x-4'
                              >
                                <div className='flex-1'>
                                  <h3 className='font-semibold text-purple-500'>
                                    {i.product.name}
                                  </h3>
                                  <p className='text-gray-500'>
                                    Quantity: {i.quantity}
                                  </p>
                                </div>
                                <span className='text-purple-500 font-semibold'>
                                  Item Price: ${i.product.price.toFixed(2)}
                                </span>
                              </div>) : "loading"}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        )}

        {!isLoading && totalOrders === 0 && (
          <div className='text-center py-12 border-2 border-gray-200 rounded-lg bg-gray-100'>
            <XSquareIcon className='mx-auto h-16 w-16 text-red-400 mb-4' />
            <h2 className='text-2xl font-semibold mb-2 text-purple-500'>
              No orders found
            </h2>
            <p className='text-gray-400 mb-6'>
              You haven`&apos;`t placed any orders yet. Start shopping now!
            </p>
            <Button
              className='flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-semibold cursor-pointer'
              onClick={() => router.push('/')}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

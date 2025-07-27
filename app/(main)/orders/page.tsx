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
  ArrowLeft,
  Eye,
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

const statusConfig = {
  PENDING: {
    icon: () => <Package className="w-4 h-4 bg-yellow-100 text-yellow-800 border-yellow-200" />,
    label: "Processing",
  },
  SHIPPED: {
    icon: () => <Truck className="w-4 h-4 bg-blue-100 text-blue-800 border-blue-200" />,
    label: "Shipped",
  },
  DELIVERED: {
    icon: () => <CheckCircle className="w-4 h-4 bg-green-100 text-green-800 border-green-200" />,
    label: "Delivered",
  },
  CANCELLED: {
    icon: () => <AlertCircle className="w-4 h-4 bg-red-100 text-red-800 border-red-200" />,
    label: "Cancelled",
  },
}

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
      console.log(orders)
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
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          className="mb-6 text-primary hover:text-red-600 hover:bg-red-50"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders found</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping now!</p>
            <Button onClick={() => router.push("/")} className="bg-primary hover:bg-red-600 text-white">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = statusConfig[order.status]
              return <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">Order {order.id.split("-").reverse()[0]}</h2>
                      <p className="text-gray-600">Placed on {order.createdAt.toLocaleDateString()}</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                      <div>
                        {<status.icon />}

                      </div>
                      <span className="text-lg font-semibold text-primary">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="items" className="border-none">
                      <AccordionTrigger className="hover:no-underline py-2">
                        <div className="flex items-center">

                          <Eye className="w-4 h-4 mr-2" />
                          View Items ({order.items.length})
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                                <p className="text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                                <p className="text-sm text-gray-600">${item.product.price} each</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Track Order
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      View Invoice
                    </Button>
                    {order.status === "DELIVERED" && (
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Return Items
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            }
            )}
          </div>
        )}
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  LogIn,
  ArrowLeft,
} from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import useCartStore from '@/store/cart-store';
import getUserSession from '@/actions/auth/regisreation/get-user-session';
import useUserDataStore, { UserState } from '@/store/user-store';
import createOrder from '@/actions/orders/create-order';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const { cart: cartItems, updateQuantity, removeItem, clearCart } = useCartStore((state) => state);

  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUserDataStore((state: UserState) => state);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // Assuming 10% tax
  const total = subtotal + tax;

  const createOrderAndCheckout = async () => {

    const { userData, sessionExpired } = await getUserSession();
    if (sessionExpired) {
      toast("You need an Account First!", { duration: 5000 })
      setTimeout(() => redirect('/auth?ref=cart'), 5000)
    }
    if (userData) {
      await createOrder({
        userId: userData.id,
        totalPrice: total,
        shippingAddress: '',
        products: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        }))
      }).then(() => clearCart())
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          className="mb-6 text-primary hover:text-red-600 hover:bg-red-50"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Button onClick={() => router.push("/")} className="bg-primary hover:bg-red-600 text-white">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-primary font-medium">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                        className="w-16 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-primary hover:text-red-600 hover:bg-red-50 mt-2"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-semibold text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {subtotal < 50 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                    <p className="text-sm text-yellow-800">Add ${(50 - subtotal).toFixed(2)} more for free shipping!</p>
                  </div>
                )}

                <Button
                  onClick={createOrderAndCheckout}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-red-600 text-white h-12"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  {isLoading ? "Processing..." : "Proceed to Checkout"}
                </Button>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">Secure checkout powered by SSL encryption</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

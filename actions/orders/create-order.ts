'use server';

import prisma from "@/lib/prisma";
import { CartItem } from "@/store/cart-store";
import type { Order, User, } from "@prisma/client";

export default async function createOrder(newOrder: any) {

    try {

        const { userId, products, totalPrice, shippingAddress } = newOrder;

        const orderData = await prisma.order.create({
            data: {
                total: totalPrice,
                buyer: {
                    connect: { id: userId }
                },
            }
        }) as Order

        const orderItems = await prisma.orderItem.createMany({
            data: products.map((product: CartItem) => ({ orderId: orderData.id, productId: product.id, quantity: product.quantity, price: totalPrice })),
        })

        if (orderItems) {
            return {
                success: true,
                error: "",
                orderInfo: {
                    orderData,
                    orderItems
                }
            }
        }

        return {
            success: false,
            error: "Somthing Went Wrong",
            orderInfo: {}
        }
    } catch (err: any) {
        console.log(err);
        return {
            success: false,
            error: err.message,
            orderInfo: {}
        }
    }

}
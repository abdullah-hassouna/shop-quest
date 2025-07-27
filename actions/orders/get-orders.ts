"use server";
import prisma from "@/lib/prisma";
import type { Order, OrderItem, Product } from "@prisma/client"
import getUserSession from "../auth/regisreation/get-user-session"


export interface OrderItemInterface extends OrderItem {
    quantity: number;
    product: Product
}

export interface OrderInterface extends Order {
    items: OrderItemInterface[];
}


export async function getOrders(): Promise<{
    success: boolean,
    error: string | null,
    orders: OrderInterface[] | []
}> {
    try {
        const { userData } = await getUserSession()

        const orders = await prisma?.order.findMany({
            where: {
                buyerId: userData?.id
            },
            select: {
                id: true,
                createdAt: true,
                total: true,
                status: true,
                items: {
                    select: {
                        quantity: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                imagesId: true,
                            }
                        }
                    }
                }
            }
        }) as unknown as OrderInterface[]

        if (orders) {
            return {
                success: true,
                error: null,
                orders
            }
        }

        return {
            success: true,
            error: null,
            orders: []
        }

    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            orders: []
        }
    }
}




export async function getOrderItems(orderId: string): Promise<{
    success: boolean,
    error: string | null,
    orderItems: OrderItemInterface[] | []
}> {
    try {
        const orderItems = await prisma?.orderItem.findMany({
            include: {
                product: true
            },
            where: {
                orderId
            }
        }) as OrderItemInterface[]

        if (orderItems.length) {
            return {
                success: true,
                error: null,
                orderItems
            }
        }

        return {
            success: true,
            error: null,
            orderItems: []
        }

    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            orderItems: []
        }
    }
}


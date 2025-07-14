"use server";

import prisma from '@/lib/prisma';
import { ActionReturnType } from '@/types/actions-return-type';
import { GetOrderDataAdminResponse } from '@/types/get-data-response';
import { cache } from 'react';


export const getAllOrders = cache(async (page: string | number, take: number = 2, search: string = "", orderBy?: { order: string, sort: 'asc' | 'desc', } | null,): Promise<ActionReturnType<GetOrderDataAdminResponse[]>> => {
    const index = (Number(page) || 1) - 1;

    try {
        const orders = await prisma?.order.findMany({
            orderBy: {
                [orderBy ? orderBy.order : "id"]: orderBy ? orderBy.sort : "asc"
            },
            where: {
                OR: [
                    {
                        buyer: {
                            name: {
                                contains: search.toLowerCase()
                            }
                        },
                        items: {
                            some: {
                                product: {
                                    name: {
                                        contains: search.toLowerCase()
                                    }
                                }
                            }
                        }
                    },
                    {
                        buyer: {
                            name: {
                                contains: search.toUpperCase()
                            }
                        }
                    },
                    {
                        items: {
                            some: {
                                product: {
                                    name: {
                                        contains: search.toUpperCase()
                                    }
                                }
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                total: true,
                status: true,
                items: {
                    select: {
                        quantity: true,
                        product: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
                createdAt: true,
                buyer: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
            skip: index * take,
            take: take
        });

        return {
            data: orders as GetOrderDataAdminResponse[],
            error: null,
            success: true
        };
    } catch (error) {
        return {
            data: null,
            error: "Error fetching orders",
            success: false
        };
    }
})


export const getAllOrdersPages = cache(async (take: number = 2, search: string = ""): Promise<ActionReturnType<number>> => {

    try {
        const ordersPagesCount = await prisma?.order.count({
            where: {
                OR: [
                    {
                        buyer: {
                            name: {
                                contains: search.toLowerCase()
                            }
                        },
                        items: {
                            some: {
                                product: {
                                    name: {
                                        contains: search.toLowerCase()
                                    }
                                }
                            }
                        }
                    },
                    {
                        buyer: {
                            name: {
                                contains: search.toUpperCase()
                            }
                        }
                    },
                    {
                        items: {
                            some: {
                                product: {
                                    name: {
                                        contains: search.toUpperCase()
                                    }
                                }
                            }
                        }
                    }
                ]
            },
        });
        return {
            data: ordersPagesCount ? Math.ceil(ordersPagesCount / take) : 0,
            error: null,
            success: true
        };
    } catch (error) {
        return {
            data: null,
            error: "Error fetching users",
            success: false
        };
    }
})
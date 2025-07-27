"use server";

import prisma from '@/lib/prisma';
import { ActionReturnType } from '@/types/actions-return-type';
import { GetProductDataResponse } from '@/types/get-data-response';
import { cache } from 'react';


export const getAllProducts = cache(async (page: string | number, take: number = 2, search: string = "", orderBy?: { order: string, sort: 'asc' | 'desc', } | null,): Promise<ActionReturnType<GetProductDataResponse[]>> => {
    const index = (Number(page) || 1) - 1;

    try {
        const products = await prisma?.product.findMany({
            orderBy: {
                [orderBy ? orderBy.order : "id"]: orderBy ? orderBy.sort : "asc"
            },
            where: {
                OR: [
                    {
                        name: {
                            contains: search.toLowerCase(),
                        }
                    },
                    {
                        category: {
                            name: {
                                contains: search.toLowerCase()
                            }
                        },
                        tags: {
                            some: {
                                name: {
                                    contains: search.toLowerCase()
                                }
                            }
                        }
                    },
                    {
                        name: {
                            contains: search.toUpperCase(),
                        }
                    },
                    {
                        category: {
                            name: {
                                contains: search.toUpperCase()
                            }
                        }
                    },
                    {
                        tags: {
                            some: {
                                name: {
                                    contains: search.toUpperCase()
                                }
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                price: true,
                description: true,
                imagesId: {
                    select: {
                        id: true,
                        url: true,
                        alt: true,
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true,
                        slug: true
                    }
                },
                tags: {
                    select: {
                        id: true,
                        name: true
                    },
                },
                createdAt: true,
                seller: {
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
            data: products as GetProductDataResponse[],
            error: null,
            success: true
        };
    } catch (error) {
        return {
            data: null,
            error: "Error fetching products",
            success: false
        };
    }
})


export const getAllProductsPages = cache(async (take: number = 2, search: string = ""): Promise<ActionReturnType<number>> => {

    try {
        const productsPagesCount = await prisma?.product.count({
            where: {
                OR: [
                    {
                        name: {
                            contains: search.toLowerCase(),
                        }
                    },
                    {
                        category: {
                            name: {
                                contains: search.toLowerCase()
                            }
                        },
                        tags: {
                            some: {
                                name: {
                                    contains: search.toLowerCase()
                                }
                            }
                        }
                    },
                    {
                        name: {
                            contains: search.toUpperCase(),
                        }
                    },
                    {
                        category: {
                            name: {
                                contains: search.toUpperCase()
                            }
                        }
                    },
                    {
                        tags: {
                            some: {
                                name: {
                                    contains: search.toUpperCase()
                                }
                            }
                        }
                    }
                ]
            },
        });
        return {
            data: productsPagesCount ? Math.ceil(productsPagesCount / take) : 0,
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
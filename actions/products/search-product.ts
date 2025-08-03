"use server"

import prisma from "@/lib/prisma";
import { GetProductDataResponse } from "@/types/get-data-response";
import { ProductDataInterface } from "@/types/product-type";


export interface FilterProps {
    maxPrice?: number;
    minPrice?: number;
}

export interface PaginationProps {
    index: string;
    count: string;
}

export async function searchProductsAction(searchWord: string, pagination?: PaginationProps, tags?: string[], categorySlug?: string, filters?: FilterProps, orderBy?: any): Promise<{
    success: boolean;
    error: string;
    products: ProductDataInterface[]
}> {
    const index = (Number(pagination?.index) > -1 ? Number(pagination?.index) : 0);
    const take = Number(pagination?.count) > 5 && Number(pagination?.count) < 40 ? Number(pagination?.count) : 8
    const skip = index > 0 ? (index - 1) * take : 0;

    try {
        const SearchWords = searchWord.split(" ")
        const products = await prisma?.product.findMany({
            orderBy,
            select: {
                name: true,
                id: true,
                createdAt: true,
                price: true,
                description: true,
                imagesId: {
                    take: 1,
                    select: {
                        url: true,
                        alt: true,
                    },
                },
                tags: true,
                averageRating: true,
                variants: true,
                stock: true,
                reviewsCount: true,
            },
            where: {
                AND: [
                    {
                        category: {
                            slug: categorySlug ? categorySlug : undefined
                        },
                        price: {
                            gte: filters?.minPrice ? filters.minPrice : 0,
                            lte: filters?.maxPrice ? filters.maxPrice : 10000000
                        }
                    }
                    , {
                        OR: [...(SearchWords.map(w => (
                            {
                                tags: {
                                    some: {
                                        name: {
                                            contains: w
                                        }
                                    }
                                }
                            }))), ...(SearchWords.map(w => ({
                                name: {
                                    contains: w
                                }
                            }))
                            ), ...(SearchWords.map(w => ({
                                description: {
                                    contains: w
                                }
                            }))
                            )]
                    }
                ],

            },
            take,
            skip,
        }) as ProductDataInterface[]

        return {
            success: true,
            error: "",
            products
        }
    } catch (err: any) {
        console.log(err)
        return {
            success: false,
            error: err.message,
            products: []
        }
    }

}
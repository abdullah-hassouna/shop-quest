"use server"

import prisma from "@/lib/prisma";
import { GetProductDataResponse } from "@/types/get-data-response";
import { ProductInterface } from "@/types/product-type";


interface FilterProps {
    maxPrice?: string;
    minPrice?: string;
}

export interface PaginationProps {
    index: string;
    count: string;
}

export async function searchProductsAction(searchWord: string, pagination: PaginationProps = { index: "0", count: "12" }, tags?: string[], filters?: FilterProps): Promise<{
    success: boolean;
    error: string;
    products: GetProductDataResponse[]
}> {
    const index = ((Number(pagination.index) > -1 ? Number(pagination.index) : 0)) + 1;
    const count = Number(pagination.count) > 5 && Number(pagination.count) < 10 ? Number(pagination.count) : 8
    const skip = index * count;

    try {
        //         const words = searchWord.trim().split(/\s+/).filter(Boolean);
        //         const whereClauses = words.map(
        //             () => `(LOWER(p.name) LIKE LOWER(?) OR LOWER(p.description) LIKE LOWER(?) OR LOWER(t.name) LIKE LOWER(?))`
        //         ).join(' AND ');

        //         const params = words.flatMap(w => {
        //             const s = `%${w}%`;
        //             return [s, s, s];
        //         });
        //         params.push(count + "", skip + "");

        //         const sql = `
        //   SELECT p.* FROM Product p
        //   LEFT JOIN _ProductTags pt ON pt.A = p.id
        //   LEFT JOIN Tag t ON t.id = pt.B
        //   LEFT JOIN Image i ON i.productId = p.id
        //   WHERE ${whereClauses}
        //   GROUP BY p.id
        //   LIMIT ? OFFSET ?
        // `;

        //         console.log('SQL:', sql);
        //         console.log('Params:', params);

        //         const products = await prisma.$queryRawUnsafe<ProductInterface[]>(sql, ...params);
        const SearchWords = searchWord.split(" ")
        const products = await prisma?.product.findMany({
            orderBy: {

            },
            include: {
                imagesId: true,
                seller: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                },
                category: true,
                tags: true,
                Review: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            }
                        },
                        createdAt: true,
                        updatedAt: true
                    }
                }
            },
            where: {
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
            },
            take: count,
            skip,
        }) as GetProductDataResponse[]

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
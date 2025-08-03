"use server";

import prisma from "@/lib/prisma";
import { ProductDataInterface } from "@/types/product-type";
import { FilterProps, PaginationProps } from "./search-product";

export const getProductDataByCategory = async (categorySlug: string, searchWord: string, pagination: PaginationProps = { index: "0", count: "12" }, tags?: string[], filters?: FilterProps): Promise<{
    productsData?: ProductDataInterface[],
    categoryData?: {
        name: string;
        id: string;
        icon: string | null;
        slug: string;
    }, error?: string
}> => {

    const index = ((Number(pagination.index) > -1 ? Number(pagination.index) : 0)) + 1;
    const count = Number(pagination.count) > 5 && Number(pagination.count) < 10 ? Number(pagination.count) : 8
    const skip = index * count;

    const SearchWords = searchWord.split(" ")


    try {
        const productCategoryData = await prisma.category.findFirst({
            where: {
                OR: [...(SearchWords.map(w => (
                    {
                        slug: categorySlug,
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
            select: {
                id: true,
                name: true,
                slug: true,
                icon: true,
                products: {
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
                    }
                }
            },
            take: count,
            skip,
        });


        if (!productCategoryData || !productCategoryData.products || productCategoryData.products.length === 0) {
            return { error: "No product data found for the given category." };
        }

        const { products: productsData, ...categoryData } = productCategoryData;

        return { productsData, categoryData };
    } catch (error) {
        console.error("Error fetching product data:", error);
        return {
            error: "Failed to fetch product data.",
        };
    }
}
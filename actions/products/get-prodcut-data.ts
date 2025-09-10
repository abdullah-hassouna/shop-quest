"use server";

import prisma from "@/lib/prisma";
import { GetProductDataResponse } from "@/types/get-data-response";

export const getProductData = async (
  id: string
): Promise<{ productData?: GetProductDataResponse; error?: string }> => {
  try {
    const productData = await prisma.product.findFirst({
      where: { id },
      include: {
        tags: true,
        category: true,
        imagesId: true,
        seller: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        review: {
          take: 3,
          select: {
            id: true,
            rating: true,
            comment: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!productData) {
      return { error: "Product not found." };
    }

    const reviews = productData?.review || [];
    let averageRating = 0;

    if (reviews.length === 0) {
    } else {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      averageRating = totalRating / reviews.length;
    }

    return {
      productData: { ...productData, averageRating } as GetProductDataResponse,
    };
  } catch (error) {
    console.error("Error fetching product data:", error);
    return {
      error: "Failed to fetch product data.",
    };
  }
};

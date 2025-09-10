"use server";

import prisma from "@/lib/prisma";

export async function editProductAction(newProductData: {
  id?: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  tags: string[];
  images?: Array<{ id?: string; url: string; alt: string }>;
  variants: object;
}) {
  const imagesInput = newProductData.images
    ? {
        set: newProductData.images
          .filter((img) => img.id)
          .map((img) => ({ id: img.id! })),
      }
    : undefined;

  const newProductDataFormed = {
    name: newProductData.name,
    price: newProductData.price,
    stock: newProductData.stock,
    description: newProductData.description,
    category: { connect: { id: newProductData.category } },
    tags: { set: newProductData.tags.map((tagId) => ({ id: tagId })) },
    ...(imagesInput ? { imagesId: imagesInput } : {}),
    variants: JSON.stringify(newProductData.variants),
  };

  if (!newProductData.id) {
    return {
      data: null,
      success: false,
      error: "Product ID is required for update.",
    };
  }

  try {
    const updatedProductData = await prisma.product.update({
      where: {
        id: newProductData.id,
      },
      data: newProductDataFormed,
    });

    console.log({
      data: updatedProductData,
      success: true,
      error: null,
    });

    return {
      data: updatedProductData,
      success: true,
    };
  } catch (error) {
    console.log({
      error: error,
    });

    return {
      data: null,
      success: false,
      error: "Server side error. Please try again later.",
    };
  }
}

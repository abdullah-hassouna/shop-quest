"use server";

import prisma from "@/lib/prisma";

export async function addNewProductAction(newProductData: {
  seller: string;
  stock: number;
  variants: string;
  name: string;
  price: number;
  description: string;
  category: string;
  tags: string[];
  images: string[];
}) {
  try {
    // const imagesInput = newProductData.images
    //   ? {
    //       connect: newProductData.images
    //         .filter((img) => img.id)
    //         .map((img) => ({ id: img.id!.toString() })),
    //     }
    //   : undefined;

    const newProductDataFormed = {
      name: newProductData.name,
      price: newProductData.price,
      stock: newProductData.stock,
      description: newProductData.description,
      seller: { connect: { id: newProductData.seller } },
      category: { connect: { id: newProductData.category } },
      tags: { connect: newProductData.tags.map((tagId) => ({ id: tagId })) },
      imagesId: {
        connect: newProductData.images.map((imageid) => ({ id: imageid })),
      },
      variants: JSON.stringify(newProductData.variants),
    };

    const newProduct = prisma.product.create({
      data: newProductDataFormed,
    });

    return { success: true, data: newProduct, error: null };
  } catch (err) {
    return { success: false, data: null, error: "Server Error" };
  }
}

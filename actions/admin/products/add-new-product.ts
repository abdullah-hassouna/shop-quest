import type { Product } from "@prisma/client";
import prisma from '@/lib/prisma';
import { uploadNewProductImage } from "@/actions/cloudinary/upload-image";
import { Images } from "lucide-react";

export async function addNewProductAction(newProductData: {
    name: string,
    price: number,
    description: string,
    category: string,
    tags: string[],
    images: {
        id: number;
        file: File;
        name: string;
        size: number;
        url: string;
    }[]
}) {
    let imageFiles = []
    if (newProductData.images.length == 0) return
    console.log("first")

    imageFiles = newProductData.images.map(img => img.file)
    const uploadedImages = await uploadNewProductImage(imageFiles)
    console.log(uploadedImages)

    // const newProduct = prisma.product.create({
    //     data: {

    //     }
    // })
}
import type { Product } from "@prisma/client";
import prisma from '@/lib/prisma';
import { uploadNewProductImage } from "@/actions/cloudinary/upload-image";
import { Images } from "lucide-react";

export async function editProductAction(newProductData: {
    id: string,
    name: string,
    price: number,
    stock: number,
    description: string,
    category: string,
    tags: string[],
    addedImages: {
        id: string;
        file: File;
        name: string;
        size: number;
        url: string;
    }[],
    removerImages: {
        id: string
    }
}) {

    const updatedProductData = await prisma.product.update({
        where: {
            id: newProductData.id
        },
        data: {
            name: newProductData.name,
            price: newProductData.price,
            description: newProductData.description,
            tags: {
               
            },
        }
    })

}
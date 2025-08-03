import type { Product, Image, Tag, } from '@prisma/client';


export interface ProductInterface extends Product {
    imagesId: Image[];
    tags: Tag[]

}

export interface ProductDataInterface {
    name: string;
    id: string;
    createdAt: Date;
    price: number;
    description: string | null;
    imagesId: { url: string; alt: string | null; }[];
    tags: Tag[]
    averageRating: number,
    variants: string | null,
    stock: number,
    reviewsCount: number,
}


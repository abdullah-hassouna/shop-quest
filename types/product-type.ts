import type { Product, Image, Tag } from '@prisma/client';


export interface ProductInterface extends Product {
    imagesId: Image[];
    tags: Tag[]

}
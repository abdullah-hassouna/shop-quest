import type { Category, Image, Tag, User } from "@prisma/client";

export interface GetUserDataResponse {
    id: string | null
    image: string | null
    name: string
    email: string | null
    emailVerified: Date | null
    role: string
    createdAt: Date
    updatedAt: Date
    sessions: { expires: Date }[]
}



export interface GetProductDataResponse {
    id: string
    name: string
    price: number
    description: string
    imagesId: {
        id: string,
        url: string,
        alt: string,
    }[]
    seller: {
        id: string,
        name: string
    }
    category: {
        id: string,
        name: string,
        color: string,
        icon: string
    }
    tags: {
        id: string,
        name: string
    }[]
    createdAt: Date
}

import type { OrderStatus, Image, Tag, User } from "@prisma/client";

export interface GetAvgOrderSalesDataResponse {
    month: string,
    number: number,
}

export interface GetCategoryDataAdminResponse {
    id: string | null;
    name: string | null;
    icon: string | null;
    slug: string | null;
    color: string | null;
    createdAt: Date;

}

export interface GetOrderDataAdminResponse {
    id: string | null;
    total: number;
    status: OrderStatus;
    items: Array<{ product: { name: string, id: string | null, price: number }, quantity: number }>;
    createdAt: Date;
    buyer: {
        id: string | null;
        name: string | null;
    }
}

export interface GetOneUserDataAdminResponse {
    id: string | null;
    image: string | null;
    name: string;
    email: string | null;
    role: string;
    emailVerified: Date | null;
    createdAt: Date;
    updatedAt: Date;
    Order: {
        createdAt: Date;
        total: number;
        items: {
            quantity: number;
            product: {
                id: string;
                imagesId: Image[];
                name: string;
                price: number;
                category: {
                    id: string;
                    name: string;
                    color: string;
                    icon: string;
                };
                tags: {
                    id: string;
                    name: string;
                }[];
            };
        }[];
    }[];
    sessions: {
        expires: Date;
    }[];
}

export interface GetUserDataAdminResponse {
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

export interface GetOneProductDataAdminResponse {
    id: string
    name: string
    price: number
    description: string
    imagesId: {
        id: string
        url: string
        alt: string
    }[],
    category: {
        id: string
        name: string
        color: string
        icon: string
    },
    tags:
    {
        id: string
        name: string
    }[],
    createdAt: Date
    seller: {
        id: string,
        name: string,
        image: string
    }
}

export interface GetProductDataResponse {
    id: string;
    name: string;
    price: number;
    description: string;
    categoryId: string;
    sellerId: string;
    createdAt: Date;
    imagesId: {
        id: string;
        url: string;
        alt: string;
        productId: string;
        createdAt: Date;
    }[];
    seller: {
        id: string;
        name: string;
        image: string;
    };
    category: {
        id: string;
        name: string;
        description: string;
        icon: string;
        color: string;
        slug: string;
        createdAt: Date;
    };
    tags: {
        id: string;
        name: string;
    }[];
    Review?: {
        id: string;
        rating: number;
        comment: string;
        user: any;
        createdAt: Date;
        updatedAt: Date;
    }[];
    averageRating: number;
}

export interface GetCategoryDataResponse {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
}

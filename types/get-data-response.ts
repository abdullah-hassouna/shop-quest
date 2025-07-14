import type { OrderStatus, Image, Tag, User } from "@prisma/client";

export interface GetAvgOrderSalesDataResponse {
    month: string,
    number: number,
}

export interface GetOrderDataAdminResponse {
    id: string | null;
    total: number;
    status: OrderStatus;
    items: Array<{ product: { name: string, }, quantity: number }>;
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

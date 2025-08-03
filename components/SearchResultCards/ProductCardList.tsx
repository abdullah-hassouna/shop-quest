import type { GetProductDataResponse } from "@/types/get-data-response";
import { ShoppingCart } from "lucide-react";
import { memo, useCallback } from "react";
import { RateStar } from "../RateStar";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import useCartStore, { CartItem } from "@/store/cart-store";
import { toast } from "sonner";
import Link from "next/link";
import { ProductDataInterface } from "@/types/product-type";


export const ProductListCard = memo(({ product, }: { product: ProductDataInterface, }) => {

    const onAddToCart = useCallback((product: GetProductDataResponse | ProductDataInterface) => {
        const cartItem: CartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.imagesId?.[0]?.url || '',
        };
        useCartStore.getState().addToCart(cartItem);
        toast.success(`${product.name} added to cart!`);
    }, []);


    return <Link href={`/product/${product.id}`}>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer p-0">
            <CardContent className="p-0">
                <div className="flex gap-4 items-center p-6">
                    <div className="w-auto h-full flex-shrink-0">
                        <Image
                            src={product.imagesId?.[0]?.url || '/api/placeholder/96/96'}
                            alt={product.name}
                            width={150}
                            height={150}
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                    <div className="flex-1 ">
                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center gap-2 mb-2">
                            <RateStar rating={product.averageRating} />
                            <span className="text-sm text-gray-500">({product.reviewsCount})</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-purple-600">
                                ${product.price.toFixed(2)}
                            </span>
                            <div  >
                                <Button
                                    size="sm"
                                    onClick={() => onAddToCart(product)}
                                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600"
                                >
                                    <ShoppingCart className="h-4 w-4 mr-1" />
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </Link>
})
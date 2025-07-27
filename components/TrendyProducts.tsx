'use client';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import ProductCard from "./ProductCard";
import { GetProductDataResponse } from "@/types/get-data-response";


export default function TrendyProducts({ products }: { products: GetProductDataResponse[] }) {
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-sm text-gray-500">BEST SELL</p>
                        <h2 className="text-3xl font-bold">Trendy Products</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                    </div>
                </div>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                >
                    <CarouselContent>
                        {products.map((product) => (
                            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                                <ProductCard product={product} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>
    );
}
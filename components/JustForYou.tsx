'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import { Button } from './ui/button';
import { GetCategoryDataResponse, GetProductDataResponse } from '@/types/get-data-response';


export default function JustForYou({ categories, products }: { categories: GetCategoryDataResponse[], products: GetProductDataResponse[] }) {
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredProducts =
        activeCategory === 'All'
            ? products.slice(0, 12)
            : products.filter((product) =>
                product.category.slug.includes(activeCategory.slice(0, -1).toLowerCase())
            );

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Just For You</h2>
                <div className="flex flex-wrap justify-center space-x-4 space-y-2 mb-8">
                    <Button
                        key={"all"}
                        variant={activeCategory === "All" ? 'default' : 'outline'}
                        onClick={() => setActiveCategory("All")}
                    >
                        All
                    </Button>
                    {categories.map((cate) => (
                        <Button
                            key={cate.slug}
                            variant={activeCategory === cate.slug ? 'default' : 'outline'}
                            onClick={() => setActiveCategory(cate.slug)}
                        >
                            {cate.name}
                        </Button>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
            </div>
        </section>
    );
}
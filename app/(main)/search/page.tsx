'use client';

import { useState, useEffect, Suspense } from 'react';
import { PaginationProps, searchProductsAction } from '@/actions/products/search-product';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { GetProductDataResponse } from '@/types/get-data-response';
function SearchComponent() {
    const [isLoading, setIsLoading] = useState(true);
    const [searchWord, setSearchWord] = useState<string>("");
    const [products, setProducts] = useState<GetProductDataResponse[]>([]);
    const [pagination, setPagination] = useState<PaginationProps>(
        { count: "0", index: "0" }
    );

    async function handleSearch() {
        if (searchWord) {
            setIsLoading(true);
            const { products, success, error } = await searchProductsAction(searchWord);
            console.log('data', products);
            if (success) {
                setProducts(products as GetProductDataResponse[]);
            } else {
                console.error('Error fetching products:', error);
            }
            console.log(products)
            setIsLoading(false);
        }
    }

    async function handleLoadMore() {
        setPagination(prev => ({ count: prev.count, index: (prev.index + 1) }))
        const { products, success, error } = await searchProductsAction(searchWord, pagination);
        if (success) {
            setProducts(prev => prev.concat(products) as GetProductDataResponse[]);
        } else {
            console.error('Error fetching products:', error);
        }
    }

    return (
        <div className='min-h-screen p-8'>
            <div className='max-w-7xl mx-auto'>
                <div className='relative max-w-md mx-auto mb-8 overflow-hidden'>
                    <Input
                        type='text'
                        placeholder='Search products...'
                        value={searchWord}
                        onChange={e => setSearchWord(e.target.value)}
                        className='pr-14'
                        onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
                    />
                    <Button
                        onClick={handleSearch}
                        className='absolute -right-6 hover:-right-3.5 cursor-pointer w-16 h-12 flex items-center justify-start top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shadow transition-all duration-200'
                        style={{ zIndex: 2 }}
                    >
                        <Search />
                    </Button>
                </div>
                <div className='flex flex-col lg:flex-row gap-8'>
                    {
                        isLoading ?
                            <div className='flex justify-center items-center h-64 w-full'>
                                <span className='text-3xl font-bold'>Type the search word first</span>
                            </div> :
                            !isLoading && products.length === 0 ? (
                                <div className='flex justify-center items-center h-64 w-full'>
                                    <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900'></div>
                                </div>
                            ) : (
                                <div
                                    key='products'
                                    className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6`}
                                >
                                    {products.length ? products?.map((product) =>
                                        <ProductCard product={product} key={product.id} />) : "No Data"}
                                    <div className='flex items-center justify-center w-full'>
                                        <Button onClick={handleLoadMore}>Load More</Button>
                                    </div>
                                </div>
                            )}
                </div>
            </div>
        </div>
    );
}

export default function Component() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchComponent />
        </Suspense>
    );
}

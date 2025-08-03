'use client';

import { useState, useEffect, useCallback, RefObject, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { PaginationProps, searchProductsAction } from '@/actions/products/search-product';
import { GetProductDataResponse } from '@/types/get-data-response';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { SortByProps } from '@/types/props-types';
import { ProductGridCard } from '@/components/SearchResultCards/ProductCardGrid';
import { ProductListCard } from '@/components/SearchResultCards/ProductCardList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';
import { SearchHeader } from './SearchHeader';
import { ProductDataInterface } from '@/types/product-type';

interface SearchPageProps {
    categorySlug?: string;
}

const LoadMoreTrigger = ({ className, visiableRef, allProductsCalled }: { className?: string, visiableRef: RefObject<HTMLDivElement>, allProductsCalled: boolean }) => {
    return <div
        ref={visiableRef}
        className={cn('w-full flex items-center justify-center mt-8', className)}
    >
        {allProductsCalled ? <p>No More Products</p> : <Loader className="animate-spin h-5 w-5 text-purple-900" />}
    </div>
}

export default function SearchPage({ categorySlug }: SearchPageProps) {
    const [products, setProducts] = useState<ProductDataInterface[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [allProductsCalled, setAllProductsCalled] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<SortByProps>({
        orderProp: "name",
        way: "asc"
    });
    const [pagination, setPagination] = useState<PaginationProps>(
        {
            count: '16',
            index: '1'
        }
    );
    const [priceRange, setPriceRange] = useState<{ maxPrice: number; minPrice: number }>({ maxPrice: 0, minPrice: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const [visiableRef, isVisible] = useIntersectionObserver({
        threshold: 0.1,
    });

    function FetchProducts() {
        setIsLoading(true);
        let orderBy;
        if (typeof sortBy !== 'undefined')
            orderBy = {
                [sortBy.orderProp]: sortBy.way
            }
        searchProductsAction(searchQuery, pagination, undefined, categorySlug, priceRange, orderBy)
            .then(({ products, success, error }) => {
                if (!success || error) {
                    toast.error(error);
                    return;
                }
                setProducts(products || []);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                toast.error('Failed to fetch products');
            })
            .finally(() => setIsLoading(false));
    }

    useEffect(() => {
        if (!isVisible || allProductsCalled) return;
        setPagination(prev => (
            {
                ...prev,
                index: `${(Number(prev.index) + 1)}`
            }
        ));

        searchProductsAction(searchQuery,
            {
                count: pagination.count,
                index: `${(Number(pagination.index) + 1)}`,
            }
            , undefined, categorySlug, priceRange, {
            [sortBy.orderProp]: sortBy.way
        })
            .then(({ products, success, error }) => {
                if (!success || error) {
                    toast.error(error);
                    return;
                }
                if (products.length) {
                    setProducts(prev => prev.concat(products));
                } else {
                    setAllProductsCalled(true)
                }
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                toast.error('Failed to fetch products');
            })
            .finally(() => console.log(products.length));

    }, [isVisible]);

    useEffect(() => {
        FetchProducts()
    }, [sortBy]);


    const handleApplyFilters = useCallback(() => {
        if ((priceRange.maxPrice === 0 && priceRange.minPrice === 0) || (priceRange.maxPrice < priceRange.minPrice)) {
            toast.error('Please set a valid price range', { style: { backgroundColor: '#f87171', color: '#fff' } });
            return;
        }

        FetchProducts()
    }, [priceRange]);

    const handleSearch = useCallback(() => {
        if (!searchQuery.trim()) {
            toast.error('Please enter a search term');
            return;
        }

        FetchProducts()
    }, [searchQuery, categorySlug]);


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-8">


                <SearchHeader
                    categorySlug={categorySlug}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleSearch={handleSearch}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />

                {showFilters && (
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Filters</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label className="block text-sm font-medium mb-2">Min Price</Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={priceRange.minPrice}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                                    />
                                </div>
                                <div>
                                    <Label className="block text-sm font-medium mb-2">Max Price</Label>
                                    <Input
                                        type="number"
                                        placeholder="1000"
                                        value={priceRange.maxPrice}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                                    />
                                </div>
                                <div className="flex gap-3.5 items-end">
                                    <Button
                                        variant="default"
                                        onClick={handleApplyFilters}
                                    >
                                        Apply
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setPriceRange({ maxPrice: 0, minPrice: 1000 });
                                            setSearchQuery('');
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="mb-6">
                    <p className="text-gray-600">
                        Showing {products.length} of {products.length} products
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' && (
                            <ScrollArea className='h-[80vh]'>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.map((product, index) => <ProductGridCard
                                        key={index}
                                        product={product}
                                    />
                                    )}
                                    <LoadMoreTrigger className='col-span-full' visiableRef={visiableRef} allProductsCalled={allProductsCalled} />
                                </div>
                            </ScrollArea>
                        )}
                        {viewMode === 'list' && (
                            <ScrollArea className='h-[80vh]'>
                                <div className="flex flex-col gap-5">
                                    {products.map((product, index) =>
                                        <ProductListCard
                                            key={index}
                                            product={product}
                                        />
                                    )}
                                    <LoadMoreTrigger className='flex-1' visiableRef={visiableRef} allProductsCalled={allProductsCalled} />
                                </div>
                            </ScrollArea>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

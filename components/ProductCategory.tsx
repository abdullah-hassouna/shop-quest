import React from 'react';
import { ProductInterface } from '@/types/product-type';
import EmblaCarousel from './carousel/ProductsEmblaCarousel';
import { EmblaOptionsType } from 'embla-carousel'
import type { Category } from '@prisma/client';
import clsx from 'clsx';

const ProductCatalog = ({
    title,
    category,
    products,
}: {
    title?: string;
    category?: Category;
    products: ProductInterface[];
}) => {
    const OPTIONS: EmblaOptionsType = { slidesToScroll: 'auto', loop: true }
    const SLIDES = Array.from(products)

    if (products?.length === 0) {
        return;
    }
    return (
        <section className='mb-12'>
            {category ?
                <div className='flex items-center justify-center gap-5 mb-6'>
                    <div className='flex items-center justify-center gap-5 mb-6 flex-grow'>
                        <img
                            src={category.icon || 'https://via.placeholder.com/600x300'}
                            alt={category.name}
                            className='w-8 h-8 object-cover p-5' />
                        <h2 className={clsx(`text-4xl font-bold text-center`)} style={{ color: category.color || "black" }}>
                            {category.name}
                        </h2>
                        <img
                            src={category.icon || 'https://via.placeholder.com/600x300'}
                            alt={category.name}
                            className='w-8 h-8 object-cover p-5' />
                    </div>
                    <div className='text-4xl font-bold'>
                        <img src="https://img.icons8.com/?size=100&id=JnbibRvVxu7x&format=png&color=000000" alt="more_of_this" className='w-8 h-8 object-cover p-5' />
                    </div>
                </div> :
                <h2 className='text-4xl font-bold text-center mt-8 mb-5 capitalize'>{title}</h2>}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                <EmblaCarousel slides={SLIDES} options={OPTIONS} />
            </div>
        </section >
    );
};

export default ProductCatalog;

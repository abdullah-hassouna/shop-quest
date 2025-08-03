'use client';

import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { useEffect, useState } from 'react';
import { getAllCategoriesData } from '@/actions/categories/get-all-categories';
import { GetCategoryDataResponse, GetProductDataResponse } from '@/types/get-data-response';
import { getGroupProductsData } from '@/actions/products/get-group-products-data';
import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';

const ProductCategories = dynamic(
  () => import('@/components/ProductCategories'),
  {
    ssr: false,
    loading: () => <div className='w-full flex justify-around items-center py-32'><Loader className='w-10 h-10 animate-spin' /></div>
  })

const JustForYou = dynamic(
  () => import('@/components/JustForYou'),
  {
    ssr: false,
    loading: () => <div className='w-full flex justify-around items-center py-32'><Loader className='w-10 h-10 animate-spin' /></div>
  })

const TrendyProducts = dynamic(
  () => import('@/components/TrendyProducts'),
  {
    ssr: false,
    loading: () => <div className='w-full flex justify-around items-center py-32'><Loader className='w-10 h-10 animate-spin' />
    </div>
  })


export default function HomePage() {


  const [products, setProducts] = useState<GetProductDataResponse[]>([]);
  const [categories, setCategories] = useState<GetCategoryDataResponse[]>([]);

  useEffect(() => {
    const fetchAllCategories = async () => {
      const { categoriesData, error } = await getAllCategoriesData(6);
      if (categoriesData && !error) {
        setCategories(categoriesData);
      }
    };


    const fetchProducts = async () => {
      const { error, products } = await getGroupProductsData(32);
      if (error) {
        console.log(error)
        return
      }
      if (products) {
        setProducts(products);
      }
    };

    fetchAllCategories();
    fetchProducts();
  }, []);

  return (
    <div className='min-h-screen bg-gray-50'>
      <Toaster />
      <main className='container mx-auto px-4'>
        <section className='relative bg-white'>
          <div className='flex flex-col md:flex-row items-center justify-between'>
            <div className='md:w-1/2 text-center md:text-left p-8'>
              <p className='text-lg text-gray-500'>Starting At Only $20.5</p>
              <h1 className='text-5xl font-bold my-4'>
                <span className='text-gray-800'>SUMMER SPECIAL</span>
                <br />
                <span className='text-primary'>COLLECTION</span>
              </h1>
              <p className='text-gray-600 mb-8'>
                Find the perfect outfit for any occasion.
              </p>
              <Button className='bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90'>
                Shop Now
              </Button>
            </div>
            <div className='md:w-1/2'>
              <img
                src='hero-image.png'
                alt='Summer Collection'
                className='w-full h-auto rounded-2xl'
              />
            </div>
          </div>
        </section>
        <ProductCategories categories={categories} />
        <JustForYou categories={categories} products={products} />
        <TrendyProducts products={products.slice(0, 10)} />
      </main>
    </div>
  );
}

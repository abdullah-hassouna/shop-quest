'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCatalogryWithProducts } from '@/actions/products/get-category-with-products';

import ProductCatalog from '@/components/ProductCategory';
import { Toaster } from '@/components/ui/sonner';
import getUserSession from '@/actions/auth/regisreation/get-user-session';

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUserSession()
    const getData = async () => {
      const { categories } = await getCatalogryWithProducts();
      setCategories(categories || []);
      setIsLoading(false);
    };
    getData();
  }, []);

  return (
    <div className='min-h-screen'>
      <Toaster />
      <main className='container mx-auto px-4 py-8'>
        <section className='mb-12 '>
          <div className='relative overflow-hidden rounded-lg shadow-lg '>
            <div className='w-full h-[400px] relative'>
              <div className='absolute inset-0 flex flex-col justify-center items-center text-center p-8'>
                <h2 className='text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent z-3'>
                  Welcome to our Store!
                </h2>
                <p className='text-xl mb-8 text-gray-700 z-4'>
                  Discover the latest trends and exclusive deals on your
                  favorite products. Shop now and enjoy a seamless shopping
                  experience!
                </p>
                <img
                  src='https://assets.entrepreneur.com/content/3x2/2000/20150812074510-Online-shopping.jpeg?format=pjeg&auto=webp&crop=16:9&width=675&height=380'
                  alt='Hero Image'
                  className='absolute inset-0 w-full h-full object-cover opacity-20 z-1'
                />
                <Button className='bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white z-2 cursor-pointer'>
                  Shop Now
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </section>
        {isLoading && (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900'></div>
          </div>
        )}
        {categories.map((category: any) => (
          <ProductCatalog
            key={category?.id}
            category={category}
            products={
              category.products as unknown as any[]
            }
          />
        ))}
      </main>
    </div>
  );
}

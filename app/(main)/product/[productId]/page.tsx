'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import useCartStore from '@/stores/cartStore';
import { getProductData } from '@/actions/products/get-prodcut-data';
import ProductCatalog from '@/components/ProductCategory';
import { getRelatedProducts } from '@/actions/products/get-related-products';
import { toast } from 'sonner';
import { ProductInterface } from '@/types/product-type';
import ImagesCarousel from '@/components/carousel/ImagesEmblaCarousel';
import { Image } from '@prisma/client';
// import { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

export default function ProductDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ productId: string }>;
}) {
  const [productId, setProductId] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductInterface | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  // const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const unwrapParams = async () => {
      const { productId } = await paramsPromise;
      setProductId(productId);
    };
    unwrapParams();
  }, [paramsPromise]);

  useEffect(() => {
    const fetchData = async () => {
      if (!productId) return;

      try {
        const { productData } = await getProductData(productId);
        setProduct(productData as unknown as ProductInterface);

        if (productData) {
          const { relatedProducts } = await getRelatedProducts(productData as ProductInterface);
          console.log(relatedProducts)
          setRelatedProducts(_ => relatedProducts as ProductInterface[]);
        }
      } catch (error) {
        console.error('Failed to fetch product details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      //   addToCart({
      //     id: product.id,
      //     name: product.attributeValues.p_title.value || 'Product',
      //     price: product.attributeValues.p_price.value,
      //     quantity: 1,
      //     image: product.attributeValues.p_image.value.downloadLink,
      //   });
      //   toast('Added to Cart', {
      //     description: `${product.attributeValues.p_title.value} has been added to your cart.`,
      //     duration: 5000,
      //   });
      // }
    };

    if (isLoading) {
      return (
        <div className=' flex items-center justify-center'>
          <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900'>Loading</div>
        </div>
      );
    }
  }

  return (
    <div className='min-h-screen'>
      <main className='container mx-auto px-4 py-8'>
        <button
          className='mb-8 flex items-center text-purple-500 hover:text-purple-600 transition-colors duration-300 cursor-pointer'
          onClick={() => router.back()}
        >
          <ArrowLeft className='mr-2 h-5 w-5' />
          Back
        </button>

        {/* Product details */}
        <div className='grid md:grid-cols-2 gap-8'>
          <div className='relative overflow-hidden rounded-lg '>
            <ImagesCarousel slides={product?.imagesId ?? []} />
          </div>

          <div className='space-y-6'>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent'>
              {product?.name || 'Product Title'}
            </h1>

            <p className='text-xl font-semibold text-gray-700'>
              ${product?.price?.toFixed(2) || ''}
            </p>
            <div
              className='text-gray-500'
              dangerouslySetInnerHTML={{
                __html:
                  product?.description || '',
              }}
            />

            <div className='flex space-x-4'>
              <Button
                className='flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-semibold cursor-pointer'
                onClick={handleAddToCart}
              >
                <ShoppingCart className='mr-2 h-5 w-5' />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts?.length > 0 && (
          <section className='mt-16'>
            <ProductCatalog
              title='related products'
              category={undefined}
              products={relatedProducts as unknown as ProductInterface[]}
            />
          </section>
        )}
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProductData } from '@/actions/products/get-prodcut-data';
import ProductCatalog from '@/components/ProductCategory';
import { getRelatedProducts } from '@/actions/products/get-related-products';
import { toast } from 'sonner';
import { ProductInterface } from '@/types/product-type';
import ImagesCarousel from '@/components/carousel/ImagesEmblaCarousel';
import { GetProductDataResponse } from '@/types/get-data-response';
import useCartStore, { CartItem } from '@/store/cart-store';
import { Input } from '@/components/ui/input';

export default function ProductDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ productId: string }>;
}) {
  const [productId, setProductId] = useState<string | null>(null);
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [product, setProduct] = useState<GetProductDataResponse | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
        setProduct(productData as GetProductDataResponse);

        if (productData) {
          const { relatedProducts } = await getRelatedProducts(productData as unknown as ProductInterface);
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


  const reviews = product?.Review || [];
  let averageRating = 0;

  if (reviews.length === 0) {
  } else {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    averageRating = totalRating / reviews.length;
  }

  const handleAddToCart = () => {
    if (product) {
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: productQuantity,
        image: product.imagesId ? product.imagesId[0].url : '',
      };
      useCartStore.getState().addToCart(cartItem);
      toast.success(`${product.name} added to cart!`);
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

        <div className='grid md:grid-cols-2 gap-8'>
          <div className='relative overflow-hidden rounded-lg '>
            <ImagesCarousel slides={product?.imagesId ?? []} />
          </div>

          <div className='space-y-6'>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-primary bg-clip-text text-transparent'>
              {product?.name || 'Product Title'}
            </h1>

            <p className='text-xl font-semibold text-gray-700'>
              ${product?.price?.toFixed(2) || ''}
            </p>
            <div className="mt-1 flex items-center">
              {[...Array(averageRating)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 text-yellow-400 fill-yellow-400`}
                />
              ))}

              {[...Array(5 - averageRating)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 text-yellow-400`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-500">
                ({product?.Review?.length})
              </span>
            </div>
            <div
              className='text-gray-500'
              dangerouslySetInnerHTML={{
                __html:
                  product?.description || '',
              }}
            />

            <div className='flex space-x-4'>

              <div className="inline-flex justify-between items-center border border-gray-300 rounded-md overflow-hidden w-32 select-none bg-gray-50 font-sans">
                <Button
                  onClick={() => setProductQuantity(q => Math.max(1, q - 1))}
                  className="bg-gray-200 px-3 py-2 text-lg font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                  aria-label="Decrease quantity"
                >
                  −
                </Button>
                <Input
                  type="number"
                  value={productQuantity}
                  onChange={(e) => {
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val)) val = 1;
                    val = Math.max(1, Math.min(99, val));
                    setProductQuantity(val);
                  }}
                  min={1}
                  max={99}
                  className="w-12 text-center border-none outline-none text-base font-medium bg-transparent text-gray-800 select-text"
                  aria-label="Quantity input"
                />
                <Button
                  onClick={() => setProductQuantity(q => Math.min(99, q + 1))}
                  className="bg-gray-200 px-3 py-2 text-lg font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </Button>
              </div>

              <Button
                className='w-52 bg-gradient-to-r from-purple-500 via-pink-500 to-primary hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-semibold cursor-pointer'
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

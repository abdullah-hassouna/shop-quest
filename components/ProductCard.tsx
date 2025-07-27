import Link from 'next/link';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { GetProductDataResponse } from '@/types/get-data-response';
import useCartStore, { CartItem } from '@/store/cart-store';
import { toast } from 'sonner';

export default function ProductCard({ product }: { product: GetProductDataResponse }) {
  toast
  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.imagesId ? product.imagesId[0].url : '',
    };
    useCartStore.getState().addToCart(cartItem);
    toast.success(`${product.name} added to cart!`);
  }

  const reviews = product?.Review || [];
  let averageRating = 0;

  if (reviews.length === 0) {
  } else {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    averageRating = totalRating / reviews.length;
  }



  return (
    <div className="group relative">
      <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
        <img
          src={product.imagesId ? product.imagesId[0].url : ""}
          alt={product.imagesId ? product.imagesId[0].alt : ""}
          className="w-full h-full object-center object-cover lg:w-full lg:h-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link href={`/product/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
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
              ({product.Review?.length})
            </span>
          </div>
        </div>
        <p className="text-sm font-medium text-gray-900">
          {product.price && (
            <span className="line-through text-gray-500 mr-2">
              ${product.price.toFixed(2)}
            </span>
          )}
          ${product.price.toFixed(2)}
        </p>
      </div>
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button onClick={handleAddToCart} size="sm">Add to Cart</Button>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { GetCategoryDataResponse } from '@/types/get-data-response';


export default function ProductCategories({ categories }: { categories: GetCategoryDataResponse[] }) {

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center gap-8">
          {categories.map((category) => (
            <Link className='group' href={`/category/${category.slug}`} key={category.id}>
              <div className="text-center">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={category.icon || '/placeholder.svg'}
                    alt={category.name}
                    className="w-full h-32 mx-auto transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold mb-2">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
        <div className='col-span-2 mt-5 md:col-span-3 lg:col-span-6 w-full flex justify-center'>
          <Link href={'/category'} className='mx-auto rounded-md border text-sm border-black/20 px-3 py-1 transition-all hover:border-black/0 hover:bg-black/80 hover:text-white'>Show All</Link>
        </div>
      </div>
    </section>
  );
}
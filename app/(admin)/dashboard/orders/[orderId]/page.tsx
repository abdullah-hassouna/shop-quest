"use server"

import { getOneProductDataAction } from "@/actions/admin/products/get-one-product";
import ImagesCarousel from "@/components/carousel/ImagesEmblaCarousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GetOneProductDataAdminResponse } from "@/types/get-data-response";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface UserDataFormProps {
    params: Promise<{ productId: string }>;
}

export default async function ProductDataForm({ params: paramsPromise }: UserDataFormProps) {
    let errors: string[] = [];
    let initialProduct: GetOneProductDataAdminResponse | null = null;
    let isLoading = false;


    try {
        const { productId } = await paramsPromise;

        if (!productId || typeof productId !== 'string') {
            errors.push("Invalid user ID provided");
        } else {
            const productDataResult = await getOneProductDataAction(productId);

            if (productDataResult.success && productDataResult.data) {
                initialProduct = productDataResult.data;
            } else {
                errors.push(productDataResult.error || "Failed to fetch product data");
            }
        }
    } catch (err) {
        console.error('Error fetching initial data:', err);
        errors.push("An unexpected error occurred while fetching product data");
    }

    const ErrorDisplay = ({ errors }: { errors: string[] }) => (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Error{errors.length > 1 ? 's' : ''}</span>
            </div>
            <ul className="space-y-1">
                {errors.map((error, index) => (
                    <li key={index} className="text-sm">• {error}</li>
                ))}
            </ul>
        </div>
    );

    return (

        <div className='min-h-screen'>
            {errors.length > 0 && <ErrorDisplay errors={errors} />}

            {!errors.length && initialProduct && (
                <main className='container mx-auto px-4 py-8'>
                    <div className='flex flex-col gap-8'>
                        <div className='space-y-6'>

                            <div className="p-4 bg-accent-foreground/50 rounded-md text-white">
                                <span>Added by:</span>
                                <div className="w-fit mt-3 grid grid-cols-4 grid-rows-2 gap-0" >
                                    <Avatar className="col-span-1 row-span-2 h-14 w-14 ">
                                        <AvatarImage src={initialProduct.seller.image} />
                                        <AvatarFallback className="bg-foreground">{initialProduct.seller.name.split("")[0]}</AvatarFallback>
                                    </Avatar>
                                    <Link href={`../users/${initialProduct.seller.id}`} className="col-span-3 row-span-1">
                                        {initialProduct.seller.name}
                                    </Link>
                                    <div className="col-span-3 row-span-1">
                                        <span>
                                            at: {initialProduct.createdAt.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-5 flex-wrap items-baseline">
                                <h1 className='text-3xl font-bold '>
                                    {initialProduct?.name || 'Product Title'}
                                </h1>

                                <Badge style={{ background: initialProduct.category.color }}>
                                    <img src={initialProduct.category.icon} alt={initialProduct.category.name} className="mx-1" /> <span className="capitalize">{initialProduct.category.name}</span>
                                </Badge>
                            </div>
                            <p className='text-xl font-semibold text-gray-700'>
                                ${initialProduct?.price?.toFixed(2) || ''}
                            </p>
                            <div className="w-[50%] flex gap-2 flex-wrap">
                                {initialProduct.tags.map(t => <Badge key={t.id} className="capitalize" variant={"secondary"} >
                                    {t.name}
                                </Badge>)}
                            </div>
                            <div
                                className='text-gray-500'
                                dangerouslySetInnerHTML={{
                                    __html:
                                        initialProduct?.description || '',
                                }}
                            />
                        </div>
                        <div className='grid grid-cols-4 gap-5'>
                            {initialProduct?.imagesId.map(img =>
                                <img className="w-52 h-auto object-contain" src={img.url} alt={img.alt} id={img.id} />
                            )}
                        </div>
                    </div>
                </main>
            )
            }

            {
                isLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )
            }
        </div >
    )
}
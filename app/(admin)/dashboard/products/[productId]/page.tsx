"use server"

import { getOneProductDataAction } from "@/actions/admin/products/get-one-product";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GetOneProductDataAdminResponse } from "@/types/get-data-response";
import { AlertTriangle, Calendar, DollarSign, Package, Tag, User } from "lucide-react";
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
        <div className='min-h-screen bg-gray-50/40 p-6'>
            {errors.length > 0 && <ErrorDisplay errors={errors} />}

            {!errors.length && initialProduct && (
                <div className='max-w-7xl mx-auto space-y-6'>
                    {/* Header Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <CardTitle className="text-2xl flex items-center gap-3">
                                        {initialProduct?.name || 'Product Title'}
                                        <Badge style={{ background: initialProduct.category.color }}>
                                            <img src={initialProduct.category.icon} alt={initialProduct.category.name} className="w-4 h-4 mr-1" />
                                            <span className="capitalize">{initialProduct.category.name}</span>
                                        </Badge>
                                    </CardTitle>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <DollarSign className="w-4 h-4" />
                                        <span className="text-xl font-semibold">
                                            {initialProduct?.price?.toFixed(2) || ''}
                                        </span>
                                    </div>
                                </div>

                                {/* Seller Info */}
                                <Card className="bg-primary text-primary-foreground p-4">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={initialProduct.seller.image} />
                                            <AvatarFallback>{initialProduct.seller.name.split("")[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <Link
                                                href={`../users/${initialProduct.seller.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {initialProduct.seller.name}
                                            </Link>
                                            <div className="flex items-center text-sm gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(initialProduct.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Tags */}
                            <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4 text-muted-foreground" />
                                <div className="flex gap-2 flex-wrap">
                                    {initialProduct.tags.map(t => (
                                        <Badge key={t.id} variant="secondary" className="capitalize">
                                            {t.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Description */}
                            <div className="prose max-w-none">
                                <div
                                    className='text-gray-600'
                                    dangerouslySetInnerHTML={{
                                        __html: initialProduct?.description || '',
                                    }}
                                />
                            </div>

                            <Separator />

                            {/* Images Gallery */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Product Images</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {initialProduct?.imagesId.map(img => (
                                        <div key={img.id} className="aspect-square rounded-lg overflow-hidden border bg-white">
                                            <img
                                                className="w-full h-full object-contain hover:scale-105 transition-transform"
                                                src={img.url}
                                                alt={img.alt}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {isLoading && (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}
        </div>
    )
}
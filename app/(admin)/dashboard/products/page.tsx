"use server"

import { ProductsDataTable } from "@/components/admin/tables/products-data-table";
import { getAllProducts, getAllProductsPages } from "@/actions/admin/products/get-all-products";
import { GetProductDataResponse } from "@/types/get-data-response";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddNewProductDialog from "@/components/admin/dialogs/AddNewProduct";
import { CirclePlus } from "lucide-react";


export default async function ProductsTab() {
    const defaultPageSize = 5;
    const initialPage = 1;

    let initialPorducts: GetProductDataResponse[] = [];
    let initialMaxProductsPagesCount = 1;
    let error: string[] = [];

    try {

        const productsResult = await getAllProducts(initialPage, defaultPageSize);
        const productspagesResult = await getAllProductsPages(defaultPageSize);

        // Products data fetching
        if (productsResult.success && productsResult.data) {
            initialPorducts = productsResult.data;
        } else {
            error = [productsResult.error || "Failed to fetch products", ...error];
        }

        if (productspagesResult.success && productspagesResult.data) {
            initialMaxProductsPagesCount = productspagesResult.data;
        }
    } catch (err) {
        console.error('Error fetching initial data:', err);
        error = ["Unexpected error occurred"];
    }

    const tableConfig = {
        defaultPageSize,
        availablePageSizes: [5, 10, 25, 50]
    };


    return (
        <div className="p-6 space-y-6">
            {(error.length) ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error.map(err => err)}
                </div>
            ) : <></>}
            <div className='flex justify-between items-center'>
                <span className='text-2xl font-bold'>Products</span>
                <AddNewProductDialog>
                    <div className='py-2 px-4 bg-black text-white rounded-md flex items-center gap-3'><CirclePlus className='w-5 h-5' /> Add new Product</div>
                </AddNewProductDialog>
            </div>
            <div className="grid grid-cols-2 space-x-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Products</CardTitle>
                        <CardDescription>Best selling products this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Wireless Headphones</p>
                                    <p className="text-xs text-muted-foreground">1,234 sold</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">$89,432</p>
                                    <Badge variant="outline" className="text-green-600">
                                        +15%
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Smart Watch</p>
                                    <p className="text-xs text-muted-foreground">856 sold</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">$67,890</p>
                                    <Badge variant="outline" className="text-green-600">
                                        +8%
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Laptop Stand</p>
                                    <p className="text-xs text-muted-foreground">432 sold</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">$23,456</p>
                                    <Badge variant="outline" className="text-red-600">
                                        -3%
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Top Products</CardTitle>
                        <CardDescription>Best selling products this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Wireless Headphones</p>
                                    <p className="text-xs text-muted-foreground">1,234 sold</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">$89,432</p>
                                    <Badge variant="outline" className="text-green-600">
                                        +15%
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Smart Watch</p>
                                    <p className="text-xs text-muted-foreground">856 sold</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">$67,890</p>
                                    <Badge variant="outline" className="text-green-600">
                                        +8%
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Laptop Stand</p>
                                    <p className="text-xs text-muted-foreground">432 sold</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">$23,456</p>
                                    <Badge variant="outline" className="text-red-600">
                                        -3%
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <ProductsDataTable
                key={"products-data-table"}
                data={initialPorducts}
                initialMaxPagesCount={initialMaxProductsPagesCount}
                tableConfig={tableConfig}
            />
        </div>
    )
}

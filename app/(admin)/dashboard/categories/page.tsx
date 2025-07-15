"use server"

import { getAllCategories, getAllCategoriesPages } from "@/actions/admin/categories/get-all-categories";
import AddNewCategoryDialog from "@/components/admin/dialogs/AddNewCategory";
import { CategoriesDataTable } from "@/components/admin/tables/categories-data-table";
import { GetCategoryDataAdminResponse } from "@/types/get-data-response";
import { CirclePlus } from "lucide-react";


export default async function CategoriesTab() {
    const defaultPageSize = 5;
    const initialPage = 1;

    let initialCategories: GetCategoryDataAdminResponse[] = [];
    let initialMaxCategoriesPagesCount = 1;
    let error: string[] = [];

    try {

        const categoriesResult = await getAllCategories(initialPage, defaultPageSize);
        const categoriesPagesResult = await getAllCategoriesPages(defaultPageSize);

        // Categories data fetching
        if (categoriesResult.success && categoriesResult.data) {
            initialCategories = categoriesResult.data;
        } else {
            error = [categoriesResult.error || "Failed to fetch categories", ...error];
        }

        if (categoriesPagesResult.success && categoriesPagesResult.data) {
            initialMaxCategoriesPagesCount = categoriesPagesResult.data;
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
        <div className="p-6 space-y-4">
            {(error.length) ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error.map(err => err)}
                </div>
            ) : <></>}

            <div className='flex justify-between items-center'>
                <span className='text-2xl font-bold'>Categories</span>
                <AddNewCategoryDialog>
                    <div className='py-2 px-4 bg-black text-white rounded-md flex items-center gap-3'><CirclePlus className='w-5 h-5' /> Add new Category</div>
                </AddNewCategoryDialog>
            </div>

            <CategoriesDataTable
                key={"order-data-table"}
                data={initialCategories}
                initialMaxPagesCount={initialMaxCategoriesPagesCount}
                tableConfig={tableConfig}
            />
        </div>
    )
}

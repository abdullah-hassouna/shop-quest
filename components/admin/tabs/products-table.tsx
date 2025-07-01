"use server"

import { ProductsDataTable } from "@/components/admin/ProductsDataTable";
import { getAllProducts, getAllProductsPages } from "@/actions/admin/products/get-all-products";
import { GetProductDataResponse } from "@/types/get-data-response";


export default async function ProductsTable() {
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
    <div className="p-6 space-y-4">
      {(error.length) ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error.map(err => err)}
        </div>
      ) : <></>}

      <ProductsDataTable
        data={initialPorducts}
        initialMaxPagesCount={initialMaxProductsPagesCount}
        tableConfig={tableConfig}
      />
    </div>
  )
}

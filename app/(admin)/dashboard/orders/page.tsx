"use server"

import { getAllOrders, getAllOrdersPages } from "@/actions/admin/order/get-all-orders-data";
import { OrdersDataTable } from "@/components/admin/tables/orders-data-table";
import { GetOrderDataAdminResponse } from "@/types/get-data-response";


export default async function OrdersTab() {
    const defaultPageSize = 5;
    const initialPage = 1;

    let initialOrders: GetOrderDataAdminResponse[] = [];
    let initialMaxOrdersPagesCount = 1;
    let error: string[] = [];

    try {

        const ordersResult = await getAllOrders(initialPage, defaultPageSize);
        const orderspagesResult = await getAllOrdersPages(defaultPageSize);

        // Orders data fetching
        if (ordersResult.success && ordersResult.data) {
            initialOrders = ordersResult.data;
        } else {
            error = [ordersResult.error || "Failed to fetch orders", ...error];
        }

        if (orderspagesResult.success && orderspagesResult.data) {
            initialMaxOrdersPagesCount = orderspagesResult.data;
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
                <span className='text-2xl font-bold'>Orders</span>
            </div>

            <OrdersDataTable
                key={"order-data-table"}
                data={initialOrders}
                initialMaxPagesCount={initialMaxOrdersPagesCount}
                tableConfig={tableConfig}
            />
        </div>
    )
}

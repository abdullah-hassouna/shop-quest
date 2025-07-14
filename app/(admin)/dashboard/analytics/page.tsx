import React from 'react';
import { ChartAreaGradient } from '@/components/admin/chart/chart-area-gradient';
import { getAVGOrdersSales } from '@/actions/admin/order/get-avg-orders-number';
import { GetAvgOrderSalesDataResponse } from '@/types/get-data-response';

export default function Dashboard() {
    console.log('Dashboard re-rendering');

    let ChartData: GetAvgOrderSalesDataResponse[] = []

    const fetchAVGOrderSales = async () => {
        try {
            const callAvgOrdersRespone = await getAVGOrdersSales({ from: "january", to: "fabuary" })
            if (callAvgOrdersRespone.success && callAvgOrdersRespone.data) {
                console.log(callAvgOrdersRespone.data)
            }
            else if (callAvgOrdersRespone.error) {
                console.log(callAvgOrdersRespone.error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    fetchAVGOrderSales()


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Dashboard Overview
                    </h1>
                    <p className="text-gray-600">
                        Your business metrics for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                </div>

                <div className='grid grid-cols-4'>
                    <div className='col-span-2'>
                        <ChartAreaGradient
                            chartData={ChartData}
                            chartConfig={{ number: { label: "Orders", color: "text-blue-500" } }}
                            chartDescription={{ title: "Orders", desc: `Avg Orders Number` }} />
                    </div>
                </div>


                {/* Summary Cards */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Quick Stats
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Today's Revenue</span>
                                <span className="font-medium text-gray-900">$4,287</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Yesterday's Orders</span>
                                <span className="font-medium text-gray-900">127</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Active Sessions</span>
                                <span className="font-medium text-gray-900">1,432</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Pending Orders</span>
                                <span className="font-medium text-gray-900">23</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Performance Summary
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Sales Target Progress</span>
                                <span className="font-medium text-green-600">84.2%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Best Selling Product</span>
                                <span className="font-medium text-gray-900">Premium Plan</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Top Traffic Source</span>
                                <span className="font-medium text-gray-900">Organic Search</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Customer Retention</span>
                                <span className="font-medium text-blue-600">78.3%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
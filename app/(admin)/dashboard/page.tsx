import React from 'react';
import {
    Users,
    CreditCard,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Activity,
    UserCheck,
    Package,
    Target,
    BarChart3,
    Eye
} from 'lucide-react';

export default function Dashboard() {
    const metrics = [
        {
            title: "Total Users",
            value: "24,543",
            change: "+12.5%",
            changeType: "positive",
            icon: Users,
            description: "Active users this month"
        },
        {
            title: "Monthly Revenue",
            value: "$127,450",
            change: "+8.3%",
            changeType: "positive",
            icon: DollarSign,
            description: "Total revenue this month"
        },
        {
            title: "Orders",
            value: "3,247",
            change: "+15.2%",
            changeType: "positive",
            icon: ShoppingCart,
            description: "Orders completed this month"
        },
        {
            title: "Payment Success Rate",
            value: "98.7%",
            change: "+0.3%",
            changeType: "positive",
            icon: CreditCard,
            description: "Successful payments this month"
        },
        {
            title: "New Customers",
            value: "1,832",
            change: "+22.1%",
            changeType: "positive",
            icon: UserCheck,
            description: "First-time customers this month"
        },
        {
            title: "Average Order Value",
            value: "$89.24",
            change: "-2.4%",
            changeType: "negative",
            icon: TrendingUp,
            description: "Average per order this month"
        },
        {
            title: "Products Sold",
            value: "15,678",
            change: "+18.7%",
            changeType: "positive",
            icon: Package,
            description: "Total items sold this month"
        },
        {
            title: "Conversion Rate",
            value: "4.2%",
            change: "+0.8%",
            changeType: "positive",
            icon: Target,
            description: "Visitor to customer conversion"
        },
        {
            title: "Monthly Visitors",
            value: "89,432",
            change: "+28.4%",
            changeType: "positive",
            icon: Eye,
            description: "Unique website visitors"
        },
        {
            title: "Customer Satisfaction",
            value: "4.8/5",
            change: "+0.1",
            changeType: "positive",
            icon: Activity,
            description: "Average rating this month"
        },
        {
            title: "Return Rate",
            value: "2.1%",
            change: "-0.5%",
            changeType: "positive",
            icon: TrendingDown,
            description: "Product return rate"
        },
        {
            title: "Sales Growth",
            value: "+24.8%",
            change: "vs last month",
            changeType: "neutral",
            icon: BarChart3,
            description: "Month-over-month growth"
        }
    ];

    const getChangeColor = (changeType: any) => {
        switch (changeType) {
            case 'positive': return 'text-green-600 bg-green-50';
            case 'negative': return 'text-red-600 bg-red-50';
            default: return 'text-blue-600 bg-blue-50';
        }
    };

    const getIconBgColor = (changeType: any) => {
        switch (changeType) {
            case 'positive': return 'bg-green-100 text-green-600';
            case 'negative': return 'bg-red-100 text-red-600';
            default: return 'bg-blue-100 text-blue-600';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Dashboard Overview
                    </h1>
                    <p className="text-gray-600">
                        Your business metrics for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {metrics.map((metric, index) => {
                        const IconComponent = metric.icon;

                        return (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2 rounded-lg ${getIconBgColor(metric.changeType)}`}>
                                        <IconComponent className="w-5 h-5" />
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getChangeColor(metric.changeType)}`}>
                                        {metric.change}
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                                        {metric.title}
                                    </h3>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {metric.value}
                                    </p>
                                </div>

                                <p className="text-xs text-gray-400">
                                    {metric.description}
                                </p>
                            </div>
                        );
                    })}
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
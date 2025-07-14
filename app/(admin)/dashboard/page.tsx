import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Users,
    CreditCard,
    Activity,
    TrendingUp,
    TrendingDown,
    Eye,
    ShoppingCart,
} from "lucide-react"

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-50/40">
            {/* Header */}
            <header className="border-b bg-white">
                <div className="flex h-16 items-center px-6">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-semibold">Dashboard</h1>
                    </div>
                    <div className="ml-auto flex items-center space-x-4">
                        <Button variant="outline" size="sm">
                            Export
                        </Button>
                        <Button size="sm">Add Widget</Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold tracking-tight">Good morning, Alex</h2>
                    <p className="text-muted-foreground">Here's what's happening with your business today.</p>
                </div>

                {/* Metrics Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    {/* Total Revenue */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$45,231.89</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                                <span className="text-green-500">+20.1%</span>
                                <span className="ml-1">from last month</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subscriptions */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+2,350</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                                <span className="text-green-500">+180.1%</span>
                                <span className="ml-1">from last month</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sales */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sales</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+12,234</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                                <span className="text-green-500">+19%</span>
                                <span className="ml-1">from last month</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Now */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+573</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                                <span className="text-green-500">+201</span>
                                <span className="ml-1">since last hour</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Secondary Metrics */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    {/* Monthly Growth */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Monthly Growth</CardTitle>
                            <CardDescription>Revenue growth over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-green-600">+24.5%</div>
                                    <p className="text-xs text-muted-foreground">vs last month</p>
                                </div>
                                <div className="flex items-center">
                                    <TrendingUp className="h-8 w-8 text-green-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Conversion Rate */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Conversion Rate</CardTitle>
                            <CardDescription>Visitors to customers</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">3.24%</div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                                        <span className="text-red-500">-0.4%</span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <TrendingDown className="h-8 w-8 text-red-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Page Views */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Page Views</CardTitle>
                            <CardDescription>Total page views today</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">89,432</div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                                        <span className="text-green-500">+12.3%</span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Eye className="h-8 w-8 text-blue-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                    {/* Recent Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>Latest customer orders</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <ShoppingCart className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Order #3210</p>
                                            <p className="text-xs text-muted-foreground">2 minutes ago</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary">$299.00</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <ShoppingCart className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Order #3209</p>
                                            <p className="text-xs text-muted-foreground">5 minutes ago</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary">$149.00</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                            <ShoppingCart className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Order #3208</p>
                                            <p className="text-xs text-muted-foreground">12 minutes ago</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary">$79.00</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Products */}
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
            </main>
        </div>
    )
}

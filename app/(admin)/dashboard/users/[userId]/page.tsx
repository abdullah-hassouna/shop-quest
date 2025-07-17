"use server"

import { getUserData } from "@/actions/admin/users/get-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetOneUserDataAdminResponse } from "@/types/get-data-response";
import { ArrowDown, Calendar, Package, AlertTriangle, MailCheck, MailWarning, CreditCard, Clock } from "lucide-react";
import Link from "next/link";

interface UserDataFormProps {
    params: Promise<{ userId: string }>;
}

export default async function UserDataForm({ params: paramsPromise }: UserDataFormProps) {
    let errors: string[] = [];
    let initialUser: GetOneUserDataAdminResponse | null = null;
    let isLoading = false;

    try {
        const { userId } = await paramsPromise;

        // Validate userId
        if (!userId || typeof userId !== 'string') {
            errors.push("Invalid user ID provided");
        } else {
            const userDataResult = await getUserData(userId);

            if (userDataResult.success && userDataResult.data) {
                initialUser = userDataResult.data;
            } else {
                errors.push(userDataResult.error || "Failed to fetch user data");
            }
        }
    } catch (err) {
        console.error('Error fetching initial data:', err);
        errors.push("An unexpected error occurred while fetching user data");
    }

    // Error display component
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

    // User avatar component

    const Stats = ({ user }: { user: GetOneUserDataAdminResponse }) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{user.Order?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">
                        Lifetime orders
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${user.Order?.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Lifetime spending
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Days as member
                    </p>
                </CardContent>
            </Card>
        </div>
    );

    // Order item component
    const OrderItem = ({ order, index }: { order: any; index: number }) => (
        <Card className="h-fit">
            <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                        <h4 className="font-semibold">Order #{index + 1}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-1" />
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Unknown date"}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold">
                            ${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}
                        </div>
                        <Badge variant="secondary">
                            {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                        </Badge>
                    </div>
                </div>

                {order.items && order.items.length > 0 && (
                    <details className="group">
                        <summary className="cursor-pointer flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors">
                            <Package className="w-4 h-4" />
                            <span>View Items</span>
                            <ArrowDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="mt-3 space-y-2">
                            {order.items.map((item: any, itemIndex: number) => (
                                <div
                                    key={itemIndex}
                                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                                >
                                    {item.product?.imagesId && item.product.imagesId[0] && (
                                        <img
                                            src={item.product.imagesId[0].url}
                                            alt={item.product.name}
                                            className="w-12 h-12 rounded-md object-cover"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`../products/${item.product.id}`}
                                            className="font-medium text-sm hover:text-primary truncate block">
                                            {item.product?.name || "Unknown Product"}
                                        </Link>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>Qty: {item.quantity}</span>
                                            <span>•</span>
                                            <span>${item.product?.price}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </details>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="p-6 space-y-6 bg-gray-50/40">
            {errors.length > 0 && <ErrorDisplay errors={errors} />}

            {!errors.length && initialUser && (
                <div className="max-w-7xl mx-auto space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start gap-6">
                                <Avatar className="w-24 h-24">
                                    <AvatarImage src={initialUser.image || ''} />
                                    <AvatarFallback className="text-4xl">
                                        {initialUser.name?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-bold">
                                            {initialUser.name || "Unknown User"}
                                        </h2>
                                        <Badge variant={initialUser.role.startsWith('ADMIN') ? 'destructive' : 'default'}>
                                            {initialUser.role}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        {initialUser.emailVerified ?
                                            <MailCheck className="text-green-500 w-4 h-4" /> :
                                            <MailWarning className="text-destructive w-4 h-4" />
                                        }
                                        <span>{initialUser.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <span>Joined {new Date(initialUser.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <Stats user={initialUser} />

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Order History
                                <Badge variant="secondary" className="ml-2">
                                    {initialUser.Order?.length || 0}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {initialUser.Order && initialUser.Order.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {initialUser.Order.map((order, index) => (
                                        <OrderItem key={index} order={order} index={index} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No orders found for this user.</p>
                                </div>
                            )}
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
    );
}
"use server"

import { getUserData } from "@/actions/admin/users/get-user";
import { GetOneUserDataAdminResponse } from "@/types/get-data-response";
import { ArrowDown, User, Calendar, Mail, Shield, Package, AlertTriangle, MailCheck, MapPinCheck, MailWarning } from "lucide-react";
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
    const UserAvatar = ({ user }: { user: GetOneUserDataAdminResponse }) => (
        <div className="flex-shrink-0">
            {user.image ? (
                <img
                    src={user.image}
                    alt={user.name || "User avatar"}
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                    loading="lazy"
                />
            ) : (
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                    <User className="w-24 h-24 text-gray-400" />
                </div>
            )}
        </div>
    );

    const UserInfo = ({ user }: { user: GetOneUserDataAdminResponse }) => (
        <div className="flex-1 min-w-0 mt-8">
            <div className="flex items-baseline justify-start">
                <h2 className="text-2xl font-bold text-gray-900 truncate">
                    {user.name || "Unknown User"}
                </h2>
                <span className="capitalize mx-8">{user.role.toLocaleLowerCase()}</span>
            </div>
            <div className="mt-2 space-y-1">
                {user.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                        {user.emailVerified ? <MailCheck className="text-green-600 w-4 h-4" /> : <MailWarning className="text-red-800 w-4 h-4" />}
                        <span className="truncate">{user.email}</span>
                    </div>
                )}
                {user.createdAt && (
                    <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                )}
            </div>
        </div>
    );

    // Order item component
    const OrderItem = ({ order, index }: { order: any; index: number }) => (
        <li className="border border-gray-200 h-fit rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="font-medium text-gray-900">
                        Order #{index + 1}
                    </div>
                    <div className="text-sm text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Unknown date"}
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-semibold text-lg">
                        ${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}
                    </div>
                    <div className="text-sm text-gray-500">
                        {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>

            {order.items && order.items.length > 0 && (
                <details className="group">
                    <summary className="cursor-pointer flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors select-none">
                        <Package className="w-4 h-4" />
                        <span>View Items</span>
                        <ArrowDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-3 space-y-2 pl-6">
                        {order.items.map((item: any, itemIndex: number) => (
                            <div
                                key={itemIndex}
                                className="flex items-center gap-3 p-2 bg-gray-50 rounded border"
                            >
                                <div className="flex-1">
                                    <Link
                                        href={`../products/${item.product.id}`}
                                        className="font-medium text-sm">
                                        {item.product?.name || "Unknown Product"}
                                    </Link>
                                    <div className="text-xs text-gray-600">
                                        Qty: {item.quantity || 0} • Price: ${item.product?.price || 0}
                                    </div>
                                </div>
                                {item.product?.imagesId && item.product.imagesId.length > 0 && (
                                    <div className="flex gap-1">
                                        {item.product.imagesId.slice(0, 3).map((img: any, imgIndex: number) => (
                                            <img
                                                key={imgIndex}
                                                src={img.url}
                                                alt={img.alt || item.product.name || "Product image"}
                                                className="w-8 h-8 rounded object-cover border"
                                                loading="lazy"
                                            />
                                        ))}
                                        {item.product.imagesId.length > 3 && (
                                            <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-xs font-medium">
                                                +{item.product.imagesId.length - 3}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </details>
            )}
        </li>
    );

    return (
        <div className="p-6 w-full mx-auto">
            {errors.length > 0 && <ErrorDisplay errors={errors} />}

            {!errors.length && initialUser && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* User Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-start gap-4">
                            <UserAvatar user={initialUser} />
                            <UserInfo user={initialUser} />
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="w-5 h-5 text-gray-700" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                Order History
                            </h3>
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                                {initialUser.Order?.length || 0}
                            </span>
                        </div>

                        {initialUser.Order && initialUser.Order.length > 0 ? (
                            <ul className="grid grid-cols-4 space-x-4 ">
                                {initialUser.Order.map((order, index) => (
                                    <OrderItem key={index} order={order} index={index} />
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No orders found for this user.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}
        </div>
    );
}
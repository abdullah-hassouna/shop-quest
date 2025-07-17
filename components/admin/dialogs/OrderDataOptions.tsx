import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog } from '@radix-ui/react-dialog'
import { Separator } from '@radix-ui/react-separator'
import { Calendar, Eye, MoreVertical, Package, Receipt, Ungroup, X } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function OrderDataOptions({ row }: { row: any }) {
    return (
        <div className='text-black/50 w-fit rounded-md flex px-1.5 items-center justify-evenly'>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className='transition-all hover:bg-black hover:text-white rounded-md p-1'>
                        <Eye className='w-5 h-5' />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Receipt className="w-5 h-5" />
                            Order Details
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 pt-4">
                        {/* Order Info & Status */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Order ID</p>
                                <p className="font-medium">#{row.getValue("id").slice(0, 8)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Date</p>
                                <p className="font-medium flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(row.getValue("createdAt")).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge variant="outline" className="capitalize">
                                    {row.getValue("status")}
                                </Badge>
                            </div>
                        </div>

                        <Separator />

                        {/* Customer Info */}
                        <div>
                            <h3 className="text-sm font-medium mb-3">Customer Information</h3>
                            <Link
                                href={`users/${row.getValue("buyer").id}`}
                                className="flex items-center gap-4 hover:bg-accent rounded-lg p-3 transition-colors"
                            >
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={row.getValue("buyer").image} />
                                    <AvatarFallback>{row.getValue("buyer").name?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{row.getValue("buyer").name}</p>
                                    <p className="text-sm text-muted-foreground truncate">{row.getValue("buyer").email}</p>
                                </div>
                                <Button variant="ghost" size="sm">
                                    View Profile
                                </Button>
                            </Link>
                        </div>

                        <Separator />

                        {/* Order Summary */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Total Items</p>
                                <p className="text-2xl font-semibold">{row.getValue("items").length}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Total Quantity</p>
                                <p className="text-2xl font-semibold">
                                    {row.getValue("items").reduce((sum: number, item: any) => sum + item.quantity, 0)}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Total Amount</p>
                                <p className="text-2xl font-semibold text-green-600">
                                    ${row.getValue("total")?.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Products List */}
                        <div>
                            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                                <Package className="w-4 h-4" /> Order Items
                            </h3>
                            <ScrollArea className="h-[300px]">
                                <div className="space-y-2 pr-4">
                                    {row.getValue("items").map((item: any, index: number) => (
                                        <Link
                                            key={index}
                                            href={`products/${item.product.id}`}
                                            className="flex items-center gap-4 hover:bg-accent rounded-lg p-3 transition-colors"
                                        >
                                            {item.product.imagesId?.[0] && (
                                                <img
                                                    src={item.product.imagesId[0].url}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 rounded-md object-cover"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">
                                                    {item.product.name}
                                                </p>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <span>Qty: {item.quantity}</span>
                                                    <span>•</span>
                                                    <span>${item.product.price} each</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    ${(item.quantity * item.product.price).toFixed(2)}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <span className='px-0.5 text-xl pb-1.5'>|</span>
            <Popover>
                <PopoverTrigger className='transition-all hover:bg-black hover:text-white rounded-md p-1' ><MoreVertical className='w-5 h-5' /></PopoverTrigger>
                <PopoverContent className='max-w-40 p-0'>
                    <div className='px-1 py-2 justify-between items-start flex flex-col gap-2'>
                        <Button variant={"ghost"} className='flex justify-start items-center gap-2 w-full px-1.5 group hover:bg-black rounded-md'>
                            <Ungroup className='group-hover:font-bold group-hover:text-white text-gray-800 w-4 h-4' /> <span className='group-hover:font-bold group-hover:text-white text-gray-800'>Edit</span>
                        </Button>
                        <Button variant={"ghost"} className='flex justify-start items-center gap-2 w-full px-1.5 group hover:bg-red-600 rounded-md'>
                            <X className='group-hover:font-bold group-hover:text-white text-red-600 w-4 h-4' /> <span className='group-hover:font-bold group-hover:text-white text-red-600'>Delete</span>
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default OrderDataOptions
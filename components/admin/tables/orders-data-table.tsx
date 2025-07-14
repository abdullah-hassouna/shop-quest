"use client";

import { useState, useEffect, useCallback } from 'react';
import { GetOrderDataAdminResponse, } from "@/types/get-data-response"
import { Button } from '@/components/ui/button';
import { Badge, } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableHeader } from '@/components/ui/table';
import { ArrowDown, ArrowLeft, CirclePlus, } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AddNewProductDialog from '../dialogs/AddNewProduct';
import Link from 'next/link';
import { EnhancedDataTableProps, OrderBy } from '@/types/general';
import { getAllOrders, getAllOrdersPages } from '@/actions/admin/order/get-all-orders-data';
import { OrderStatus } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

export function OrdersDataTable({
    data,
    initialMaxPagesCount,
    tableConfig
}: EnhancedDataTableProps<GetOrderDataAdminResponse>) {
    const [usersOrders, setUsersOrders] = useState<GetOrderDataAdminResponse[]>(data);
    const [page, setPage] = useState<number>(1);
    const [maxPagesCount, setMaxPagesCount] = useState<number>(initialMaxPagesCount);
    const [pageTakeNum, setPagesTakeNum] = useState<number>(tableConfig.defaultPageSize);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [orderBy, setOrderBy] = useState<OrderBy | null>(null);
    const [search, setSearch] = useState<string>("");
    const [selectedList, setSelectedList] = useState<string[]>([]);


    const changeOrderBy = (column: string) => {
        setOrderBy(orderBy?.sort == "desc" ? null : { order: column, sort: orderBy?.sort === "asc" ? "desc" : "asc" })
    }

    const HeaderCell = ({ title, column }: { title: string, column: string }) => <Button onClick={() => changeOrderBy(column)} className='space-x-2' variant={"ghost"}>
        <span className="mr-2">{title}</span>
        {orderBy?.order === column && <ArrowDown className={cn("h-4 w-4", { "rotate-180": orderBy?.order === column && orderBy?.sort === "desc" })} />}
    </Button>


    const columns = [
        {
            title: "ID",
            accessorKey: 'id',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => row.getValue('id'),
        },
        {
            title: "Buyer",
            accessorKey: 'buyer',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => <Link href={`./users/${row.getValue('buyer').id}`} className='capitalize'>{row.getValue('buyer').name}</Link>,
        },
        {
            title: "Total",
            accessorKey: 'total',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => row.getValue('total'),
        },
        {
            title: "Status",
            accessorKey: 'status',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => {
                const status = row.getValue("status")

                const statusVariant = {
                    "CANCELLED": "destructive",
                    "DELIVERED": "delivered",
                    "PENDING": "pending",
                    "SHIPPED": "success"
                }[status as OrderStatus] as "destructive" | "success" | "pending" | "delivered"

                return <Select defaultValue={status.toLowerCase()}>
                    <SelectTrigger>
                        <Badge className='capitalize' variant={statusVariant}>
                            {status.toLowerCase()}
                        </Badge>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem
                            className='capitalize'
                            value={'cancelled'}>cancelled</SelectItem>
                        <SelectItem
                            className='capitalize'
                            value={'delivered'}>delivered</SelectItem>
                        <SelectItem
                            className='capitalize'
                            value={'pending'}>pending</SelectItem>
                        <SelectItem
                            className='capitalize'
                            value={'shipped'}>shipped</SelectItem>
                    </SelectContent>
                </Select>
            },
        },
        {
            title: "Items",
            accessorKey: 'items',
            header: () => <span className="mr-2">Items</span>,
            cell: ({ row }: { row: any }) =>
                <div>
                    {row.getValue('items').map(({ product: prd }: any, i: number) => <span key={i}>{prd.name}</span>)}</div>
            ,
        },
        {
            title: "Quantity",
            accessorKey: 'quantity',
            header: HeaderCell,
            cell: ({ row }: { row: any }) =>
                <div>{row.getValue('items').reduce((p1: any, p2: any) => (Number(p1.quantity) + Number(p2.quantity)), 0)}</div>,
        },
        {
            title: "Created At",
            accessorKey: 'createdAt',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => row.getValue('createdAt').toLocaleDateString(),
        },
    ];


    const NextPage = () => {
        console.log(page)
        console.log(initialMaxPagesCount)
        if ((page < initialMaxPagesCount)) {
            setPage(page + 1)
        }

    }
    const PrevPage = () => {
        console.log(page)
        if ((page > 1)) {
            setPage(page - 1)
        }
    }

    const callAllUsers = useCallback(async (pageNum: number, take: number = 5, searchQuery: string = "", orderByObj: OrderBy | null) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error, success } = await getAllOrders(
                pageNum,
                take,
                searchQuery,
                orderByObj
            );
            if (success && data) {
                setUsersOrders(data);
            } else if (error) {
                setError(`Error fetching usersOrders: ${error}`);
                console.error("Error fetching usersOrders:", error);
            }
        } catch (err) {
            setError('Unexpected error occurred');
            console.error('Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const callPagesNumber = useCallback(async (take: number = 5, searchQuery: string = "") => {
        try {
            const { data, error, success } = await getAllOrdersPages(take, searchQuery);
            if (success && data) {
                setMaxPagesCount(data);
            } else if (error) {
                console.error("Error fetching page count:", error);
            }
        } catch (err) {
            console.error('Unexpected error fetching page count:', err);
        }
    }, []);

    useEffect(() => {
        callAllUsers(page, pageTakeNum, search, orderBy);
    }, [page, pageTakeNum, callAllUsers, tableConfig.defaultPageSize, orderBy]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            callAllUsers(page, pageTakeNum, search, orderBy);
            callPagesNumber(pageTakeNum, search);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [search]);

    useEffect(() => {
        if (pageTakeNum === tableConfig.defaultPageSize) {
            return;
        }
        callPagesNumber(pageTakeNum, search);
    }, [pageTakeNum, callPagesNumber, tableConfig.defaultPageSize]);

    function toggleToSelected(e: any, id: string): void {
        e.stopPropagation()
        setSelectedList(() => {
            const filtered = selectedList.filter(oldId => oldId !== id);
            if (filtered.length === selectedList.length) {
                return [...selectedList, id]
            }
            return filtered
        })
    }

    return (
        <div className="space-y-4">
            {(loading && !(usersOrders.length)) ? (
                <div className="flex justify-center items-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="ml-2">Loading...</span>
                </div>
            ) : ""}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className='flex justify-between items-center'>
                <span className='text-2xl font-bold'>Users Orders</span>
            </div>
            <div className='flex gap-2'>
                <Input placeholder='Search' value={search} onChange={(e) => setSearch((e.target.value).trim())} />
                {
                    selectedList.length ?
                        <div>
                            <Button>Action: {selectedList.length}</Button>
                        </div> : <></>
                }
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table className="w-full">
                    <TableHeader className="bg-gray-50">
                        <tr>
                            {columns.map((column, index) => <th className="px-4 py-2 text-left text-sm font-medium text-gray-900" key={index} >
                                <column.header title={column.title} column={column.accessorKey} /></th>)}
                        </tr>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-200">
                        {usersOrders.map((userOrder, rowIndex) => (
                            <tr onClick={(e) => toggleToSelected(e, userOrder.id as string)} key={userOrder.id || rowIndex} className={cn("hover:bg-gray-50", { "bg-gray-100": selectedList.find((OldId) => OldId == userOrder.id) })}>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="cursor-pointer px-4 py-2 text-sm text-gray-900">
                                        {column.cell ? column.cell({ row: { getValue: (key: string) => userOrder[key as keyof GetOrderDataAdminResponse] } }) : userOrder[column.accessorKey as keyof GetOrderDataAdminResponse]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-between items-center">
                <div className='flex flex-row items-center space-x-4'>
                    <span className="text-sm text-gray-700">
                        Page {page} of {maxPagesCount}
                    </span>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="pageSize" className="text-sm font-medium">
                            Rows per page:
                        </label>
                        <select
                            id="pageSize"
                            value={pageTakeNum}
                            onChange={(e) => {
                                setPagesTakeNum(Number(e.target.value));
                                setPage(1);
                            }}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                            {tableConfig.availablePageSizes.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Button
                        onClick={PrevPage}
                        disabled={page === 1 || loading}
                        className="rounded-full px-1 py-3 border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={NextPage}
                        disabled={page === maxPagesCount || loading}
                        className="rounded-full px-1 py-3 border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
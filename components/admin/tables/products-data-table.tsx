"use client";

import { useState, useEffect, useCallback } from 'react';
import { getAllProducts, getAllProductsPages } from "@/actions/admin/products/get-all-products";
import { GetProductDataResponse } from "@/types/get-data-response"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableHeader } from '@/components/ui/table';
import { ArrowDown, ArrowLeft, CirclePlus, Eye, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EnhancedDataTableProps, OrderBy } from '@/types/general';
import { HeaderCell } from './HeaderTable';
import ProductDataOprions from '../dialogs/ProductDataOptions';

export function ProductsDataTable({
    data: initialData,
    initialMaxPagesCount,
    tableConfig
}: EnhancedDataTableProps<GetProductDataResponse>) {
    const [products, setProducts] = useState<GetProductDataResponse[]>(initialData);
    const [page, setPage] = useState<number>(1);
    const [maxPagesCount, setMaxPagesCount] = useState<number>(initialMaxPagesCount);
    const [pageTakeNum, setPagesTakeNum] = useState<number>(tableConfig.defaultPageSize);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [orderBy, setOrderBy] = useState<OrderBy | null>(null);
    const [search, setSearch] = useState<string>("");
    const [selectedList, setSelectedList] = useState<string[]>([]);

    const columns = [
        {
            title: "Name",
            accessorKey: 'name',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => row.getValue('name'),
        },
        {
            title: "Price",
            accessorKey: 'price',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => `$${row.getValue('price')}`,
        },
        {
            title: "Description",
            accessorKey: 'description',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => row.getValue('description'),
        },
        {
            title: "Added By",
            accessorKey: 'seller',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => row.getValue('seller').name,
        },
        {
            title: "Category",
            accessorKey: 'category',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => <Badge className='flex justify-between items-center' style={{ background: row.getValue('category').color }}>
                {row.getValue('category').name}
                {row.getValue('category').icon ? <img src={row.getValue('category').icon} className='w-3 h-3' /> : <></>}
            </Badge>,
        },
        {
            title: "Tags",
            accessorKey: 'tags',
            header: () => <span className="mr-2">Tags</span>,
            cell: ({ row }: { row: any }) => row.getValue('tags')[0].name,
        },
        {
            title: "Added At",
            accessorKey: 'createdAt',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => row.getValue('createdAt').toLocaleDateString(),
        },
        {
            title: "Actions",
            accessorKey: 'actions',
            header: () => <>Actions</>,
            cell: ({ row }: { row: any }) => (
                <ProductDataOprions row={row} />
            )
        }
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

    const recallAllData = useCallback(async (pageNum: number, take: number = 5, searchQuery: string = "", orderByObj: OrderBy | null) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error, success } = await getAllProducts(
                pageNum,
                take,
                searchQuery,
                orderByObj
            );
            if (success && data) {
                setProducts(data);
            } else if (error) {
                setError(`Error fetching products: ${error}`);
                console.error("Error fetching products:", error);
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
            const { data, error, success } = await getAllProductsPages(take, searchQuery);
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
        console.log("use Effect called:", 1);
        recallAllData(page, pageTakeNum, search, orderBy);
    }, [page, pageTakeNum, recallAllData, tableConfig.defaultPageSize, orderBy]);

    useEffect(() => {
        console.log("use Effect called:", 2);
        const timeoutId = setTimeout(() => {
            recallAllData(page, pageTakeNum, search, orderBy);
            callPagesNumber(pageTakeNum, search);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [search]);

    useEffect(() => {
        console.log("use Effect called:", 3);
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
            {(loading && !(products.length)) ? (
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
                                <column.header orderBy={orderBy} setOrderBy={setOrderBy} title={column.title} column={column.accessorKey} /></th>)}
                        </tr>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-200">
                        {products.map((user, rowIndex) => (
                            <tr onClick={(e) => toggleToSelected(e, user.id as string)} key={user.id || rowIndex} className={cn("hover:bg-gray-50", { "bg-gray-100": selectedList.find((OldId) => OldId == user.id) })}>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="cursor-pointer px-4 py-2 text-sm text-gray-900">
                                        {column.cell ? column.cell({ row: { getValue: (key: string) => user[key as keyof GetProductDataResponse] } }) : user[column.accessorKey as keyof GetProductDataResponse]}
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
"use client";

import { useState, useEffect, useCallback } from 'react';
import { GetCategoryDataAdminResponse, } from "@/types/get-data-response"
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableHeader } from '@/components/ui/table';
import { ArrowDown, ArrowLeft, } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { EnhancedDataTableProps, OrderBy } from '@/types/general';
import { getAllOrders, getAllOrdersPages } from '@/actions/admin/order/get-all-orders-data';
import { getAllCategories } from '@/actions/admin/categories/get-all-categories';
import { HeaderCell } from './HeaderTable';

export function CategoriesDataTable({
    data,
    initialMaxPagesCount,
    tableConfig
}: EnhancedDataTableProps<GetCategoryDataAdminResponse>) {
    const [categories, setCategories] = useState<GetCategoryDataAdminResponse[]>(data);
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
            title: "Icon",
            accessorKey: 'icon',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => <img className='w-6 h-6' src={row.getValue('icon')} alt={row.getValue('icon')} />,
        },
        {
            title: "Name",
            accessorKey: 'name',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => row.getValue('name'),
        },
        {
            title: "Slug",
            accessorKey: 'slug',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => row.getValue('slug'),
        },
        {
            title: "Color",
            accessorKey: 'color',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => <div className='flex items-baseline gap-3'>
                <div className='min-w-4 min-h-4' style={{ background: row.getValue('color') }} />
                {row.getValue('color')}
            </div>,
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

    const recallAllDate = useCallback(async (pageNum: number, take: number = 5, searchQuery: string = "", orderByObj: OrderBy | null) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error, success } = await getAllCategories(
                pageNum,
                take,
                searchQuery,
                orderByObj
            );
            if (success && data) {
                setCategories(data);
            } else if (error) {
                setError(`Error fetching categories: ${error}`);
                console.error("Error fetching categories:", error);
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
        recallAllDate(page, pageTakeNum, search, orderBy);
    }, [page, pageTakeNum, recallAllDate, tableConfig.defaultPageSize, orderBy]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            recallAllDate(page, pageTakeNum, search, orderBy);
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
            {(loading && !(categories.length)) ? (
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
                        {categories.map((userOrder, rowIndex) => (
                            <tr onClick={(e) => toggleToSelected(e, userOrder.id as string)} key={userOrder.id || rowIndex} className={cn("hover:bg-gray-50", { "bg-gray-100": selectedList.find((OldId) => OldId == userOrder.id) })}>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="cursor-pointer px-4 py-2 text-sm text-gray-900">
                                        {column.cell ? column.cell({ row: { getValue: (key: string) => userOrder[key as keyof GetCategoryDataAdminResponse] } }) : userOrder[column.accessorKey as keyof GetCategoryDataAdminResponse]}
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
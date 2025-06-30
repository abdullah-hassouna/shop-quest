"use client";

import { useState, useEffect, useCallback } from 'react';
import { getAllUsers, getAllUsersPages } from "@/actions/admin/users/get-all-users";
import { GetAllUsersResponse } from "@/types/get-all-users-response";
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableHeader } from './ui/table';
import { ArrowDown, ArrowLeft, MoreVertical } from 'lucide-react';
import { Input } from './ui/input';

interface EnhancedDataTableProps {
    data: GetAllUsersResponse[];
    initialMaxPagesCount: number;
    tableConfig: {
        defaultPageSize: number;
        availablePageSizes: number[];
    };
}

interface OrderBy {
    order: string,
    sort: 'asc' | 'desc'
}

export function DataTable({
    data: initialData,
    initialMaxPagesCount,
    tableConfig
}: EnhancedDataTableProps) {
    const [users, setUsers] = useState<GetAllUsersResponse[]>(initialData);
    const [page, setPage] = useState<number>(1);
    const [maxPagesCount, setMaxPagesCount] = useState<number>(initialMaxPagesCount);
    const [pageTakeNum, setPagesTakeNum] = useState<number>(tableConfig.defaultPageSize);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [orderBy, setOrderBy] = useState<OrderBy>({ order: "role", sort: "asc" });
    const [search, setSearch] = useState<string>("");


    const changeOrderBy = (column: string) => {
        setOrderBy({ order: column, sort: orderBy.sort === "asc" ? "desc" : "asc" })
    }

    const HeaderCell = ({ title, column }: { title: string, column: string }) => <Button onClick={() => changeOrderBy(column)} className='space-x-2' variant={"ghost"}>
        <span className="mr-2">{title}</span>
        {orderBy.order === column && <ArrowDown className={cn("h-4 w-4", { "rotate-180": orderBy.order === column && orderBy.sort === "desc" })} />}
    </Button>


    const columns = [
        {
            title: "Name",
            accessorKey: 'name',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => row.getValue('name'),
        },
        {
            title: "Email",
            accessorKey: 'email',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => row.getValue('email'),
        },
        {
            title: "Role",
            accessorKey: 'role',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => <Badge className={cn("capitalize", { "bg-blue-500": (row.getValue('role') === "ADMIN") })}>{row.getValue('role').toLowerCase()}</Badge>,
        },
        {
            title: "Created at",
            accessorKey: 'createdAt',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => new Date(row.getValue('createdAt')).toLocaleDateString(),
        },
        {
            title: "Updated at",
            accessorKey: 'updatedAt',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => new Date(row.getValue('updatedAt')).toLocaleDateString(),
        },
        {
            title: "Actions",
            accessorKey: 'actions',
            header: () => <>Actions</>,
            cell: ({ row }: { row: any }) => (
                <Button variant={"outline"} onClick={() => alert(row.getValue("id"))} >
                    <MoreVertical />
                </Button>
            ),
        },
    ];


    const NextPage = () => {
        console.log(page)
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

    const callAllUsers = useCallback(async (pageNum: number, take: number = 5, searchQuery: string = "", orderByObj: OrderBy) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error, success } = await getAllUsers(
                pageNum,
                take,
                searchQuery,
                orderByObj
            );
            if (success && data) {
                setUsers(data);
            } else if (error) {
                setError(`Error fetching users: ${error}`);
                console.error("Error fetching users:", error);
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
            const { data, error, success } = await getAllUsersPages(take, searchQuery);
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
        callAllUsers(page, pageTakeNum, search, orderBy);
    }, [page, pageTakeNum, callAllUsers, tableConfig.defaultPageSize, orderBy]);

    useEffect(() => {
        console.log("use Effect called:", 2);
        const timeoutId = setTimeout(() => {
            callAllUsers(page, pageTakeNum, search, orderBy);
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

    return (
        <div className="space-y-4">
            {loading && (
                <div className="flex justify-center items-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="ml-2">Loading...</span>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div>
                <Input placeholder='Search' value={search} onChange={(e) => setSearch((e.target.value).trim())} />
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
                        {users.map((user, rowIndex) => (
                            <tr key={user.id || rowIndex} className="hover:bg-gray-50">
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="px-4 py-2 text-sm text-gray-900">
                                        {column.cell ? column.cell({ row: { getValue: (key: string) => user[key as keyof GetAllUsersResponse] } }) : user[column.accessorKey as keyof GetAllUsersResponse]}
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
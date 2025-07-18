"use client";

import { useState, useEffect, useCallback } from 'react';
import { getAllUsers, getAllUsersPages } from "@/actions/admin/users/get-all-users";
import type { GetOneUserDataAdminResponse } from "@/types/get-data-response"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { EnhancedDataTableProps, OrderBy } from '@/types/general';
import { HeaderCell } from './HeaderTable';
import UserDataOprions from '../dialogs/UserDataOptions';

export function UsersDataTable({
    data,
    initialMaxPagesCount,
    tableConfig
}: EnhancedDataTableProps<GetOneUserDataAdminResponse>) {
    const [users, setUsers] = useState<GetOneUserDataAdminResponse[]>(data);
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
            title: "Email",
            accessorKey: 'email',
            header: HeaderCell,
            cell: ({ row }: { row: any }) => <HoverCard>
                <HoverCardTrigger><div className='flex items-center gap-2'>
                    {row.getValue('emailVerified') && <ShieldCheck className='w-4 h-4' />}
                    <span>
                        {row.getValue('email')}
                    </span>
                </div></HoverCardTrigger>
                <HoverCardContent className='py-1 px-3 w-fit'>
                    <span className='text-xs'>User Email is {row.getValue('emailVerified') ? <span className='text-green-500 font-bold'>Verfied</span> : <span className='font-bold text-red-500'>NOT Verified</span>}</span>
                </HoverCardContent>

            </HoverCard>,
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
            cell: ({ row }: { row: any }) => (<UserDataOprions row={row} />),
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

    const recallAllData = useCallback(async (pageNum: number, take: number = 5, searchQuery: string = "", orderByObj: OrderBy | null) => {
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
            {(loading && !(users.length)) ? (
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
                        <TableRow>
                            {columns.map((column, index) => <th className="px-4 py-2 text-left text-sm font-medium text-gray-900" key={index} >
                                <column.header orderBy={orderBy} setOrderBy={setOrderBy} title={column.title} column={column.accessorKey} /></th>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-200">
                        {users.map((user, rowIndex) => (
                            <TableRow onClick={(e) => toggleToSelected(e, user.id as string)} key={user.id || rowIndex} className={cn("hover:bg-gray-50", { "bg-gray-100": selectedList.find((OldId) => OldId == user.id) })}>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="cursor-pointer px-4 py-2 text-sm text-gray-900">
                                        {column.cell ? column.cell({ row: { getValue: (key: string) => user[key as keyof GetOneUserDataAdminResponse] } }) : user[column.accessorKey as keyof GetOneUserDataAdminResponse]}
                                    </td>
                                ))}
                            </TableRow>
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
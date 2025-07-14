"use server"

import { GetOneUserDataAdminResponse } from "@/types/get-data-response";
import { getAllUsers, getAllUsersPages } from "@/actions/admin/users/get-all-users";
import { UsersDataTable } from "@/components/admin/tables/users-data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowUpRight, Eye, Users } from "lucide-react";


export default async function UsersTab() {
    const defaultPageSize = 5;
    const initialPage = 1;

    let initialUsers: GetOneUserDataAdminResponse[] = [];
    let initialMaxUsersPagesCount = 1;
    let error: string[] = [];

    const tableConfig = {
        defaultPageSize,
        availablePageSizes: [5, 10, 25, 50]
    };

    try {
        const usersResult = await getAllUsers(initialPage, defaultPageSize);
        const userPagesResult = await getAllUsersPages(defaultPageSize);

        if (usersResult.success && usersResult.data) {
            initialUsers = usersResult.data as GetOneUserDataAdminResponse[];
        } else {
            error = [usersResult.error || "Failed to fetch users", ...error];
        }

        if (userPagesResult.success && userPagesResult.data) {
            initialMaxUsersPagesCount = userPagesResult.data;
        }

    } catch (err) {
        console.error('Error fetching initial data:', err);
        error = ["Unexpected error occurred"];
    }


    return (
        <div className="p-6 space-y-4">

            {(error.length) ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error.map(err => err)}
                </div>
            ) : <></>}

            <div className='flex justify-between items-center'>
                <span className='text-2xl font-bold'>Users</span>
            </div>

            <div className="grid grid-cols-3 max-md:grid-cols-1 space-x-4">
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

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last 24 hour Visits</CardTitle>
                        <Eye className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">+2400</div>
                                <p className="text-xs text-muted-foreground">last 24 hour</p>
                            </div>

                        </div>
                    </CardContent>
                </Card>
            </div>

            <UsersDataTable
                key={"users-data-table"}
                data={initialUsers}
                initialMaxPagesCount={initialMaxUsersPagesCount}
                tableConfig={tableConfig}
            />
        </div>
    )
}

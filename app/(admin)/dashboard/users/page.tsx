"use server"

import { GetUserDataResponse } from "@/types/get-data-response";
import { getAllUsers, getAllUsersPages } from "@/actions/admin/users/get-all-users";
import { UsersDataTable } from "@/components/admin/UsersDataTable";


export default async function UsersTable() {
    const defaultPageSize = 5;
    const initialPage = 1;

    let initialUsers: GetUserDataResponse[] = [];
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
            initialUsers = usersResult.data;
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

            <UsersDataTable
                data={initialUsers}
                initialMaxPagesCount={initialMaxUsersPagesCount}
                tableConfig={tableConfig}
            />
        </div>
    )
}

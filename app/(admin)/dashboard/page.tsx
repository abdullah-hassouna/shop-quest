import { DataTable } from "@/components/DataTable";
import { GetUserDataResponse } from "@/types/get-user-data-response";
import { getAllUsers, getAllUsersPages } from "@/actions/admin/users/get-all-users";

export const dynamic = 'force-static';
export const revalidate = 300;


export default async function AdminDashboard() {
    const defaultPageSize = 5;
    const initialPage = 1;

    let initialUsers: GetUserDataResponse[] = [];
    let initialMaxPagesCount = 1;
    let error: string | null = null;

    try {
        const usersResult = await getAllUsers(initialPage, defaultPageSize);
        const pagesResult = await getAllUsersPages(defaultPageSize);

        if (usersResult.success && usersResult.data) {
            initialUsers = usersResult.data;
        } else {
            error = usersResult.error || "Failed to fetch users";
        }

        if (pagesResult.success && pagesResult.data) {
            initialMaxPagesCount = pagesResult.data;
        }
    } catch (err) {
        console.error('Error fetching initial data:', err);
        error = "Unexpected error occurred";
    }



    const tableConfig = {
        defaultPageSize,
        availablePageSizes: [5, 10, 25, 50]
    };

    return (
        <div className="p-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <DataTable
                data={initialUsers}
                initialMaxPagesCount={initialMaxPagesCount}
                tableConfig={tableConfig}
            />
        </div>
    );
}
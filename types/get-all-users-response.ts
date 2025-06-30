
export interface GetAllUsersResponse {
    id: string | null,
    name: string,
    email: string | null,
    role: string,
    createdAt: Date,
    updatedAt: Date
}

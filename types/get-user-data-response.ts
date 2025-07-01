
export interface GetUserDataResponse {
    id: string | null,
    image: string | null,
    name: string,
    email: string | null,
    emailVerified: Date | null,
    role: string,
    createdAt: Date,
    updatedAt: Date,
    sessions: { expires: Date }[]
}

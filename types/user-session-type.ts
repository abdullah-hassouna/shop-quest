import { UserDataInterface } from "./user-data-type";

export interface UserSessionInterface {
    id: string;
    sessionToken: string;
    userId: string;
    expire: Date;
    user: UserDataInterface
}
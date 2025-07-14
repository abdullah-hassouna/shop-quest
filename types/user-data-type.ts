import type { Room, Role } from "@prisma/client";


export interface UserDataInterface {
    name: string | null;
    id: string;
    email: string | null;
    image: string | Blob | null;
    role: Role;
    rooms: Room[];
}

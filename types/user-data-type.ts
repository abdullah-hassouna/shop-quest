import type { Room, Role } from "@prisma/client";


export interface UserDataInterface {
    name: string | null;
    id: string;
    email: string | null;
    image: string | null;
    role: Role;
    rooms: Room[];
}

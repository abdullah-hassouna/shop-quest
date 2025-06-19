import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Role } from "@prisma/client";

export interface UserData {
    id: string;
    img: "",
    name: string;
    email: string;
    role: Role
}

export interface UserState {
    user: UserData;
    changeName: (newName: string) => void;
    changeEmail: (newEmail: string) => void;
    removeUser: () => void;
    addUser: (newUser: UserData) => void;
}

const useUserDataStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: {
                name: "", email: "", role: "BUYER", id: "",
                img: ""
            }, // Default role set to USER

            changeName: (newName: string) => {
                const user = get().user;
                if (user.email && user.name) {
                    set({
                        user: {
                            id: user.id, name: newName, email: user.email, role: user.role,
                            img: ""
                        }
                    });
                }
            },

            changeEmail: (newEmail: string) => {
                const user = get().user;
                if (user.email && user.name) {
                    set({ user: { ...user, email: newEmail } });
                }
            },

            removeUser: () => {
                set({
                    user: {
                        name: "", email: "", role: "BUYER",
                        id: "",
                        img: ""
                    }
                });
            },

            addUser: (newUser: UserData) => {
                set({
                    user: {
                        id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role,
                        img: ""
                    }
                });
            },
        }),
        {
            name: "user-data-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useUserDataStore;

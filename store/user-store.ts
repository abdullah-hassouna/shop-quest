import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserDataInterface } from "@/types/user-data-type";

export interface UserState {
    user: UserDataInterface;
    addUser: (newUser: UserDataInterface) => void;
    removeUser: () => void;
    changeImg: (newImgUrl: string) => void;
    changeName: (newName: string) => void;
    changeEmail: (newEmail: string) => void;
}

const useUserDataStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: {
                name: "", email: "", role: "BUYER", id: "", image: "", rooms: []
            },
            changeImg: (newImgUrl: string) => {
                const user = get().user;
                if (newImgUrl) {
                    set({ user: { ...user, image: newImgUrl } });
                }
            },
            changeName: (newName: string) => {
                const user = get().user;
                if (user.email && user.name) {
                    set({
                        user: {
                            id: user.id, name: newName, email: user.email, role: user.role, image: "", rooms: []
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
                localStorage.removeItem("user-data-storage");
                set({
                    user: {
                        name: "", email: "", role: "BUYER", id: "", image: "", rooms: []
                    }
                });
            },

            addUser: (newUser: UserDataInterface) => {
                set({
                    user: {
                        id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role,
                        image: newUser.image, rooms: newUser.rooms || []
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

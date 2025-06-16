// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// export interface UserData {
//     fullname: string;
//     email: string;
// }

// interface UserState {
//     user: UserData;
//     changeName: (newName: String) => void;
//     changeEmail: (newEmail: String) => void;
//     removeUser: () => void;
//     addUser: (newUser: UserData) => void;
// }

// const useUserDataStore = create<UserState>()(
//     persist(
//         (set: any, get: () => { user: UserData }) => ({
//             user: { fullname: "", email: "" },
//             changeName: (newName: String) => {
//                 const existingItem = get().user.email.length !== 0 && get().user.fullname.length !== 0;
//                 if (existingItem) {
//                     set((state: UserState) => ({ ...(state.user), fullname: newName, }));
//                 } else {
//                     set((state: UserState) => (state.user));
//                 }
//             },
//             changeEmail: (newEmail: String) => {
//                 const existingItem = get().user.email.length !== 0 && get().user.fullname.length !== 0;
//                 if (existingItem) {
//                     set((state: UserState) => ({ ...(state.user), email: newEmail, }));
//                 } else {
//                     set((state: UserState) => (state.user));
//                 }
//             },
//             removeUser: () =>
//                 set(() => ({
//                     user: { fullname: "", email: "" },
//                 })),
//             addUser: (newUser: UserData) => set({ user: newUser }),
//         }),
//         { name: "user-data-storage" }
//     )
// );

// export default useUserDataStore;

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartState {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    updateQuantity: (id: string, quantity: number) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
}

const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],

            addToCart: (newItem: CartItem) => {
                const existingItem = get().cart.find((item) => item.id === newItem.id);
                if (existingItem) {
                    set({
                        cart: get().cart.map((item) =>
                            item.id === newItem.id
                                ? { ...item, quantity: item.quantity + newItem.quantity }
                                : item
                        ),
                    });
                } else {
                    set({
                        cart: [...get().cart, newItem],
                    });
                }
            },

            updateQuantity: (id: string, quantity: number) => {
                set({
                    cart: get().cart.map((item) =>
                        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
                    ),
                });
            },

            removeItem: (id: string) => {
                set({
                    cart: get().cart.filter((item) => item.id !== id),
                });
            },

            clearCart: () => set({ cart: [] }),
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useCartStore;

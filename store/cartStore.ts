import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    increaseQuantity: (productId: number) => void;
    decreaseQuantity: (productId: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            addItem: (product) => {
                const currentItems = get().items;
                const index = currentItems.findIndex((item) => item.product.id === product.id);

                if (index > -1) {
                    const updatedItems = [...currentItems];
                    updatedItems[index].quantity += 1;
                    set({ items: updatedItems });
                } else {
                    set({ items: [...currentItems, { product, quantity: 1 }] });
                }
            },
            removeItem: (productId) => {
                set({ items: get().items.filter((item) => item.product.id !== productId) });
            },
            increaseQuantity: (productId) => {
                const items = get().items.map((item) =>
                    item.product.id === productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                set({ items });
            },
            decreaseQuantity: (productId) => {
                const items = get().items
                    .map((item) =>
                        item.product.id === productId
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    )
                    .filter((item) => item.quantity > 0);
                set({ items });
            },
            clearCart: () => set({ items: [] }),
        }),
        {
            name: "ecommerce-cart",
        }
    )
);

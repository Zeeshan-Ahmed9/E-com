"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  regularPrice: number;
  imageUrl: string;
  category?: string;
}

interface WishlistStore {
  items: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
  totalItems: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (item) => {
        const { items } = get();
        const exists = items.some((i) => i.id === item.id);
        if (exists) {
          set({ items: items.filter((i) => i.id !== item.id) });
        } else {
          set({ items: [...items, item] });
        }
      },

      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id);
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      totalItems: () => {
        return get().items.length;
      },
    }),
    {
      name: "zappmart_wishlist",
    }
  )
);


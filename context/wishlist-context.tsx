"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { ShopifyImage } from "@/lib/shopify/types";

export type WishlistItem = {
  id: string;
  handle: string;
  title: string;
  featuredImage: ShopifyImage | null;
  price: string;
  currencyCode: string;
};

type WishlistContextType = {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | null>(null);
const STORAGE_KEY = "wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as WishlistItem[]) : [];
    } catch {
      return [];
    }
  });

  function persist(next: WishlistItem[]) {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function addItem(item: WishlistItem) {
    if (!items.some((i) => i.id === item.id)) persist([...items, item]);
  }

  function removeItem(id: string) {
    persist(items.filter((i) => i.id !== id));
  }

  function isInWishlist(id: string) {
    return items.some((i) => i.id === id);
  }

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextType {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

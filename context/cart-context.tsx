"use client";

import {
  createContext,
  useContext,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import type { Cart } from "@/lib/shopify/types";
import {
  addToCartAction,
  updateCartLineAction,
  removeFromCartAction,
} from "@/app/actions/cart";

type CartContextType = {
  cart: Cart | null;
  isOpen: boolean;
  isPending: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({
  children,
  initialCart,
}: {
  children: ReactNode;
  initialCart: Cart | null;
}) {
  const [cart, setCart] = useState<Cart | null>(initialCart);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = async (variantId: string, quantity = 1) => {
    startTransition(async () => {
      const updated = await addToCartAction(variantId, quantity);
      setCart(updated);
      setIsOpen(true);
    });
  };

  const updateItem = async (lineId: string, quantity: number) => {
    startTransition(async () => {
      const updated = await updateCartLineAction(lineId, quantity);
      setCart(updated);
    });
  };

  const removeItem = async (lineId: string) => {
    startTransition(async () => {
      const updated = await removeFromCartAction(lineId);
      setCart(updated);
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isPending,
        openCart,
        closeCart,
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

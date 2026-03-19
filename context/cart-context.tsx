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
  clearCartAction,
} from "@/app/actions/cart";

type CartContextType = {
  cart: Cart | null;
  isOpen: boolean;
  isPending: boolean;
  cartError: string | null;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => Promise<void>;
  clearCartError: () => void;
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
  const [cartError, setCartError] = useState<string | null>(null);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const clearCartError = () => setCartError(null);

  const clearCart = async () => {
    await clearCartAction();
    setCart(null);
    setIsOpen(false);
  };

  const addItem = async (variantId: string, quantity = 1) => {
    startTransition(async () => {
      try {
        const updated = await addToCartAction(variantId, quantity);
        setCart(updated);
        setCartError(null);
        setIsOpen(true);
      } catch (err) {
        setCartError(err instanceof Error ? err.message : "Failed to add item to cart");
        console.error("addItem error:", err);
      }
    });
  };

  const updateItem = async (lineId: string, quantity: number) => {
    startTransition(async () => {
      try {
        const updated = await updateCartLineAction(lineId, quantity);
        setCart(updated);
        setCartError(null);
      } catch (err) {
        setCartError(err instanceof Error ? err.message : "Failed to update cart");
        console.error("updateItem error:", err);
      }
    });
  };

  const removeItem = async (lineId: string) => {
    startTransition(async () => {
      try {
        const updated = await removeFromCartAction(lineId);
        setCart(updated);
        setCartError(null);
      } catch (err) {
        setCartError(err instanceof Error ? err.message : "Failed to remove item from cart");
        console.error("removeItem error:", err);
      }
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isPending,
        cartError,
        openCart,
        closeCart,
        clearCart,
        clearCartError,
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

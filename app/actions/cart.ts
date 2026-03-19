"use server";

import { cookies } from "next/headers";
import * as shopifyCart from "@/lib/shopify/cart";
import type { Cart } from "@/lib/shopify/types";

const CART_COOKIE = "cartId";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: "/",
};

async function getCartId(): Promise<string> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (cartId) {
    const exists = await shopifyCart.getCart(cartId);
    if (exists) return cartId;
  }

  const newCart = await shopifyCart.createCart();
  cookieStore.set(CART_COOKIE, newCart.id, COOKIE_OPTIONS);
  return newCart.id;
}

export async function addToCartAction(
  variantId: string,
  quantity = 1
): Promise<Cart> {
  const cartId = await getCartId();
  return shopifyCart.addToCart(cartId, [{ merchandiseId: variantId, quantity }]);
}

export async function updateCartLineAction(
  lineId: string,
  quantity: number
): Promise<Cart> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;
  if (!cartId) throw new Error("No cart found");
  return shopifyCart.updateCartLine(cartId, [{ id: lineId, quantity }]);
}

export async function removeFromCartAction(lineId: string): Promise<Cart> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;
  if (!cartId) throw new Error("No cart found");
  return shopifyCart.removeFromCart(cartId, [lineId]);
}

export async function clearCartAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE);
}

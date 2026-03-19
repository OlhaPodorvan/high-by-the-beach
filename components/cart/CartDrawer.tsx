"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import CartLineItem from "./CartLineItem";

export default function CartDrawer() {
  const { cart, isOpen, closeCart } = useCart();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-xl transition-transform duration-300 dark:bg-zinc-950 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold">Cart</h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded-md p-1 text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!cart || cart.lines.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">Your cart is empty.</p>
          ) : (
            <ul className="space-y-6">
              {cart.lines.map((line) => (
                <CartLineItem key={line.id} line={line} />
              ))}
            </ul>
          )}
        </div>

        {cart && cart.lines.length > 0 && (
          <div className="space-y-3 border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Subtotal</span>
              <span className="font-medium">
                {parseFloat(cart.cost.subtotalAmount.amount).toFixed(2)}{" "}
                {cart.cost.subtotalAmount.currencyCode}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full rounded-full bg-zinc-900 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

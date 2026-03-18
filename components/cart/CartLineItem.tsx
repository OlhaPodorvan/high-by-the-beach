"use client";

import Image from "next/image";
import { useCart } from "@/context/cart-context";
import type { CartLine } from "@/lib/shopify/types";

export default function CartLineItem({ line }: { line: CartLine }) {
  const { updateItem, removeItem, isPending } = useCart();
  const { merchandise, quantity, cost } = line;
  const isDefaultVariant = merchandise.title === "Default Title";

  return (
    <li className="flex gap-4">
      {merchandise.product.featuredImage && (
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <Image
            src={merchandise.product.featuredImage.url}
            alt={
              merchandise.product.featuredImage.altText ??
              merchandise.product.title
            }
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-1">
        <p className="text-sm font-medium">{merchandise.product.title}</p>
        {!isDefaultVariant && (
          <p className="text-xs text-zinc-500">{merchandise.title}</p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                quantity > 1
                  ? updateItem(line.id, quantity - 1)
                  : removeItem(line.id)
              }
              disabled={isPending}
              className="flex h-6 w-6 items-center justify-center rounded border border-zinc-200 text-sm transition-colors hover:border-zinc-400 disabled:opacity-40 dark:border-zinc-700"
            >
              −
            </button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <button
              onClick={() => updateItem(line.id, quantity + 1)}
              disabled={isPending}
              className="flex h-6 w-6 items-center justify-center rounded border border-zinc-200 text-sm transition-colors hover:border-zinc-400 disabled:opacity-40 dark:border-zinc-700"
            >
              +
            </button>
          </div>
          <span className="text-sm font-medium">
            {parseFloat(cost.totalAmount.amount).toFixed(2)}{" "}
            {cost.totalAmount.currencyCode}
          </span>
        </div>
      </div>

      <button
        onClick={() => removeItem(line.id)}
        disabled={isPending}
        aria-label="Remove item"
        className="text-zinc-400 transition-colors hover:text-zinc-700 disabled:opacity-40 dark:hover:text-zinc-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </li>
  );
}

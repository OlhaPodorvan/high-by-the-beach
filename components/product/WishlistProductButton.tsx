"use client";

import { useWishlist, type WishlistItem } from "@/context/wishlist-context";

export default function WishlistProductButton({ product }: { product: WishlistItem }) {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const saved = isInWishlist(product.id);

  return (
    <button
      onClick={() => (saved ? removeItem(product.id) : addItem(product))}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex w-full items-center justify-center gap-2 rounded-full border py-3 text-sm font-medium transition-colors ${
        saved
          ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950"
          : "border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`h-4 w-4 transition-colors ${
          saved ? "fill-red-500 stroke-red-500" : "fill-none"
        }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
      {saved ? "Saved to Wishlist" : "Add to Wishlist"}
    </button>
  );
}

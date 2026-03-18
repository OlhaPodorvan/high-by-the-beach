"use client";

import { useWishlist, type WishlistItem } from "@/context/wishlist-context";

export default function WishlistButton({ product }: { product: WishlistItem }) {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const saved = isInWishlist(product.id);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    saved ? removeItem(product.id) : addItem(product);
  }

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow-sm transition-transform hover:scale-110 dark:bg-zinc-900/90"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`h-4 w-4 transition-colors ${
          saved ? "fill-red-500 stroke-red-500" : "fill-none stroke-zinc-700 dark:stroke-zinc-300"
        }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}

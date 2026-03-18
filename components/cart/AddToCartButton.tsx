"use client";

import { useCart } from "@/context/cart-context";

type Props = {
  variantId: string;
  availableForSale: boolean;
};

export default function AddToCartButton({ variantId, availableForSale }: Props) {
  const { addItem, isPending } = useCart();

  if (!availableForSale) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-full border border-zinc-200 py-3 text-sm text-zinc-400 dark:border-zinc-700"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <button
      onClick={() => addItem(variantId)}
      disabled={isPending}
      className="w-full rounded-full bg-zinc-900 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      {isPending ? "Adding…" : "Add to Cart"}
    </button>
  );
}

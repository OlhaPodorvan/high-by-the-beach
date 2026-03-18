"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/wishlist-context";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-semibold">Wishlist</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-start gap-4">
          <p className="text-zinc-500">Your wishlist is empty.</p>
          <Link
            href="/collections/all"
            className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="group">
              <Link
                href={`/products/${item.handle}`}
                className="block overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
              >
                <div className="relative">
                  {item.featuredImage ? (
                    <Image
                      src={item.featuredImage.url}
                      alt={item.featuredImage.altText ?? item.title}
                      width={item.featuredImage.width || 400}
                      height={item.featuredImage.height || 400}
                      className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="aspect-square bg-zinc-100 dark:bg-zinc-800" />
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    aria-label="Remove from wishlist"
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow-sm transition-colors hover:bg-red-50 dark:bg-zinc-900/90"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4 fill-red-500 stroke-red-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-1 text-sm font-medium">{item.title}</h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    {item.price} {item.currencyCode}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

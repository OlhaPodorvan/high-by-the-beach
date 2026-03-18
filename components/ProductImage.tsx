"use client";

import Image from "next/image";
import { useState } from "react";
import type { ShopifyImage } from "@/lib/shopify/types";

export default function ProductImage({
  image,
  title,
}: {
  image: ShopifyImage | null;
  title: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!image || failed) {
    return (
      <div className="flex aspect-square w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 80 80"
          className="h-20 w-20 opacity-30"
          fill="none"
        >
          {/* Sun */}
          <circle cx="58" cy="22" r="10" fill="currentColor" />
          {/* Sea */}
          <path
            d="M0 52 Q10 44 20 52 Q30 60 40 52 Q50 44 60 52 Q70 60 80 52 L80 80 L0 80 Z"
            fill="currentColor"
          />
          {/* Sand */}
          <rect x="0" y="64" width="80" height="16" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={image.url}
      alt={image.altText ?? title}
      width={image.width ?? 800}
      height={image.height ?? 800}
      className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}

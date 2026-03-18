"use client";

import Image from "next/image";
import { useState } from "react";
import type { ShopifyImage } from "@/lib/shopify/types";

function Fallback({ small = false }: { small?: boolean }) {
  return (
    <div className={`flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 80 80"
        className={small ? "h-8 w-8 opacity-30" : "h-20 w-20 opacity-30"}
        fill="none"
      >
        <circle cx="58" cy="22" r="10" fill="currentColor" />
        <path
          d="M0 52 Q10 44 20 52 Q30 60 40 52 Q50 44 60 52 Q70 60 80 52 L80 80 L0 80 Z"
          fill="currentColor"
        />
        <rect x="0" y="64" width="80" height="16" fill="currentColor" opacity="0.4" />
      </svg>
    </div>
  );
}

function GalleryImage({ img, small = false, priority = false }: { img: ShopifyImage; small?: boolean; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <Fallback small={small} />;
  return (
    <Image
      src={img.url}
      alt={img.altText ?? ""}
      width={small ? 80 : img.width || 800}
      height={small ? 80 : img.height || 800}
      className="h-full w-full object-cover"
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}

export default function Gallery({ images }: { images: ShopifyImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) return (
    <div className="aspect-square overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <Fallback />
    </div>
  );

  const active = images[activeIndex];

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <GalleryImage img={active} priority />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img.url}
              onClick={() => setActiveIndex(i)}
              className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                i === activeIndex
                  ? "border-zinc-900 dark:border-white"
                  : "border-transparent hover:border-zinc-300 dark:hover:border-zinc-600"
              }`}
            >
              <GalleryImage img={img} small />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

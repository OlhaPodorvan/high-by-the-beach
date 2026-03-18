"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { ProductOption, ProductVariant } from "@/lib/shopify/types";

type Props = {
  options: ProductOption[];
  variants: ProductVariant[];
};

export default function VariantSelector({ options, variants }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Skip rendering for single-variant products
  const filtered = options.filter(
    (o) => !(o.name === "Title" && o.values[0] === "Default Title")
  );
  if (!filtered.length) return null;

  const selectedOptions = filtered.reduce<Record<string, string>>(
    (acc, option) => {
      acc[option.name] = searchParams.get(option.name) ?? option.values[0];
      return acc;
    },
    {}
  );

  function updateOption(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-4">
      {filtered.map((option) => (
        <div key={option.id}>
          <p className="mb-2 text-sm font-medium">{option.name}</p>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              const matchingVariant = variants.find((v) =>
                v.selectedOptions.every((so) =>
                  so.name === option.name
                    ? so.value === value
                    : so.value === selectedOptions[so.name]
                )
              );
              const isAvailable = matchingVariant?.availableForSale ?? true;

              return (
                <button
                  key={value}
                  onClick={() => updateOption(option.name, value)}
                  disabled={!isAvailable}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    isSelected
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                      : isAvailable
                        ? "border-zinc-200 hover:border-zinc-900 dark:border-zinc-700 dark:hover:border-white"
                        : "cursor-not-allowed border-zinc-100 text-zinc-300 dark:border-zinc-800 dark:text-zinc-600"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

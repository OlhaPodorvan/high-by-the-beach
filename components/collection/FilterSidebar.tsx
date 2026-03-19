"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { ProductFilter } from "@/lib/shopify/types";

export default function FilterSidebar({ filters }: { filters: ProductFilter[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedFilters = searchParams.getAll("f");

  function toggleFilter(input: string) {
    const params = new URLSearchParams(searchParams.toString());
    const existing = params.getAll("f");

    if (existing.includes(input)) {
      params.delete("f");
      existing.filter((f) => f !== input).forEach((f) => params.append("f", f));
    } else {
      params.append("f", input);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("f");
    router.push(`${pathname}?${params.toString()}`);
  }

  const visibleFilters = filters.filter((f) => f.type !== "PRICE_RANGE");
  if (!visibleFilters.length) return null;

  return (
    <aside className="w-full md:w-52 md:flex-shrink-0">
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="mb-4 flex w-full items-center justify-between rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900 md:hidden"
      >
        <span>Filters {selectedFilters.length > 0 && `(${selectedFilters.length})`}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`h-4 w-4 transition-transform ${mobileOpen ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Filter content — always visible on desktop, toggled on mobile */}
      <div className={`${mobileOpen ? "block" : "hidden"} md:block`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Filters</h2>
          {selectedFilters.length > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-6">
          {visibleFilters.map((filter) => (
            <div key={filter.id}>
              <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {filter.label}
              </p>
              <ul className="space-y-1">
                {filter.values.map((value) => {
                  const isSelected = selectedFilters.includes(value.input);
                  return (
                    <li key={value.id}>
                      <button
                        onClick={() => toggleFilter(value.input)}
                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                          isSelected
                            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                            : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <span>{value.label}</span>
                        <span className="ml-auto text-xs opacity-50">{value.count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

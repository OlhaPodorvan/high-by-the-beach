"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Chip = { label: string; paramKey: string; paramValue: string };

export default function ActiveFiltersBar({ aiApplied = false }: { aiApplied?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const chips: Chip[] = [];

  const type = searchParams.get("type");
  if (type) chips.push({ label: `Category: ${type}`, paramKey: "type", paramValue: type });

  const minPrice = searchParams.get("minPrice");
  if (minPrice) chips.push({ label: `Min: $${minPrice}`, paramKey: "minPrice", paramValue: minPrice });

  const maxPrice = searchParams.get("maxPrice");
  if (maxPrice) chips.push({ label: `Max: $${maxPrice}`, paramKey: "maxPrice", paramValue: maxPrice });

  // Collection filters (f param)
  const fParams = searchParams.getAll("f");
  fParams.forEach((f) => {
    try {
      const parsed = JSON.parse(f);
      const label = Object.entries(parsed)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      chips.push({ label, paramKey: "f", paramValue: f });
    } catch {}
  });

  if (!chips.length) return null;

  function removeChip(chip: Chip) {
    const params = new URLSearchParams(searchParams.toString());
    if (chip.paramKey === "f") {
      const existing = params.getAll("f").filter((v) => v !== chip.paramValue);
      params.delete("f");
      existing.forEach((v) => params.append("f", v));
    } else {
      params.delete(chip.paramKey);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    ["type", "minPrice", "maxPrice", "f"].forEach((k) => params.delete(k));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {aiApplied && (
        <span className="flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300">
          <span aria-hidden="true">✦</span> AI filters
        </span>
      )}

      {chips.map((chip) => (
        <button
          key={`${chip.paramKey}-${chip.paramValue}`}
          onClick={() => removeChip(chip)}
          className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500"
        >
          {chip.label}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-3 w-3 text-zinc-400"
          >
            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
          </svg>
        </button>
      ))}

      <button
        onClick={clearAll}
        className="text-xs text-zinc-400 underline-offset-2 hover:text-zinc-700 hover:underline dark:hover:text-zinc-200"
      >
        Clear all
      </button>
    </div>
  );
}

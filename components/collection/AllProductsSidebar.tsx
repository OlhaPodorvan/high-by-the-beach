"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

const GROUPS: { label: string; types: string[] }[] = [
  {
    label: "Swimwear",
    types: ["Bikini", "One-Piece Swimsuit", "Board Shorts", "Swim Trunks", "Rash Guard", "Cover-Up", "Sarong", "Beach Dress"],
  },
  {
    label: "Footwear",
    types: ["Sandals", "Flip Flops"],
  },
  {
    label: "Accessories",
    types: ["Sunglasses", "Hat", "Tote Bag", "Beach Bag", "Beach Accessory"],
  },
  {
    label: "Sun Care",
    types: ["Sunscreen", "After-Sun Care", "Self-Tanner"],
  },
  {
    label: "Beach Furniture",
    types: ["Beach Chair", "Beach Lounger", "Beach Umbrella", "Beach Shelter", "Beach Towel"],
  },
  {
    label: "Water Sports",
    types: ["Surfboard", "Paddleboard", "Bodyboard", "Wakeboard", "Kayak Paddle", "Surf Accessory", "Surf Gear"],
  },
  {
    label: "Snorkel & Dive",
    types: ["Snorkel Set", "Snorkel Mask", "Snorkel Gear", "Dive Fins", "Dive Mask", "Dive Equipment", "Scuba Equipment", "Dive Safety"],
  },
  {
    label: "Water Toys",
    types: ["Pool Float", "Swim Ring", "Water Toy", "Pool Toy", "Beach Toy", "Water Toys"],
  },
  {
    label: "Beach Games",
    types: ["Beach Game", "Beach Games"],
  },
  {
    label: "Jewelry",
    types: ["Necklace", "Bracelet", "Earrings", "Ring", "Anklet", "Jewelry"],
  },
  {
    label: "Electronics",
    types: ["Bluetooth Speaker", "Action Camera", "Solar Charger", "Phone Accessory", "Earbuds", "Camera Accessory", "Electronics"],
  },
  {
    label: "Drinkware & Food",
    types: ["Water Bottle", "Drinkware", "Cooler Bag", "Cooler", "Beverage", "Picnic Set", "Blender"],
  },
];

function groupTypes(allTypes: string[]): { label: string; types: string[] }[] {
  const assigned = new Set<string>();
  const result: { label: string; types: string[] }[] = [];

  for (const group of GROUPS) {
    const matched = group.types.filter((t) => allTypes.includes(t));
    if (matched.length > 0) {
      result.push({ label: group.label, types: matched });
      matched.forEach((t) => assigned.add(t));
    }
  }

  const ungrouped = allTypes.filter((t) => !assigned.has(t));
  if (ungrouped.length > 0) {
    result.push({ label: "Other", types: ungrouped });
  }

  return result;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function AllProductsSidebar({
  productTypes,
}: {
  productTypes: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") ?? "";
  const currentMin = searchParams.get("minPrice") ?? "";
  const currentMax = searchParams.get("maxPrice") ?? "";

  const [minPrice, setMinPrice] = useState(currentMin);
  const [maxPrice, setMaxPrice] = useState(currentMax);

  const groups = groupTypes(productTypes);

  // Auto-expand the group that contains the active type
  const activeGroup = groups.find((g) => g.types.includes(currentType))?.label;
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(activeGroup ? [activeGroup] : [])
  );

  const hasFilters = currentType || currentMin || currentMax;

  function toggleGroup(label: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function applyPrice() {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("type");
    params.delete("minPrice");
    params.delete("maxPrice");
    setMinPrice("");
    setMaxPrice("");
    router.push(`${pathname}?${params.toString()}`);
  }

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <aside className="w-full md:w-52 md:flex-shrink-0">
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="mb-4 flex w-full items-center justify-between rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900 md:hidden"
      >
        <span>Filters {hasFilters ? "(active)" : ""}</span>
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

      <div className={`${mobileOpen ? "block" : "hidden"} md:block`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-1">
        {groups.map((group) => {
          const isOpen = openGroups.has(group.label);
          const groupActive = group.types.includes(currentType);
          return (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm font-medium transition-colors ${
                  groupActive
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                <span>{group.label}</span>
                <ChevronIcon open={isOpen} />
              </button>

              {isOpen && (
                <ul className="mb-1 ml-2 space-y-0.5 border-l border-zinc-200 pl-2 dark:border-zinc-700">
                  {group.types.map((type) => (
                    <li key={type}>
                      <button
                        onClick={() =>
                          setParam("type", currentType === type ? "" : type)
                        }
                        className={`flex w-full items-center rounded-md px-2 py-1 text-left text-sm transition-colors ${
                          currentType === type
                            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                            : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                      >
                        {type}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Price
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-20 rounded-lg border border-zinc-200 px-2 py-1 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900"
          />
          <span className="text-zinc-400">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-20 rounded-lg border border-zinc-200 px-2 py-1 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <button
          onClick={applyPrice}
          className="mt-2 w-full rounded-lg border border-zinc-200 py-1.5 text-xs transition-colors hover:border-zinc-900 dark:border-zinc-700 dark:hover:border-white"
        >
          Apply
        </button>
      </div>
      </div>
    </aside>
  );
}

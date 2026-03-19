import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getCollection } from "@/lib/shopify/collections";
import { parseCollectionSort } from "@/lib/shopify/sort";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/collection/FilterSidebar";
import SortSelect from "@/components/collection/SortSelect";
import SearchInput from "@/components/search/SearchInput";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const result = await getCollection(handle);
  if (!result) return {};
  return {
    title: result.collection.title,
    description: result.collection.description,
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const sp = await searchParams;

  const rawFilters = Array.isArray(sp.f) ? sp.f : sp.f ? [sp.f] : [];
  const filters = rawFilters
    .map((f) => { try { return JSON.parse(f); } catch { return null; } })
    .filter(Boolean) as Record<string, unknown>[];

  const { sortKey, reverse } = parseCollectionSort(
    typeof sp.sort === "string" ? sp.sort : undefined
  );

  const result = await getCollection(handle, { filters, sortKey, reverse });
  if (!result) notFound();

  const { collection, products, filters: availableFilters } = result;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8">
        <Suspense fallback={null}>
          <SearchInput defaultValue="" />
        </Suspense>
      </div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{collection.title}</h1>
        <Suspense fallback={null}>
          <SortSelect />
        </Suspense>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <Suspense fallback={null}>
          <FilterSidebar filters={availableFilters} />
        </Suspense>

        <div className="flex-1">
          {products.length === 0 ? (
            <p className="text-zinc-500">No products match the selected filters.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

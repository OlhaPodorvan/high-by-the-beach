import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { searchProducts } from "@/lib/shopify/search";
import { getProductTypes } from "@/lib/shopify/filters";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/collection/SortSelect";
import AllProductsSidebar from "@/components/collection/AllProductsSidebar";
import ActiveFiltersBar from "@/components/collection/ActiveFiltersBar";
import SearchModeToggle from "@/components/search/SearchModeToggle";
import { aiSearchAction } from "@/app/actions/search";

type Props = {
  searchParams: Promise<Record<string, string | string[]>>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  return { title: q ? `Search: "${q}"` : "Search" };
}

function str(val: string | string[] | undefined) {
  return typeof val === "string" ? val : undefined;
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const rawQuery = str(sp.q)?.trim() ?? "";
  const mode = str(sp.mode) ?? "simple";
  const aiApplied = !!sp.ai;

  const productTypes = await getProductTypes();

  // AI mode: run extraction then redirect with structured filters
  if (mode === "ai" && rawQuery && !aiApplied) {
    const result = await aiSearchAction(rawQuery, productTypes);
    const params = new URLSearchParams({ q: result.cleanQuery, mode: "ai", ai: "1" });
    if (result.productType) params.set("type", result.productType);
    if (result.minPrice)    params.set("minPrice", String(result.minPrice));
    if (result.maxPrice)    params.set("maxPrice", String(result.maxPrice));
    result.tags?.forEach((t) => params.append("tag", t));
    redirect(`/search?${params.toString()}`);
  }

  // Build Shopify filters from URL params (set by AI or by user via sidebar)
  const type = str(sp.type);
  const minPrice = str(sp.minPrice);
  const maxPrice = str(sp.maxPrice);

  const filters = {
    productType: type,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
  };

  const { products, totalCount } = rawQuery
    ? await searchProducts(rawQuery, 48, filters)
    : { products: [], totalCount: 0 };

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">
            {rawQuery ? `"${rawQuery}"` : "Search"}
          </h1>
          {rawQuery && (
            <p className="mt-1 text-sm text-zinc-500">
              {totalCount} {totalCount === 1 ? "product" : "products"} found
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Suspense fallback={null}>
            <SearchModeToggle />
          </Suspense>
          {rawQuery && (
            <Suspense fallback={null}>
              <SortSelect />
            </Suspense>
          )}
        </div>
      </div>

      {!rawQuery && (
        <p className="text-zinc-500">Enter a search term above to find products.</p>
      )}

      {rawQuery && (
        <div className="flex gap-8">
          <Suspense fallback={null}>
            <AllProductsSidebar productTypes={productTypes} />
          </Suspense>

          <div className="flex-1">
            <Suspense fallback={null}>
              <ActiveFiltersBar aiApplied={aiApplied} />
            </Suspense>

            {products.length === 0 ? (
              <p className="text-zinc-500">
                No products found for &ldquo;{rawQuery}&rdquo;.
              </p>
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
      )}
    </main>
  );
}

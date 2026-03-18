import { Suspense } from "react";
import { getProducts } from "@/lib/shopify/products";
import { getProductTypes } from "@/lib/shopify/filters";
import { parseProductsSort } from "@/lib/shopify/sort";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/collection/SortSelect";
import AllProductsSidebar from "@/components/collection/AllProductsSidebar";
import ActiveFiltersBar from "@/components/collection/ActiveFiltersBar";

export const metadata = { title: "All Products" };

type Props = {
  searchParams: Promise<Record<string, string | string[]>>;
};

function buildQuery(type?: string, min?: string, max?: string) {
  const parts: string[] = [];
  if (type) parts.push(`product_type:"${type}"`);
  if (min) parts.push(`variants.price:>=${min}`);
  if (max) parts.push(`variants.price:<=${max}`);
  return parts.length ? parts.join(" AND ") : undefined;
}

function str(val: string | string[] | undefined) {
  return typeof val === "string" ? val : undefined;
}

export default async function AllProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const sort = str(sp.sort);
  const type = str(sp.type);
  const minPrice = str(sp.minPrice);
  const maxPrice = str(sp.maxPrice);

  const { sortKey, reverse } = parseProductsSort(sort);
  const query = buildQuery(type, minPrice, maxPrice);

  const [products, productTypes] = await Promise.all([
    getProducts(48, { sortKey, reverse, query }),
    getProductTypes(),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">All Products</h1>
        <Suspense fallback={null}>
          <SortSelect />
        </Suspense>
      </div>

      <div className="flex gap-8">
        <Suspense fallback={null}>
          <AllProductsSidebar productTypes={productTypes} />
        </Suspense>

        <div className="flex-1">
          <Suspense fallback={null}>
            <ActiveFiltersBar aiApplied={!!sp.ai} />
          </Suspense>
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

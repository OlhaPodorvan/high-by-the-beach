import { getProducts } from "@/lib/shopify/products";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  const products = await getProducts(8);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-semibold">All Products</h1>

      {products.length === 0 ? (
        <p className="text-zinc-500">No products found.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

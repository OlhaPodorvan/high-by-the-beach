import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import WishlistButton from "./WishlistButton";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const price = parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2);
  const currencyCode = product.priceRange.minVariantPrice.currencyCode;

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="relative">
          <ProductImage image={product.featuredImage} title={product.title} />
          <WishlistButton
            product={{
              id: product.id,
              handle: product.handle,
              title: product.title,
              featuredImage: product.featuredImage,
              price,
              currencyCode,
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="line-clamp-1 text-sm font-medium">{product.title}</h3>
          <p className="mt-1 text-sm text-zinc-500">
            {price} {currencyCode}
          </p>
        </div>
      </div>
    </Link>
  );
}

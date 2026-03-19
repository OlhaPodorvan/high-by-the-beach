import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getProduct } from "@/lib/shopify/products";
import Gallery from "@/components/product/Gallery";
import VariantSelector from "@/components/product/VariantSelector";
import AddToCartButton from "@/components/cart/AddToCartButton";
import WishlistProductButton from "@/components/product/WishlistProductButton";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return {};
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: product.featuredImage ? [{ url: product.featuredImage.url }] : [],
    },
  };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const sp = await searchParams;

  const product = await getProduct(handle);
  if (!product) notFound();

  // Resolve selected variant from URL search params
  const selectedOptions = product.options.reduce<Record<string, string>>(
    (acc, option) => {
      const val = sp[option.name];
      acc[option.name] =
        (Array.isArray(val) ? val[0] : val) ?? option.values[0];
      return acc;
    },
    {}
  );

  const selectedVariant =
    product.variants.find((v) =>
      v.selectedOptions.every((so) => selectedOptions[so.name] === so.value)
    ) ?? product.variants[0];

  const images =
    product.images.length > 0
      ? product.images
      : product.featuredImage
        ? [product.featuredImage]
        : [];

  const price = parseFloat(
    selectedVariant?.price.amount ?? product.priceRange.minVariantPrice.amount
  ).toFixed(2);
  const currency =
    selectedVariant?.price.currencyCode ??
    product.priceRange.minVariantPrice.currencyCode;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <Gallery images={images} />

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-semibold">{product.title}</h1>
            <p className="mt-2 text-xl font-medium">
              {price} {currency}
            </p>
          </div>

          <Suspense fallback={null}>
            <VariantSelector
              options={product.options}
              variants={product.variants}
            />
          </Suspense>

          <AddToCartButton
            variantId={selectedVariant?.id ?? ""}
            availableForSale={selectedVariant?.availableForSale ?? false}
          />

          <WishlistProductButton
            product={{
              id: product.id,
              handle: product.handle,
              title: product.title,
              featuredImage: product.featuredImage,
              price,
              currencyCode: currency,
            }}
          />

          {product.descriptionHtml && (
            <div
              className="prose prose-sm max-w-none text-zinc-600 dark:text-zinc-400"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}
        </div>
      </div>
    </main>
  );
}

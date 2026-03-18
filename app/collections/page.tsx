import Image from "next/image";
import Link from "next/link";
import { getCollections } from "@/lib/shopify/collections";

export const metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-semibold">Collections</h1>

      {collections.length === 0 ? (
        <p className="text-zinc-500">No collections found.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <li key={collection.id}>
              <Link
                href={`/collections/${collection.handle}`}
                className="group block overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
              >
                {collection.image ? (
                  <Image
                    src={collection.image.url}
                    alt={collection.image.altText ?? collection.title}
                    width={collection.image.width ?? 600}
                    height={collection.image.height ?? 400}
                    className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="aspect-video bg-zinc-100 dark:bg-zinc-800" />
                )}
                <div className="p-4">
                  <h2 className="font-medium">{collection.title}</h2>
                  {collection.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                      {collection.description}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

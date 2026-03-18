import Link from "next/link";
import { Suspense } from "react";
import { getMenu } from "@/lib/shopify/menu";
import CartButton from "./CartButton";
import SearchForm from "./SearchForm";
import WishlistNavButton from "./WishlistNavButton";

export default async function Header() {
  const menu = await getMenu("main-menu");

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          High By The Beach
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {menu.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className="text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Suspense fallback={null}>
            <SearchForm />
          </Suspense>
          <WishlistNavButton />
          <CartButton />
        </div>
      </div>
    </header>
  );
}

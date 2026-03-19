import Link from "next/link";
import { getMenu } from "@/lib/shopify/menu";
import CartButton from "./CartButton";
import WishlistNavButton from "./WishlistNavButton";
import MobileMenu from "./MobileMenu";

export default async function Header() {
  const menu = await getMenu("main-menu");

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        {/* Mobile: hamburger */}
        <MobileMenu menu={menu} />

        <Link href="/" className="text-lg font-semibold tracking-tight">
          High By The Beach
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center gap-6 text-sm md:flex">
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
          <Link href="/search" aria-label="Search" className="p-2 text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </Link>
          <WishlistNavButton />
          <CartButton />
        </div>
      </div>
    </header>
  );
}

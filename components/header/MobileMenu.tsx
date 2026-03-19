"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { MenuItem } from "@/lib/shopify/types";

export default function MobileMenu({ menu }: { menu: MenuItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Portal requires the DOM to be available
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  function close() {
    setIsOpen(false);
  }

  const drawer = (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-xl transition-transform duration-300 dark:bg-zinc-950 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <Link href="/" onClick={close} className="text-lg font-semibold tracking-tight">
            High By The Beach
          </Link>
          <button
            onClick={close}
            aria-label="Close menu"
            className="rounded-md p-1 text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Search */}
          <Link
            href="/search"
            onClick={close}
            className="mb-6 flex w-full items-center gap-2 rounded-full border border-zinc-200 px-4 py-2.5 text-sm text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:hover:border-zinc-500 dark:hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            Search products…
          </Link>

          {/* Nav links */}
          {menu.length > 0 && (
            <nav className="space-y-1">
              {menu.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  onClick={close}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Hamburger button — stays inside the header */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="p-2 md:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Drawer portalled to document.body to escape the header's backdrop-filter stacking context */}
      {mounted && createPortal(drawer, document.body)}
    </>
  );
}

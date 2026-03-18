"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative hidden md:block">
      <input
        ref={inputRef}
        type="search"
        name="q"
        defaultValue={searchParams.get("q") ?? ""}
        placeholder="Search products…"
        className="w-48 rounded-full border border-zinc-200 bg-zinc-50 py-1.5 pl-8 pr-8 text-sm outline-none transition-all focus:w-64 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
      />
      {/* search icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      {/* AI sparkle — indicates smart search will be wired here */}
      <span
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-300 dark:text-zinc-600"
        title="AI-powered search coming soon"
        aria-hidden="true"
      >
        ✦
      </span>
    </form>
  );
}

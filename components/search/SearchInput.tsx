"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useEffect, useState } from "react";

export default function SearchInput({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const aiInputRef = useRef<HTMLInputElement>(null);
  const [aiMode, setAiMode] = useState((searchParams.get("mode") ?? "simple") === "ai");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (aiMode) aiInputRef.current?.focus();
  }, [aiMode]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}&mode=simple`);
  }

  function handleAISubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = aiInputRef.current?.value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}&mode=ai`);
  }

  function handleClear() {
    if (inputRef.current) inputRef.current.value = "";
    router.push("/collections/all");
  }

  if (aiMode) {
    return (
      <form onSubmit={handleAISubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            ref={aiInputRef}
            type="search"
            name="q"
            defaultValue={defaultValue}
            placeholder="Describe what you're looking for…"
            className="w-full rounded-full border-2 border-violet-400 bg-violet-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-violet-500 dark:border-violet-500 dark:bg-violet-950/30 dark:focus:border-violet-400"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-violet-400">✦</span>
        </div>
        <button
          type="button"
          onClick={() => setAiMode(false)}
          className="shrink-0 rounded-full border border-zinc-200 px-5 py-3 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Simple search
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setAiMode(true)}
        className="flex shrink-0 items-center gap-1.5 rounded-full bg-violet-100 px-4 py-3 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:hover:bg-violet-900/60"
      >
        <span aria-hidden="true" className="text-xs">✦</span>
        With AI
      </button>

      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Search products…"
          className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>

      {defaultValue && (
        <button
          type="button"
          onClick={handleClear}
          className="shrink-0 rounded-full border border-zinc-200 px-5 py-3 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          All products
        </button>
      )}
    </form>
  );
}

"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function SearchModeToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") ?? "simple";

  function setMode(next: "simple" | "ai") {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", next);
    // clear previous AI-applied state when switching modes
    params.delete("ai");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-zinc-200 p-0.5 text-sm dark:border-zinc-700">
      <button
        onClick={() => setMode("simple")}
        className={`rounded-full px-3 py-1 transition-colors ${
          mode !== "ai"
            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        }`}
      >
        Simple
      </button>
      <button
        onClick={() => setMode("ai")}
        className={`flex items-center gap-1 rounded-full px-3 py-1 transition-colors ${
          mode === "ai"
            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        }`}
      >
        <span aria-hidden="true" className="text-xs">✦</span>
        AI
      </button>
    </div>
  );
}

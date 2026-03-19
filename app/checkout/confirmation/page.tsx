import Link from "next/link";

export const metadata = { title: "Order confirmed" };

export default function ConfirmationPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-8 w-8 text-green-600 dark:text-green-400"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
      </div>
      <h1 className="text-2xl font-semibold">Order confirmed!</h1>
      <p className="mt-3 text-zinc-500">
        Thanks for your purchase. In a real store you&apos;d receive a confirmation email shortly.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Continue shopping
      </Link>
    </main>
  );
}

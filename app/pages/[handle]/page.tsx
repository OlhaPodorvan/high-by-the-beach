import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPage } from "@/lib/shopify/page";

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const page = await getPage(handle);
  if (!page) return {};
  return {
    title: page.title,
    description: page.bodySummary,
  };
}

export default async function Page({ params }: Props) {
  const { handle } = await params;
  const page = await getPage(handle);
  if (!page) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-semibold">{page.title}</h1>
      <div
        className="prose prose-zinc dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
    </main>
  );
}

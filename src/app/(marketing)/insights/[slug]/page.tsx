import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { storage } from "@/lib/queries";
import { RichText } from "@/components/ui/rich-text-render";

export const revalidate = 3600;

// Pre-render every published article at build time → static pages.
export async function generateStaticParams() {
  const posts = await storage.getPublishedInsights();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await storage.getPublishedInsightBySlug(slug);
  if (!post) return { title: "Insight not found" };
  return {
    title: `${post.seoTitle || post.title} — Vajira Weerasekera`,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      type: "article",
      ...(post.featuredImageUrl ? { images: [{ url: post.featuredImageUrl }] } : {}),
    },
  };
}

export default async function InsightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await storage.getPublishedInsightBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-36">
      <Link href="/insights" className="mb-8 inline-flex items-center gap-2 text-sm text-brand-ink/60 transition-colors hover:text-brand-ink">
        <ArrowLeft className="size-4" /> All insights
      </Link>

      <header className="flex flex-col gap-4">
        {post.category && (
          <span className="w-fit rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-navy">
            {post.category}
          </span>
        )}
        <h1 className="font-heading text-4xl font-semibold leading-[1.1] tracking-[-0.5px] text-brand-ink sm:text-5xl">{post.title}</h1>
        <p className="text-lg leading-7 text-brand-ink/60">{post.excerpt}</p>
        <div className="flex items-center gap-3 text-sm text-brand-ink/50">
          <span className="font-medium text-brand-ink/70">{post.author}</span>
          {post.publishedAt && <><span>·</span><span>{new Date(post.publishedAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</span></>}
          {post.readTime && <><span>·</span><span>{post.readTime}</span></>}
        </div>
      </header>

      {post.featuredImageUrl && (
        <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-3xl bg-brand-navy/5 shadow-card">
          <Image src={post.featuredImageUrl} alt={post.featuredImageAlt ?? post.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" priority />
        </div>
      )}

      <RichText
        content={post.body}
        className="prose prose-lg mt-12 max-w-none prose-headings:font-heading prose-headings:tracking-[-0.25px] prose-headings:text-brand-ink prose-p:text-brand-ink/80 prose-a:text-brand-blue prose-strong:text-brand-ink prose-img:rounded-2xl"
      />
    </article>
  );
}

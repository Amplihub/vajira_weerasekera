import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { storage } from "@/lib/queries";
import type { Insight } from "@/db/schema";

// Statically generated at build time (ISR-revalidated hourly so newly published
// posts appear without a redeploy). No client query — pure server render.
export const revalidate = 3600;

export const metadata = {
  title: "Insights — Vajira Weerasekera",
  description: "Field notes on clarity, energy, trust and results — leadership under pressure, from three decades of high-stakes calls.",
};

const fmtDate = (d: Date | string) =>
  new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });

export default async function InsightsListPage() {
  let posts: Insight[] = [];
  try {
    posts = await storage.getPublishedInsights();
  } catch (error) {
    // If the database is unreachable (e.g., Vercel build without env vars), fallback to empty.
  }
  
  const [lead, ...rest] = posts;

  return (
    <section className="mx-auto max-w-[1100px] px-6 pb-28 pt-32 sm:px-8 sm:pt-40">
      {/* Title block — no hero */}
      <header className="flex flex-col gap-4 border-b border-brand-ink/10 pb-10">
        <span className="text-sm font-medium uppercase tracking-[0.12em] text-brand-blue">Insights</span>
        <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-[1.05] tracking-[-1px] text-brand-ink sm:text-5xl">
          Field notes on leading under pressure.
        </h1>
        <p className="max-w-xl text-base leading-7 text-brand-ink/60">
          Clarity, energy, trust and results — practical perspectives from three decades of high-stakes leadership.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="py-24 text-center text-brand-ink/50">No articles published yet — check back soon.</p>
      ) : (
        <>
          {/* Lead article */}
          <LeadCard post={lead} />

          {/* The rest — clean editorial rows */}
          {rest.length > 0 && (
            <ul className="mt-4 divide-y divide-brand-ink/10 border-t border-brand-ink/10">
              {rest.map((p) => (
                <ArticleRow key={p.id} post={p} />
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}

function LeadCard({ post }: { post: Insight }) {
  return (
    <Link href={`/insights/${post.slug}`} className="group mt-12 grid gap-8 sm:grid-cols-2 sm:items-center">
      <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-brand-navy/5">
        {post.featuredImageUrl ? (
          <Image
            src={post.featuredImageUrl}
            alt={post.featuredImageAlt ?? post.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="absolute inset-0 gradient-brand opacity-90" />
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-brand-ink/45">
          {post.category && <span className="text-brand-blue">{post.category}</span>}
          {post.publishedAt && <><span>·</span><span>{fmtDate(post.publishedAt)}</span></>}
          {post.readTime && <><span>·</span><span>{post.readTime}</span></>}
        </div>
        <h2 className="font-heading text-2xl font-semibold leading-tight tracking-[-0.5px] text-brand-ink sm:text-3xl">
          {post.title}
        </h2>
        <p className="line-clamp-3 text-sm leading-7 text-brand-ink/60 sm:text-base">{post.excerpt}</p>
        <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-brand-blue">
          Read article
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function ArticleRow({ post }: { post: Insight }) {
  return (
    <li>
      <Link href={`/insights/${post.slug}`} className="group flex items-center gap-6 py-7 sm:gap-10">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-brand-ink/45">
            {post.category && <span className="text-brand-blue">{post.category}</span>}
            {post.publishedAt && <><span>·</span><span>{fmtDate(post.publishedAt)}</span></>}
            {post.readTime && <><span className="hidden sm:inline">·</span><span className="hidden sm:inline">{post.readTime}</span></>}
          </div>
          <h3 className="font-heading text-lg font-semibold leading-snug tracking-[-0.25px] text-brand-ink transition-colors group-hover:text-brand-blue sm:text-xl">
            {post.title}
          </h3>
          <p className="line-clamp-2 max-w-2xl text-sm leading-6 text-brand-ink/55">{post.excerpt}</p>
        </div>
        <div className="relative hidden aspect-[4/3] w-40 shrink-0 overflow-hidden rounded-xl bg-brand-navy/5 sm:block">
          {post.featuredImageUrl ? (
            <Image
              src={post.featuredImageUrl}
              alt={post.featuredImageAlt ?? post.title}
              fill
              sizes="160px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 gradient-brand opacity-90" />
          )}
        </div>
        <ArrowUpRight className="size-5 shrink-0 text-brand-ink/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
      </Link>
    </li>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { storage } from "@/lib/queries";
import type { Insight } from "@/db/schema";

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
    // Fallback if DB is unreachable
  }
  
  const [lead, ...rest] = posts;

  return (
    <main className="relative overflow-hidden bg-slate-50 min-h-screen">
      {/* Ambient Canvas */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute top-40 right-[-10%] w-[800px] h-[800px] bg-indigo-100/30 rounded-full blur-[150px] animate-[pulse_12s_ease-in-out_infinite_reverse]" />

      <section className="relative z-10 mx-auto max-w-7xl pt-32 pb-24 md:pt-40 md:pb-32 px-6">
        
        {/* Editorial Header */}
        <header className="flex flex-col items-start">
          <span className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-slate-500 mb-6 block animate-fade-in-up [animation-delay:100ms] opacity-0">
            INSIGHTS
          </span>
          <h1 className="max-w-4xl text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-slate-900 leading-[1.05] animate-fade-in-up [animation-delay:200ms] opacity-0">
            Field notes on leading under{" "}
            <span className="font-serif italic font-normal text-blue-600">pressure.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg md:text-xl text-slate-600 leading-relaxed animate-fade-in-up [animation-delay:300ms] opacity-0">
            Practical perspectives on strategic clarity, relentless execution, and high-stakes leadership.
          </p>
        </header>

        {/* Content Area with massive negative space separation */}
        <div className="mt-20 md:mt-32">
          {posts.length === 0 ? (
            
            /* Premium Empty State / Lead Capture */
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-10 md:p-16 max-w-3xl mx-auto shadow-[0_20px_50px_-15px_rgba(37,99,235,0.1)] text-center relative overflow-hidden animate-fade-in-scale [animation-delay:400ms] opacity-0">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Curating the <span className="font-serif italic font-normal text-blue-600">archive.</span>
              </h2>
              <p className="text-slate-600 text-lg mb-8 max-w-xl mx-auto">
                The field notes are currently being compiled. Join the private list to receive exclusive essays on executive leadership the moment they are published.
              </p>
              
              <form 
                className="flex flex-col md:flex-row gap-4 max-w-md mx-auto" 
                action="https://formkeep.com/f/dummy" 
                method="POST" 
              >
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full bg-white/70 border border-slate-200 text-slate-900 px-6 py-4 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-slate-900 text-white px-8 py-4 rounded-full text-sm font-bold tracking-[0.1em] uppercase hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/30 transition-all whitespace-nowrap"
                >
                  SUBSCRIBE
                </button>
              </form>
            </div>
            
          ) : (
            
            <div className="animate-fade-in-up [animation-delay:400ms] opacity-0">
              {/* Lead article */}
              <LeadCard post={lead} />

              {/* The rest — clean editorial rows */}
              {rest.length > 0 && (
                <ul className="mt-16 divide-y divide-slate-200 border-t border-slate-200">
                  {rest.map((p) => (
                    <ArticleRow key={p.id} post={p} />
                  ))}
                </ul>
              )}
            </div>
            
          )}
        </div>
      </section>
    </main>
  );
}

function LeadCard({ post }: { post: Insight }) {
  return (
    <Link href={`/insights/${post.slug}`} className="group grid gap-10 sm:grid-cols-2 items-center">
      <div className="relative aspect-[16/11] w-full overflow-hidden rounded-3xl bg-slate-100 shadow-[0_20px_50px_-15px_rgba(37,99,235,0.1)]">
        {post.featuredImageUrl ? (
          <Image
            src={post.featuredImageUrl}
            alt={post.featuredImageAlt ?? post.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-slate-200 opacity-90" />
        )}
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {post.category && <span className="text-blue-600">{post.category}</span>}
          {post.publishedAt && <><span>·</span><span>{fmtDate(post.publishedAt)}</span></>}
          {post.readTime && <><span>·</span><span>{post.readTime}</span></>}
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
          {post.title}
        </h2>
        <p className="line-clamp-3 text-lg leading-relaxed text-slate-600">{post.excerpt}</p>
        <span className="mt-2 inline-flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-blue-600">
          Read essay
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function ArticleRow({ post }: { post: Insight }) {
  return (
    <li>
      <Link href={`/insights/${post.slug}`} className="group flex items-center gap-8 py-10 sm:gap-12">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {post.category && <span className="text-blue-600">{post.category}</span>}
            {post.publishedAt && <><span>·</span><span>{fmtDate(post.publishedAt)}</span></>}
            {post.readTime && <><span className="hidden sm:inline">·</span><span className="hidden sm:inline">{post.readTime}</span></>}
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600 sm:text-3xl">
            {post.title}
          </h3>
          <p className="line-clamp-2 max-w-3xl text-base leading-relaxed text-slate-600">{post.excerpt}</p>
        </div>
        <div className="relative hidden aspect-square w-48 shrink-0 overflow-hidden rounded-2xl bg-slate-100 shadow-lg sm:block">
          {post.featuredImageUrl ? (
            <Image
              src={post.featuredImageUrl}
              alt={post.featuredImageAlt ?? post.title}
              fill
              sizes="192px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-slate-200 opacity-90" />
          )}
        </div>
      </Link>
    </li>
  );
}

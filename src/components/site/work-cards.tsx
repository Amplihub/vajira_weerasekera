import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorkCard {
  image: string;
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}

export const workCards: WorkCard[] = [
  {
    image: "/home/ways/coaching.png",
    title: "Executive Coaching",
    body: "One-on-one coaching for senior leaders who need clearer judgement and a steadier presence under pressure.",
    secondary: { label: "See how it works", href: "/executive-coaching" },
    primary: { label: "Book a discovery call", href: "/contact" },
  },
  {
    image: "/home/ways/speaking.png",
    title: "Keynote Speaking",
    body: "Keynotes for audiences who want practical thinking on psychological safety, leadership, and performance in the AI era.",
    secondary: { label: "See speaking topics", href: "/speaking" },
    primary: { label: "Check availability", href: "/contact" },
  },
  {
    image: "/home/ways/emerging.png",
    title: "Emerging Executives Program",
    body: "A cohort program for emerging executives learning to lead bigger teams, harder decisions, and change in the AI era.",
    secondary: { label: "Read what's covered", href: "/emerging-leaders" },
    primary: { label: "Apply for the program", href: "/contact" },
  },
  {
    image: "/home/ways/programs.png",
    title: "Leadership Programs",
    body: "Programs for teams that need shared language, honest conversations, and habits that hold up under pressure.",
    secondary: { label: "See program options", href: "/programs" },
    primary: { label: "Talk to Vajira", href: "/contact" },
  },
];

function CardButton({ href, label, variant }: { href: string; label: string; variant: "primary" | "secondary" }) {
  const styles =
    variant === "primary"
      ? "bg-brand-navy text-brand-bg"
      : "bg-brand-navy/5 text-brand-navy hover:bg-brand-navy/10";
  return (
    <Link
      href={href}
      className={`flex h-12 items-center justify-center gap-1 rounded-full px-5 text-xs font-semibold uppercase tracking-[0.25px] transition-colors ${styles}`}
    >
      {label}
      <ArrowUpRight className="size-4" strokeWidth={2} />
    </Link>
  );
}

// The 4 "ways to work" cards (image + arrow + title + body + dual CTA). Used on the
// Home "Ways to Work" section and the Services page intro.
export function WorkCardsGrid({
  cards = workCards,
  frameClassName = "bg-black/20",
}: {
  cards?: WorkCard[];
  frameClassName?: string;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => (
        <div key={c.title} className={cn("flex flex-col gap-3 rounded-3xl p-3", frameClassName)}>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-brand-navy/40">
            <Image src={c.image} alt={c.title} fill sizes="(max-width:640px) 100vw, 25vw" className="object-cover" />
          </div>
          <div className="flex flex-1 flex-col gap-6 rounded-2xl bg-white p-6">
            <ArrowUpRight className="size-5 text-brand-ink" strokeWidth={2} />
            <div className="flex flex-col gap-3">
              <h3 className="font-heading text-xl font-semibold text-brand-ink">{c.title}</h3>
              <p className="text-sm leading-6 text-brand-ink/70">{c.body}</p>
            </div>
            <div className="mt-auto flex flex-col gap-2">
              <CardButton {...c.secondary} variant="secondary" />
              <CardButton {...c.primary} variant="primary" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

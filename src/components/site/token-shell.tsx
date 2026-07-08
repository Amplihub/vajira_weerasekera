import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Centered, frosted shell for the public token pages (360 survey / onboarding / nominate).
// `center` vertically centers a single short card (invite/states); the long
// survey leaves it off so it scrolls from the top.
export function TokenShell({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center bg-brand-mesh px-4 py-10 sm:py-16",
        center && "justify-center",
      )}
    >
      <Image src="/brand/logo.svg" alt="Vajira Weerasekara" width={96} height={40} className="mb-8"
        priority />
      <div className="w-full max-w-2xl">{children}</div>
    </div>
  );
}

export function TokenCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("glass-card rounded-[2rem] p-6 sm:p-10", className)}>{children}</div>;
}

const TONES: Record<string, { ring: string; bg: string; fg: string }> = {
  brand: { ring: "ring-brand-blue/15", bg: "bg-brand-blue/10", fg: "text-brand-blue" },
  success: { ring: "ring-emerald-500/15", bg: "bg-emerald-500/10", fg: "text-emerald-600" },
  warning: { ring: "ring-amber-500/15", bg: "bg-amber-500/10", fg: "text-amber-600" },
  error: { ring: "ring-rose-500/15", bg: "bg-rose-500/10", fg: "text-rose-600" },
};

/** Circular brand icon chip used at the top of token cards + state screens. */
export function TokenIcon({ icon: Icon, tone = "brand" }: { icon: LucideIcon; tone?: keyof typeof TONES }) {
  const t = TONES[tone];
  return (
    <span className={cn("inline-flex size-14 items-center justify-center rounded-2xl ring-8", t.bg, t.ring)}>
      <Icon className={cn("size-6", t.fg)} strokeWidth={1.75} />
    </span>
  );
}

/** Centered icon + title + body — terminal states (loading/expired/invalid/confirmed). */
export function TokenState({
  icon,
  tone = "brand",
  title,
  children,
}: {
  icon: LucideIcon;
  tone?: keyof typeof TONES;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <TokenCard className="flex flex-col items-center gap-4 text-center">
      <TokenIcon icon={icon} tone={tone} />
      <h1 className="font-heading text-2xl font-semibold tracking-[-0.4px] text-brand-ink">{title}</h1>
      {children && <div className="max-w-md text-sm leading-7 text-brand-ink/70">{children}</div>}
    </TokenCard>
  );
}

/** Brand header for an active token form: icon chip, eyebrow, title. */
export function TokenHeader({
  icon,
  eyebrow,
  title,
}: {
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <TokenIcon icon={icon} />
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">{eyebrow}</p>}
      <h1 className="font-heading text-3xl font-semibold tracking-[-0.5px] text-brand-ink">{title}</h1>
    </div>
  );
}

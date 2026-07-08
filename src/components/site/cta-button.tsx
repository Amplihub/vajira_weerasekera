import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CtaButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  icon?: boolean;
  external?: boolean;
  className?: string;
}

// Pill button matching the Figma "Button with Icon" component.
export function CtaButton({ href, children, variant = "primary", icon = true, external, className }: CtaButtonProps) {
  const base =
    "group relative inline-flex h-[72px] items-center justify-center gap-1 rounded-full px-8 text-sm font-semibold uppercase tracking-[0.1px] transition-all sm:px-12";
  const styles =
    variant === "primary"
      ? "bg-brand-navy text-brand-bg hover:bg-brand-navy/90"
      : "border border-brand-navy/50 text-brand-navy hover:bg-brand-navy/5";

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {icon && (
        <div className="relative size-5 ml-1 overflow-hidden">
          <ArrowUpRight 
            className="absolute inset-0 size-5 transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-5 group-hover:-translate-y-5 animate-bounce-diagonal motion-reduce:animate-none group-hover:!animate-none" 
            strokeWidth={2} 
          />
          <ArrowUpRight 
            className="absolute inset-0 size-5 -translate-x-5 translate-y-5 transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0 group-hover:translate-y-0" 
            strokeWidth={2} 
          />
        </div>
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cn(base, styles, className)}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(base, styles, className)}>
      {content}
    </Link>
  );
}

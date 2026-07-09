import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CtaButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  icon?: boolean;
  external?: boolean;
  className?: string;
}

// Refined pill button matching the modern Immersive Editorial aesthetic.
export function CtaButton({ href, children, variant = "primary", icon = true, external, className }: CtaButtonProps) {
  const base =
    "group inline-flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.1em] transition-all duration-300 w-fit";
  const styles =
    variant === "primary"
      ? "bg-slate-900 text-white rounded-full px-8 py-4 hover:bg-blue-600 hover:scale-105 hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)]"
      : "text-slate-900 hover:text-blue-600";

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {icon && variant === "outline" && (
        <ArrowRight 
          className="size-4 transition-transform duration-300 group-hover:translate-x-1" 
          strokeWidth={2.5} 
        />
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

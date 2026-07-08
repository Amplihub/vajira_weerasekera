"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav, mobileNav, BOOK_CALL_HREF } from "@/lib/site-nav";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-8">
      <nav className="pointer-events-auto relative z-50 mx-auto flex max-w-[1664px] items-center justify-between gap-3 rounded-full border border-white/50 bg-white/30 p-2 backdrop-blur-xl">
        {/* Logo pill */}
        <Link
          href="/"
          className="flex items-center rounded-full bg-brand-bg px-6 py-3 sm:px-8 sm:py-4"
          aria-label="Vajira Weerasekara — home"
        >
          <Image src="/brand/logo.svg" alt="Vajira Weerasekara" width={79} height={32} priority />
        </Link>

        {/* Desktop links pill */}
        <div className="hidden rounded-full bg-brand-bg px-8 py-4 lg:flex">
          <ul className="flex items-center gap-14 text-sm uppercase tracking-[0.1px] text-brand-ink/70">
            {mainNav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn("transition-colors hover:text-brand-navy", active && "text-brand-navy")}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* CTA pill (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-2">
          <div className="hidden rounded-full bg-brand-bg p-2 sm:block">
            <Link
              href={BOOK_CALL_HREF}
              className="flex h-12 items-center justify-center rounded-full bg-brand-navy px-8 text-sm font-semibold uppercase tracking-[0.1px] text-brand-bg transition-opacity hover:opacity-90"
            >
              Book your call
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative z-50 flex size-12 items-center justify-center rounded-full bg-brand-bg text-brand-navy lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto visible opacity-100" : "pointer-events-none invisible opacity-0",
        )}
      />

      {/* Mobile sheet */}
      <div
        className={cn(
          "fixed inset-x-4 top-24 z-40 mt-2 transition-[opacity,transform,visibility] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
          open
            ? "pointer-events-auto visible translate-y-0 scale-100 opacity-100"
            : "pointer-events-none invisible -translate-y-3 scale-[0.98] opacity-0",
        )}
      >
        <div className="space-y-1 overflow-hidden rounded-[2rem] border border-white/60 bg-white/95 p-5 shadow-[0_24px_48px_-16px_rgba(11,15,26,0.18)] ring-1 ring-[#0B0F1A]/5 backdrop-blur-2xl">
          {mobileNav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}
              className={cn(
                "flex items-center justify-between rounded-2xl px-2 py-3 text-[2.25rem] font-semibold uppercase leading-none tracking-[-1px] text-black transition-[opacity,transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#0B0F1A]/[0.04]",
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
            >
              {item.label}
              <ArrowUpRight className="size-5 text-[#0B0F1A]/40" />
            </Link>
          ))}
          <Link
            href={BOOK_CALL_HREF}
            onClick={() => setOpen(false)}
            style={{ transitionDelay: open ? `${120 + mobileNav.length * 70}ms` : "0ms" }}
            className={cn(
              "mt-4 flex h-12 w-full items-center justify-center gap-1.5 rounded-full bg-brand-navy text-sm font-semibold uppercase tracking-[0.1px] text-brand-bg transition-[opacity,transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-90",
              open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
          >
            Book your call <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

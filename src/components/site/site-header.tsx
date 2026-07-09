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
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Check initial position
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out pointer-events-auto",
          isScrolled
            ? "bg-white/80 backdrop-blur-lg shadow-[0_4px_30px_rgb(0,0,0,0.03)] border-b border-slate-200/50 py-3 md:py-4"
            : "bg-transparent py-6 md:py-8"
        )}
      >
        <div className="mx-auto flex max-w-[1664px] items-center justify-between px-6 sm:px-8 lg:px-[128px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center"
            aria-label="Vajira Weerasekara — home"
          >
            <Image src="/brand/logo.svg" alt="Vajira Weerasekara" width={79} height={32} priority className="h-6 sm:h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            <ul className="group flex items-center gap-10">
              {mainNav.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative py-2 text-sm font-semibold tracking-widest uppercase transition-all duration-300 ease-out inline-block",
                        active ? "text-slate-900" : "text-slate-600",
                        "group-hover:opacity-40 group-hover:blur-[2px]",
                        "hover:!opacity-100 hover:!blur-none hover:scale-[1.15] hover:text-slate-900"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Desktop CTA & Mobile Hamburger */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <Link
                href={BOOK_CALL_HREF}
                className="inline-flex bg-slate-900 text-white text-xs md:text-sm font-bold tracking-wide uppercase px-6 py-3 rounded-full transition-all duration-300 ease-out hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-105"
              >
                Book your call
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(
                "relative z-50 flex size-10 sm:size-12 items-center justify-center rounded-full transition-colors lg:hidden",
                isScrolled ? "bg-slate-100 text-slate-900" : "bg-white/50 text-slate-900 backdrop-blur-md"
              )}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto visible opacity-100" : "pointer-events-none invisible opacity-0",
        )}
      />

      {/* Mobile sheet */}
      <div
        className={cn(
          "fixed inset-x-4 top-24 z-50 mt-2 transition-[opacity,transform,visibility] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
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
                "flex items-center justify-between rounded-2xl px-2 py-3 text-[2.25rem] font-semibold uppercase leading-none tracking-tight text-slate-900 transition-[opacity,transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#0B0F1A]/[0.04]",
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
            >
              {item.label}
              <ArrowUpRight className="size-5 text-slate-400" />
            </Link>
          ))}
          <Link
            href={BOOK_CALL_HREF}
            onClick={() => setOpen(false)}
            style={{ transitionDelay: open ? `${120 + mobileNav.length * 70}ms` : "0ms" }}
            className={cn(
              "mt-4 flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-slate-900 text-sm font-semibold uppercase tracking-wide text-white transition-[opacity,transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-blue-600",
              open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
          >
            Book your call <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </>
  );
}

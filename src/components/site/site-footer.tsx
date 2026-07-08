import Link from "next/link";
import Image from "next/image";
import { servicesNav, companyNav, legalNav, LINKEDIN_URL } from "@/lib/site-nav";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div className="flex flex-1 flex-col gap-8 sm:gap-14">
      <h4 className="font-heading text-xl font-semibold uppercase text-brand-navy">{title}</h4>
      <ul className="flex flex-col gap-6 text-sm uppercase tracking-[0.1px] text-brand-ink/70">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="transition-colors hover:text-brand-navy">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-brand-bg">
      <div className="mx-auto flex max-w-[1536px] flex-col gap-16 px-6 py-24 sm:px-12 lg:flex-row lg:justify-between lg:px-[236px] lg:py-[200px]">
        {/* Brand */}
        <div className="flex max-w-[515px] flex-col gap-12">
          <div className="flex flex-col gap-10">
            <Image src="/brand/logo-footer.svg" alt="Vajira Weerasekara" width={149} height={60} />
            <p className="font-heading text-xl font-normal text-brand-ink/70">
              Executive Coach, Keynote Speaker &amp; Leadership Advisor. Helping senior leaders create clarity,
              energize teams, and deliver results.
            </p>
          </div>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-brand-navy transition-opacity hover:opacity-70"
          >
            <LinkedInIcon className="size-8" />
          </a>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-10 sm:flex sm:max-w-[700px] sm:flex-1 sm:gap-8">
          <FooterColumn title="Services" links={servicesNav} />
          <FooterColumn title="Company" links={companyNav} />
          <FooterColumn title="Legal" links={legalNav} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col items-center justify-center gap-2 bg-brand-navy px-12 py-8 sm:flex-row sm:gap-4">
        <p className="text-center text-sm tracking-[0.25px] text-brand-bg">
          © {new Date().getFullYear()} Vajira Weerasekara. All rights reserved.
        </p>
        <span className="hidden text-brand-bg/30 sm:inline">·</span>
        <Link href="/admin" className="text-sm tracking-[0.25px] text-brand-bg/70 transition-colors hover:text-brand-bg">
          Admin
        </Link>
      </div>
    </footer>
  );
}

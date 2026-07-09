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
    <div className="col-span-1 lg:col-span-2">
      <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 mb-6">{title}</h4>
      <ul className="flex flex-col">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="group text-slate-300 hover:text-white transition-colors duration-300 py-2 block w-max">
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
    <footer className="bg-slate-950 py-20 lg:py-32 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Left Column (Brand & Bio) */}
          <div className="col-span-1 lg:col-span-5">
            <Link href="/" className="inline-block">
              <Image 
                src="/brand/logo-footer.svg" 
                alt="Vajira Weerasekara" 
                width={149} 
                height={60} 
                className="brightness-0 invert" 
              />
            </Link>
            
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm mt-8">
              Executive Coach, Keynote Speaker &amp; Leadership Advisor. Helping senior leaders create clarity,
              energize teams, and deliver results.
            </p>
            
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="border border-white/20 rounded-full p-3 mt-8 text-white hover:bg-blue-600 hover:border-transparent transition-all duration-300 inline-block"
            >
              <LinkedInIcon className="size-5" />
            </a>
          </div>

          {/* Spacer column to push links right */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Right Columns (Links) */}
          <FooterColumn title="SERVICES" links={servicesNav} />
          <FooterColumn title="COMPANY" links={companyNav} />
          <FooterColumn title="LEGAL" links={legalNav} />
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 gap-4">
          
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-center md:text-left">
            <p>
              © {new Date().getFullYear()} Vajira Weerasekara. All rights reserved.
            </p>
          </div>

          <Link href="/admin" className="hover:text-white transition-colors duration-300">
            Admin
          </Link>
          
        </div>

      </div>
    </footer>
  );
}

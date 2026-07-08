"use client";

import Image from "next/image";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4.5" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);

  const go = () => {
    setLoading(true);
    signIn.social({ provider: "google", callbackURL: "/admin" });
  };

  return (
    <div className="grid min-h-screen bg-brand-mesh lg:grid-cols-2">
      {/* Story panel — gradient border framing a cloud-image panel (email-header logic) */}
      <div className="hidden gradient-brand p-2 lg:block">
        <div
          className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[#dfeaf8] bg-cover bg-center p-12"
          style={{ backgroundImage: "url(/about/cloud-big.png)" }}
        >
          <Image src="/brand/logo.svg" alt="Vajira Weerasekera" width={130} height={52} className="relative" priority />

          <div className="relative flex flex-col gap-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-navy/10 px-3.5 py-1.5 text-xs font-medium text-brand-navy ring-1 ring-brand-navy/15">
              Coaching backend
            </span>
            <h1 className="font-heading text-4xl font-semibold leading-[1.1] tracking-[-0.5px] text-brand-navy">
              Clarity, energy, trust &amp; results — managed in one place.
            </h1>
            <p className="max-w-md text-sm leading-7 text-brand-navy/70">
              Applications, the coaching CRM, insights and the full 360 leadership process — your private workspace.
            </p>
          </div>

          <p className="relative text-xs text-brand-navy/50">© {new Date().getFullYear()} Vajira Weerasekera</p>
        </div>
      </div>

      {/* Sign-in — cloud background on mobile (left panel is hidden there) */}
      <div className="relative flex items-center justify-center bg-[#dfeaf8] bg-[url('/about/cloud-big.png')] bg-cover bg-center p-6 sm:p-10 lg:bg-transparent lg:bg-none">
        <span className="pointer-events-none absolute inset-0 bg-white/30 lg:hidden" />
        <div className="glass-card relative w-full max-w-sm rounded-[2rem] p-8 sm:p-10">
          <Image src="/brand/logo.svg" alt="Vajira Weerasekera" width={96} height={40} className="mb-8 lg:hidden" priority />

          <span className="inline-flex size-12 items-center justify-center rounded-2xl gradient-brand text-white shadow-soft">
            <ShieldCheck className="size-6" strokeWidth={1.75} />
          </span>

          <h2 className="mt-5 font-heading text-2xl font-semibold tracking-[-0.4px] text-brand-ink">Sign in</h2>
          <p className="mt-1.5 text-sm text-brand-ink/60">Continue to the coaching backend.</p>

          <Button
            onClick={go}
            disabled={loading}
            className="mt-7 h-11 w-full gap-2.5 rounded-xl bg-white text-brand-ink ring-1 ring-brand-ink/10 hover:bg-white hover:ring-brand-ink/20"
          >
            <GoogleMark />
            {loading ? "Redirecting…" : "Continue with Google"}
          </Button>

          <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-brand-blue/[0.06] p-3.5 text-xs leading-6 text-brand-ink/60">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-blue" />
            Access is restricted to authorized accounts. Unrecognized Google accounts are declined automatically.
          </div>
        </div>
      </div>
    </div>
  );
}

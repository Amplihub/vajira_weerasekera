"use client";

import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Inbox, Users, FileText, Network, Mail, ArrowUpRight, type LucideIcon } from "lucide-react";
import { useTRPC } from "@/lib/trpc/client";

function StatCard({ icon: Icon, label, value, href }: { icon: LucideIcon; label: string; value: number | string; href: string }) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-brand-ink/[0.07] bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-pop"
    >
      <div className="flex items-center justify-between">
        <span className="flex size-11 items-center justify-center rounded-2xl gradient-brand text-white shadow-soft">
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <ArrowUpRight className="size-5 text-brand-ink/25 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-heading text-4xl font-semibold tracking-[-1px] text-brand-ink">{value}</span>
        <span className="text-sm text-brand-ink/55">{label}</span>
      </div>
    </Link>
  );
}

export function DashboardStats() {
  const trpc = useTRPC();
  const apps = useSuspenseQuery(trpc.applications.list.queryOptions({ page: 1, limit: 1, status: "new" }));
  const clients = useSuspenseQuery(trpc.coaching.listClients.queryOptions({ page: 1, limit: 1 }));
  const insights = useSuspenseQuery(trpc.insights.listAll.queryOptions({ page: 1, limit: 1 }));
  const cycles = useSuspenseQuery(trpc.cycles.list.queryOptions());
  const emails = useSuspenseQuery(trpc.emailLogs.list.queryOptions({ page: 1, limit: 1 }));

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard icon={Inbox} label="New applications" value={apps.data.total} href="/admin/applications" />
      <StatCard icon={Users} label="Coaching clients" value={clients.data.total} href="/admin/clients" />
      <StatCard icon={FileText} label="Insights" value={insights.data.total} href="/admin/insights" />
      <StatCard icon={Network} label="360 cycles" value={cycles.data.length} href="/admin/cycles" />
      <StatCard icon={Mail} label="Emails sent" value={emails.data.total} href="/admin/email-logs" />
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-5 rounded-3xl border border-brand-ink/[0.07] bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div className="size-11 animate-pulse rounded-2xl bg-brand-ink/10" />
            <div className="size-5 animate-pulse rounded bg-brand-ink/10" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-9 w-16 animate-pulse rounded-lg bg-brand-ink/10" />
            <div className="h-3.5 w-28 animate-pulse rounded-full bg-brand-ink/[0.07]" />
          </div>
        </div>
      ))}
    </div>
  );
}

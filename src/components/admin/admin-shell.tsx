"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Inbox, Users, FileText, Network, Mail, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const nav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Applications", href: "/admin/applications", icon: Inbox },
  { label: "Coaching CRM", href: "/admin/clients", icon: Users },
  { label: "Insights", href: "/admin/insights", icon: FileText },
  { label: "360 Cycles", href: "/admin/cycles", icon: Network },
  { label: "Email Log", href: "/admin/email-logs", icon: Mail },
];

type AdminUser = { email: string; name?: string | null; image?: string | null };

function initials(u: AdminUser) {
  const base = (u.name || u.email).trim();
  const parts = base.split(/[\s@.]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || base.slice(0, 2).toUpperCase();
}

export function AdminShell({
  user,
  defaultCollapsed = false,
  children,
}: {
  user: AdminUser;
  defaultCollapsed?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  // Persist in a cookie so a reload keeps the chosen state (the server layout
  // reads it to render the correct width with no flash / re-open).
  const toggle = () => {
    setCollapsed((c) => {
      const next = !c;
      document.cookie = `admin_sidebar_collapsed=${next ? "1" : "0"};path=/;max-age=31536000;samesite=lax`;
      return next;
    });
  };

  return (
    <div className="flex min-h-screen bg-brand-mesh">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-brand-ink/[0.06] bg-white/70 p-3 backdrop-blur-xl transition-[width] duration-200 lg:flex",
          collapsed ? "w-[76px]" : "w-64",
        )}
      >
        {/* Brand + collapse toggle */}
        <div className={cn("flex items-center px-1 py-2", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && (
            <Link href="/admin" className="px-1">
              <Image src="/brand/logo.svg" alt="Vajira" width={88} height={36} priority />
            </Link>
          )}
          <button
            type="button"
            onClick={toggle}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex size-9 items-center justify-center rounded-xl text-brand-ink/50 transition-colors hover:bg-brand-ink/5 hover:text-brand-ink"
          >
            {collapsed ? <PanelLeftOpen className="size-5" strokeWidth={1.75} /> : <PanelLeftClose className="size-5" strokeWidth={1.75} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-4 flex flex-1 flex-col gap-1.5">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                title={collapsed ? n.label : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl py-2.5 text-sm font-medium transition-all",
                  collapsed ? "justify-center px-0" : "px-3",
                  active ? "gradient-brand text-white shadow-soft" : "text-brand-ink/70 hover:bg-brand-blue/8 hover:text-brand-navy",
                )}
              >
                <n.icon
                  className={cn("size-5 shrink-0 transition-colors", active ? "text-white" : "text-brand-ink/50 group-hover:text-brand-blue")}
                  strokeWidth={1.75}
                />
                {!collapsed && <span className="truncate">{n.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className={cn("mt-3 rounded-2xl border border-brand-ink/[0.06] bg-white/60 shadow-soft", collapsed ? "flex flex-col items-center gap-1 p-2" : "p-2.5")}>
          <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-2.5 px-0.5")}>
            <Avatar className="size-9 shrink-0 ring-2 ring-brand-blue/15">
              {user.image && <AvatarImage src={user.image} alt={user.name ?? user.email} />}
              <AvatarFallback className="bg-brand-navy/10 text-xs font-semibold text-brand-navy">{initials(user)}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                {user.name && <p className="truncate text-sm font-medium text-brand-ink">{user.name}</p>}
                <p className="truncate text-xs text-brand-ink/50">{user.email}</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => signOut({ fetchOptions: { onSuccess: () => router.push("/admin/login") } })}
            title="Sign out"
            aria-label="Sign out"
            className={cn(
              "flex items-center rounded-xl text-sm font-medium text-brand-ink/70 transition-colors hover:bg-brand-ink/5 hover:text-brand-ink",
              collapsed ? "size-9 justify-center" : "mt-1.5 w-full gap-2.5 px-2 py-2",
            )}
          >
            <LogOut className="size-4.5 shrink-0" strokeWidth={1.75} />
            {!collapsed && "Sign out"}
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-10">{children}</main>
    </div>
  );
}

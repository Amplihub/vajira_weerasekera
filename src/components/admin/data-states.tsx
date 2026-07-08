"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, ArrowRight, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/** Brand error fallback for an ErrorBoundary wrapping a data section. */
export function AdminError({
  title = "Something went wrong",
  hint = "We couldn't load this section. Try refreshing.",
  onRetry,
  compact = false,
}: {
  title?: string;
  hint?: string;
  onRetry?: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-brand-ink/[0.07] bg-white text-center shadow-card",
        compact ? "min-h-[200px] p-6" : "min-h-[360px] p-8",
      )}
    >
      <span className={cn("flex items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 ring-8 ring-rose-500/10", compact ? "size-12" : "size-16")}>
        <AlertTriangle className={compact ? "size-6" : "size-7"} strokeWidth={1.75} />
      </span>
      <h3 className={cn("font-heading font-semibold text-brand-ink", compact ? "mt-4 text-lg" : "mt-5 text-xl")}>{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-brand-ink/55">{hint}</p>
      <Button onClick={() => (onRetry ? onRetry() : window.location.reload())} className="mt-5">
        <RefreshCcw className="size-4" /> Try again
      </Button>
    </div>
  );
}

/**
 * Wraps a data-backed block in its own ErrorBoundary + Suspense so the block's
 * loading skeleton and error state match that exact component 1:1.
 */
export function SectionBoundary({
  fallback,
  errorTitle,
  children,
}: {
  fallback: React.ReactNode;
  errorTitle: string;
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary fallback={<AdminError compact title={errorTitle} />}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

/** Rounded table container shared by every admin list. */
export function TableShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-brand-ink/[0.07] bg-white shadow-card", className)}>
      {children}
    </div>
  );
}

/** Skeleton matching the table chrome — used as the Suspense fallback. */
export function AdminTableSkeleton({ cols = 4, rows = 6 }: { cols?: number; rows?: number }) {
  return (
    <TableShell>
      <div className="border-b border-brand-ink/[0.06] bg-muted/40 px-5 py-3">
        <div className="flex items-center gap-6">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-3 flex-1 animate-pulse rounded-full bg-brand-ink/10" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-brand-ink/[0.05]">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-6 px-5 py-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className="h-4 flex-1 animate-pulse rounded-full bg-brand-ink/[0.07]"
                style={{ animationDelay: `${(r * cols + c) * 40}ms` }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-brand-ink/[0.06] px-5 py-3">
        <div className="h-3 w-24 animate-pulse rounded-full bg-brand-ink/10" />
        <div className="flex gap-2">
          <div className="h-8 w-16 animate-pulse rounded-xl bg-brand-ink/10" />
          <div className="h-8 w-16 animate-pulse rounded-xl bg-brand-ink/10" />
        </div>
      </div>
    </TableShell>
  );
}

/** Centered empty state for a populated-but-zero list. */
export function AdminEmpty({
  icon: Icon = Inbox,
  title,
  hint,
}: {
  icon?: typeof Inbox;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
        <Icon className="size-6" strokeWidth={1.75} />
      </span>
      <p className="font-medium text-brand-ink">{title}</p>
      {hint && <p className="max-w-xs text-sm text-brand-ink/55">{hint}</p>}
    </div>
  );
}

export type DetailField = { label: string; value: React.ReactNode };

/** Row-click detail dialog: quick fields + a "View full page" action. */
export function RowDetailDialog({
  open,
  onOpenChange,
  title,
  subtitle,
  fields,
  viewHref,
  viewLabel = "Open full page",
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  subtitle?: string;
  fields: DetailField[];
  viewHref?: string;
  viewLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">{title}</DialogTitle>
          {subtitle && <p className="text-sm text-brand-ink/55">{subtitle}</p>}
        </DialogHeader>
        <dl className="flex flex-col divide-y divide-brand-ink/[0.06]">
          {fields.map((f, i) => (
            <div key={i} className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:gap-4">
              <dt className="w-40 shrink-0 text-xs font-medium uppercase tracking-wide text-brand-ink/45">{f.label}</dt>
              <dd className="min-w-0 flex-1 text-sm text-brand-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
        {children}
        {viewHref && (
          <DialogFooter>
            <Button nativeButton={false} render={<Link href={viewHref} />}>
              {viewLabel} <ArrowRight className="size-4" />
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

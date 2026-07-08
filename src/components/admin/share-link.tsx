"use client";

import { useState } from "react";
import { Copy, Check, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Family-tree-style share-link row: label + truncated URL, optional status
 * badge, copy-to-clipboard. Used so Vajira can hand out 360 links manually
 * (onboarding / nomination / per-respondent survey) when email isn't wired.
 */
export function ShareLinkRow({
  label,
  url,
  meta,
  status,
  className,
}: {
  label: string;
  url: string;
  meta?: string;
  status?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    toast.success(`${label} copied`);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-brand-ink/[0.07] bg-white/60 p-3 shadow-soft",
        className,
      )}
    >
      <span className="hidden size-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue sm:inline-flex">
        <Link2 className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-sm font-medium text-brand-ink">
          {label}
          {status && (
            <Badge className="border-0 bg-brand-ink/5 text-[10px] font-medium uppercase tracking-wide text-brand-ink/55">
              {status}
            </Badge>
          )}
        </p>
        <p className="truncate text-xs text-brand-ink/55">{meta ?? url}</p>
      </div>
      <Button variant="outline" size="sm" onClick={copy} className="shrink-0">
        {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}

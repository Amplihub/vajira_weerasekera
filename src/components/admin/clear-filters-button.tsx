"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Shown only when a list page has active filters; resets them to defaults. */
export function ClearFiltersButton({ active, onClear }: { active: boolean; onClear: () => void }) {
  if (!active) return null;
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClear}
      className="h-9 gap-1.5 rounded-xl bg-white text-brand-ink/60 hover:text-brand-ink"
    >
      <X className="size-4" /> Clear
    </Button>
  );
}

"use client";

import { ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PillarModal({ title, body }: { title: string; body: string }) {
  return (
    <Dialog>
      <DialogTrigger className="mt-auto inline-flex w-fit items-center gap-2 text-sm font-semibold uppercase tracking-[0.25px] text-white transition-opacity hover:opacity-80">
        Read more <ArrowRight className="size-4" strokeWidth={2} />
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl gap-0 overflow-hidden rounded-3xl p-0 sm:max-w-2xl">
        <DialogHeader className="px-8 py-6 shadow-[0_10px_20px_-16px_rgba(0,0,0,0.25)] sm:px-10 sm:py-8">
          <DialogTitle className="font-heading text-4xl font-semibold text-brand-navy sm:text-5xl">
            {title}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="max-h-[65vh] overflow-y-auto px-8 py-8 text-lg leading-8 text-brand-ink/70 sm:px-10">
          {body}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

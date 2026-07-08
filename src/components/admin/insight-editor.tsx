"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, ChevronLeft, Loader2, FileText, ImageIcon, Search } from "lucide-react";
import { useTRPC } from "@/lib/trpc/client";
import { uploadToSignedUrl } from "@/lib/upload-client";
import { insightStatusOptions, type Insight } from "@/db/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { cn } from "@/lib/utils";

type Form = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  featuredImageUrl: string;
  featuredImageAlt: string;
  category: string;
  readTime: string;
  seoTitle: string;
  seoDescription: string;
  status: (typeof insightStatusOptions)[number];
};

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function InsightEditor({ initial }: { initial?: Insight }) {
  const trpc = useTRPC();
  const router = useRouter();
  const qc = useQueryClient();
  const [tab, setTab] = useState("content");
  const [form, setForm] = useState<Form>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    body: initial?.body ?? "",
    featuredImageUrl: initial?.featuredImageUrl ?? "",
    featuredImageAlt: initial?.featuredImageAlt ?? "",
    category: initial?.category ?? "",
    readTime: initial?.readTime ?? "",
    seoTitle: initial?.seoTitle ?? "",
    seoDescription: initial?.seoDescription ?? "",
    status: (initial?.status as Form["status"]) ?? "draft",
  });
  const [uploading, setUploading] = useState(false);
  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const createUrl = useMutation(trpc.insights.createImageUploadUrl.mutationOptions());
  const confirmUp = useMutation(trpc.insights.confirmImageUpload.mutationOptions());

  async function uploadImage(file: File): Promise<string> {
    const { path, token, publicUrl } = await createUrl.mutateAsync({ filename: file.name, contentType: file.type, size: file.size });
    await uploadToSignedUrl(path, token, file);
    await confirmUp.mutateAsync({ path, filename: file.name, contentType: file.type, publicUrl });
    return publicUrl;
  }

  async function onFile(file: File) {
    setUploading(true);
    try {
      set("featuredImageUrl", await uploadImage(file));
      toast.success("Image uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  const mediaLibrary = {
    items: [],
    isLoading: false,
    isUploading: createUrl.isPending || confirmUp.isPending,
    onUpload: async (file: File) => {
      try {
        return { url: await uploadImage(file) };
      } catch (e) {
        toast.error((e as Error).message);
        return null;
      }
    },
  };

  const payload = () => ({
    ...form,
    category: form.category || null,
    readTime: form.readTime || null,
    featuredImageUrl: form.featuredImageUrl || null,
    featuredImageAlt: form.featuredImageAlt || null,
    seoTitle: form.seoTitle || null,
    seoDescription: form.seoDescription || null,
  });

  const create = useMutation(
    trpc.insights.create.mutationOptions({
      onSuccess: (created) => {
        toast.success("Post created");
        qc.invalidateQueries({ queryKey: trpc.insights.listAll.queryKey() });
        // Land on the new post's edit page so editing continues in place.
        router.replace(`/admin/insights/${created.id}`);
      },
      onError: (e) => toast.error(e.message),
    }),
  );
  const update = useMutation(
    trpc.insights.update.mutationOptions({
      onSuccess: (saved) => {
        toast.success("Post saved");
        // Invalidate the exact byId query for this post + the list, so revisiting
        // shows the changes without a manual reload. Stay on the page.
        if (initial) qc.invalidateQueries({ queryKey: trpc.insights.byId.queryKey({ id: initial.id }) });
        qc.invalidateQueries({ queryKey: trpc.insights.listAll.queryKey() });
        void saved;
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  const save = () => {
    if (!form.title || !form.slug || !form.excerpt || !form.body) {
      toast.error("Title, slug, excerpt and body are required");
      return;
    }
    if (initial) update.mutate({ id: initial.id, data: payload() });
    else create.mutate(payload());
  };

  const pending = create.isPending || update.isPending;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="rounded-full" nativeButton={false} render={<Link href="/admin/insights" />}>
            <ChevronLeft className="size-5" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-[-0.5px] text-brand-ink sm:text-3xl">
              {initial ? form.title || "Edit post" : "New post"}
            </h1>
            <p className="mt-0.5 text-sm text-brand-ink/55">{initial ? "Editing an existing insight." : "Write and publish a new insight."}</p>
          </div>
          <Badge
            className={cn(
              "ml-1 border-0 capitalize",
              form.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700",
            )}
          >
            {form.status}
          </Badge>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <Button variant="outline" nativeButton={false} render={<Link href="/admin/insights" />}>Discard</Button>
          <SaveButton pending={pending} initial={!!initial} onClick={save} />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="rounded-full bg-muted/70 p-1.5">
          <TabsTrigger value="content" className="gap-2 rounded-full px-4"><FileText className="size-4" /> Content</TabsTrigger>
          <TabsTrigger value="media" className="gap-2 rounded-full px-4"><ImageIcon className="size-4" /> Media &amp; meta</TabsTrigger>
          <TabsTrigger value="seo" className="gap-2 rounded-full px-4"><Search className="size-4" /> SEO &amp; status</TabsTrigger>
        </TabsList>

        {/* Content */}
        <TabsContent value="content" className="mt-6 space-y-6 focus-visible:outline-none">
          <Section title="Basics">
            <Field label="Title">
              <Input
                value={form.title}
                onChange={(e) => {
                  set("title", e.target.value);
                  if (!initial && (!form.slug || form.slug === slugify(form.title))) set("slug", slugify(e.target.value));
                }}
              />
            </Field>
            <Field label="Slug"><Input value={form.slug} onChange={(e) => set("slug", e.target.value)} /></Field>
            <Field label="Excerpt"><Textarea rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} /></Field>
          </Section>
          <Section title="Body">
            <RichTextEditor value={form.body} onChange={(v) => set("body", v)} placeholder="Write the insight…" mediaLibrary={mediaLibrary} />
          </Section>
        </TabsContent>

        {/* Media & meta */}
        <TabsContent value="media" className="mt-6 space-y-6 focus-visible:outline-none">
          <Section title="Featured image">
            {form.featuredImageUrl && (
              <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-2xl bg-brand-ink/5">
                <Image src={form.featuredImageUrl} alt="" fill sizes="448px" className="object-cover" />
              </div>
            )}
            <label className="flex max-w-md cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-brand-ink/20 px-3 py-5 text-sm text-brand-ink/60 transition-colors hover:border-brand-blue/50 hover:bg-brand-blue/[0.03]">
              <Upload className="size-4" /> {uploading ? "Uploading…" : "Upload image"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
            </label>
            <Field label="Image alt"><Input value={form.featuredImageAlt} onChange={(e) => set("featuredImageAlt", e.target.value)} /></Field>
          </Section>
          <Section title="Metadata">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Category"><Input value={form.category} onChange={(e) => set("category", e.target.value)} /></Field>
              <Field label="Read time"><Input value={form.readTime} onChange={(e) => set("readTime", e.target.value)} placeholder="5 min" /></Field>
            </div>
          </Section>
        </TabsContent>

        {/* SEO & status */}
        <TabsContent value="seo" className="mt-6 space-y-6 focus-visible:outline-none">
          <Section title="Visibility">
            <Field label="Status">
              <Select value={form.status} onValueChange={(v) => set("status", v ?? "draft")}>
                <SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{insightStatusOptions.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </Section>
          <Section title="Search engine">
            <Field label="SEO title"><Input value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} /></Field>
            <Field label="SEO description"><Textarea rows={3} value={form.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} /></Field>
          </Section>
        </TabsContent>
      </Tabs>

      {/* Sticky action bar (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-brand-ink/10 bg-white/90 p-4 backdrop-blur-xl sm:hidden">
        <Button variant="outline" className="flex-1" nativeButton={false} render={<Link href="/admin/insights" />}>Discard</Button>
        <SaveButton pending={pending} initial={!!initial} onClick={save} className="flex-1" />
      </div>
    </div>
  );
}

function SaveButton({ pending, initial, onClick, className }: { pending: boolean; initial: boolean; onClick: () => void; className?: string }) {
  return (
    <Button onClick={onClick} disabled={pending} className={className}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? "Saving…" : initial ? "Save changes" : "Create post"}
    </Button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5 rounded-3xl border border-brand-ink/[0.07] bg-white p-6 shadow-card sm:p-7">
      <h2 className="font-heading text-lg font-semibold text-brand-ink">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium uppercase tracking-wide text-brand-ink/60">{label}</Label>
      {children}
    </div>
  );
}

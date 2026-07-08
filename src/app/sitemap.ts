import type { MetadataRoute } from "next";
import { getAppBaseUrl } from "@/lib/app-url";
import { storage } from "@/lib/queries";

// Static public marketing routes (per the redesign plan).
const STATIC_PATHS = [
  "",
  "/about",
  "/executive-coaching",
  "/speaking",
  "/programs",
  "/emerging-leaders",
  "/contact",
  "/insights",
  "/terms",
  "/privacy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getAppBaseUrl();
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
  }));

  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await storage.getPublishedInsights();
    postEntries = posts.map((post) => ({
      url: `${base}/insights/${post.slug}`,
      lastModified: post.updatedAt ?? post.publishedAt ?? new Date(),
    }));
  } catch {
    // DB not reachable at build time — ship static entries only.
  }

  return [...staticEntries, ...postEntries];
}

import type { NextConfig } from "next";
import path from "path";

const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  // Pin the workspace root — a stray parent lockfile otherwise triggers a warning.
  turbopack: { root: path.join(__dirname) },

  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },

  async redirects() {
    return [
      // Standalone services page was removed, redirect to homepage anchor
      { source: "/services", destination: "/#services", permanent: true },
      // Legacy veritashumanedge.com → main site home (Human Edge page dropped from scope).
      { source: "/:path*", has: [{ type: "host", value: "veritashumanedge.com" }], destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;

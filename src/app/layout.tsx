import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TRPCReactProvider } from "@/lib/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { getAppBaseUrl } from "@/lib/app-url";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans-var",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const serif = Playfair_Display({
  variable: "--font-serif-var",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "Vajira Weerasekera";
const DEFAULT_TITLE = "Vajira Weerasekera — Executive Coaching & Leadership Advisory";
const DESCRIPTION =
  "Executive coaching, keynote speaking, and leadership advisory for senior leaders in the AI era — from 30 years leading global teams at Microsoft and Red Hat.";

export const metadata: Metadata = {
  metadataBase: new URL(getAppBaseUrl()),
  // Pages set their own full titles; `%s` passes them through unchanged.
  title: { default: DEFAULT_TITLE, template: "%s" },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "executive coaching",
    "leadership coaching",
    "keynote speaker",
    "leadership advisory",
    "emerging leaders program",
    "360 feedback",
    "Vajira Weerasekera",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DESCRIPTION,
    url: "/",
    locale: "en_AU",
    images: [{ url: "/brand/og.png", width: 1920, height: 820, alt: DEFAULT_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DESCRIPTION,
    images: [{ url: "/brand/og.png", width: 1920, height: 820, alt: DEFAULT_TITLE }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${sans.variable} ${serif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans overflow-x-hidden">
        <NuqsAdapter>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </NuqsAdapter>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}

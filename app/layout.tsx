import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { MotionProvider } from "@/components/motion-provider";
import { BRAND } from "@/lib/constants";
import { getPublicEnv } from "@/lib/env";
import "./globals.css";

const publicEnv = getPublicEnv();
const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL;

export const viewport: Viewport = {
  themeColor: "#06080f",
  colorScheme: "dark"
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${BRAND.productFullTitle} | ${BRAND.name}`,
    template: `%s | ${BRAND.name}`
  },
  description:
    "A practical ZIP bundle from Vertex Digitals with a complete ebook, workbooks, 10 ready-to-use n8n workflows, and a first-client guide to start your AI automation agency in 2027.",
  keywords: [
    "AI agency 2027",
    "AI automation agency",
    "n8n automation workflows",
    "Vertex Digitals",
    "AI agency starter bundle",
    "start an AI agency"
  ],
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  publisher: BRAND.name,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: BRAND.name,
    title: BRAND.productFullTitle,
    description:
      "Get the roadmap, practical workbooks, 10 ready-to-use n8n workflows, and first-client playbook in one instant digital ZIP bundle."
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.productFullTitle,
    description:
      "Start your AI automation agency in 2027 with the complete ebook, templates, 10 n8n workflows, and first-client guide."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark`}>
      <body className="min-h-screen bg-[#06080f] font-sans text-slate-100 antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}

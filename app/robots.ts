import type { MetadataRoute } from "next";
import { getPublicEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const { NEXT_PUBLIC_SITE_URL } = getPublicEnv();
  const baseUrl = NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/login", "/api/"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}

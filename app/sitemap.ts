import type { MetadataRoute } from "next";
import { getPublicEnv } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const { NEXT_PUBLIC_SITE_URL } = getPublicEnv();
  const baseUrl = NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    }
  ];
}

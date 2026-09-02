import { MetadataRoute } from "next";
import { getCachedPublishedArticles, getCachedAllLocations } from "@/lib/db-cache";

const BASE = "https://guide.malnadrealty.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, locations] = await Promise.all([
    getCachedPublishedArticles(),
    getCachedAllLocations(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/guides`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/locations`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/property`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/land`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/construction`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/legal`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/finance`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/tools`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tools/land-area-converter`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tools/construction-cost-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/guides/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const locationPages: MetadataRoute.Sitemap = locations.map((l) => ({
    url: `${BASE}/locations/${l.slug}`,
    lastModified: l.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages, ...locationPages];
}

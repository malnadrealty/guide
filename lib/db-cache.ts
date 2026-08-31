import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";

export const getCachedLocations = unstable_cache(
  async () =>
    db.location.findMany({
      where: { status: "published" },
      orderBy: { order: "asc" },
      select: { id: true, name: true, slug: true, district: true, shortDescription: true, heroImage: true },
    }),
  ["locations-published"],
  { revalidate: 300, tags: ["locations"] }
);

export const getCachedFeaturedArticles = unstable_cache(
  async () =>
    db.article.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 6,
      select: {
        id: true, title: true, slug: true, excerpt: true, featuredImage: true,
        publishedAt: true, content: true,
        category: { select: { name: true, slug: true } },
        location: { select: { name: true, slug: true } },
      },
    }),
  ["articles-featured"],
  { revalidate: 300, tags: ["articles"] }
);

export const getCachedPopularArticles = unstable_cache(
  async () =>
    db.article.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "asc" },
      take: 6,
      select: {
        id: true, title: true, slug: true, excerpt: true, featuredImage: true,
        publishedAt: true, content: true,
        category: { select: { name: true, slug: true } },
        location: { select: { name: true, slug: true } },
      },
    }),
  ["articles-popular"],
  { revalidate: 300, tags: ["articles"] }
);

export const getCachedAllLocations = unstable_cache(
  async () =>
    db.location.findMany({
      where: { status: "published" },
      orderBy: { order: "asc" },
    }),
  ["locations-all"],
  { revalidate: 300, tags: ["locations"] }
);

export const getCachedCategories = unstable_cache(
  async () =>
    db.category.findMany({ orderBy: { order: "asc" } }),
  ["categories"],
  { revalidate: 3600, tags: ["categories"] }
);

export const getCachedArticleBySlug = unstable_cache(
  async (slug: string) =>
    db.article.findUnique({
      where: { slug, status: "published" },
      include: {
        author: { select: { name: true } },
        category: true,
        location: true,
      },
    }),
  ["article-by-slug"],
  { revalidate: 300, tags: ["articles"] }
);

export const getCachedLocationBySlug = unstable_cache(
  async (slug: string) =>
    db.location.findUnique({
      where: { slug, status: "published" },
      include: {
        articles: {
          where: { status: "published" },
          orderBy: { publishedAt: "desc" },
          take: 10,
          select: { id: true, title: true, slug: true, excerpt: true, featuredImage: true, publishedAt: true, content: true, category: { select: { name: true, slug: true } } },
        },
      },
    }),
  ["location-by-slug"],
  { revalidate: 300, tags: ["locations"] }
);

export const getCachedArticlesByCategory = unstable_cache(
  async (categorySlug: string) =>
    db.article.findMany({
      where: { status: "published", category: { slug: categorySlug } },
      orderBy: { publishedAt: "desc" },
      include: { category: true, location: { select: { name: true, slug: true } } },
    }),
  ["articles-by-category"],
  { revalidate: 300, tags: ["articles"] }
);

export const revalidate = 300;

import type { Metadata } from "next";
import { getCachedPublishedArticles, getCachedCategories, getCachedLocations } from "@/lib/db-cache";
import { ArticleCard } from "@/components/public/ArticleCard";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ q?: string; category?: string; location?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q, category, location } = await searchParams;
  const hasFilters = !!(q || category || location);
  return {
    title: "Guides - Property, Land & Local Real Estate",
    description: "Practical guides on buying property, land, construction, legal documents and local real estate across Shimoga and Uttarakannada District.",
    alternates: { canonical: "https://guide.malnadrealty.com/guides" },
    // Filtered/search URLs must not be indexed - they duplicate content across infinite param combos
    robots: hasFilters ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function GuidesPage({ searchParams }: Props) {
  const { q, category, location } = await searchParams;

  const [allArticles, categories, locations] = await Promise.all([
    getCachedPublishedArticles(),
    getCachedCategories(),
    getCachedLocations(),
  ]);

  // Filter cached data in JS — no DB hit for every filter/search combination
  const articles = allArticles.filter((article) => {
    if (category && article.category?.slug !== category) return false;
    if (location && article.location?.slug !== location) return false;
    if (q) {
      const s = q.toLowerCase();
      return (
        article.title.toLowerCase().includes(s) ||
        (article.excerpt?.toLowerCase().includes(s) ?? false)
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs crumbs={[{ label: "Guides" }]} />

      <div className="mt-6 mb-8">
        <p className="text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "#D7242A" }}>All Guides</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-black">
          {q ? `Results for "${q}"` : "Property & Land Guides"}
        </h1>
        <p className="text-gray-500 mt-2">
          {articles.length} {articles.length === 1 ? "guide" : "guides"}
          {category ? ` in ${categories.find((c) => c.slug === category)?.name || category}` : ""}
          {location ? ` for ${locations.find((l) => l.slug === location)?.name || location}` : ""}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className="hidden md:block w-52 flex-shrink-0">
          <div className="sticky top-20">
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Topics</h3>
            <ul className="space-y-1 mb-8">
              <li>
                <Link
                  href="/guides"
                  className={`block text-sm py-1.5 px-2.5 rounded-lg font-medium transition-colors ${!category ? "bg-red-50 text-[#D7242A]" : "text-gray-600 hover:text-black"}`}
                >
                  All topics
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/guides?category=${cat.slug}${q ? `&q=${q}` : ""}`}
                    className={`block text-sm py-1.5 px-2.5 rounded-lg font-medium transition-colors ${category === cat.slug ? "bg-red-50 text-[#D7242A]" : "text-gray-600 hover:text-black"}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Location</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href={`/guides${category ? `?category=${category}` : ""}${q ? `${category ? "&" : "?"}q=${q}` : ""}`}
                  className={`block text-sm py-1.5 px-2.5 rounded-lg font-medium transition-colors ${!location ? "bg-red-50 text-[#D7242A]" : "text-gray-600 hover:text-black"}`}
                >
                  All locations
                </Link>
              </li>
              {locations.map((loc) => (
                <li key={loc.slug}>
                  <Link
                    href={`/guides?location=${loc.slug}${category ? `&category=${category}` : ""}${q ? `&q=${q}` : ""}`}
                    className={`block text-sm py-1.5 px-2.5 rounded-lg font-medium transition-colors ${location === loc.slug ? "bg-red-50 text-[#D7242A]" : "text-gray-600 hover:text-black"}`}
                  >
                    {loc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Article grid */}
        <div className="flex-1 min-w-0">
          {articles.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <p className="text-lg font-semibold mb-2">No guides found</p>
              <p className="text-sm mb-4">
                {q ? `Nothing matched "${q}". Try a different search.` : "Guides will appear here once published."}
              </p>
              {q && <Link href="/guides" className="text-sm font-semibold text-[#D7242A]">Clear search</Link>}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

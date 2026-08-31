export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { ArticleCard } from "@/components/public/ArticleCard";
import { LocationCard } from "@/components/public/LocationCard";
import { CTASection } from "@/components/public/CTASection";
import { SectionHeader } from "@/components/public/SectionHeader";
import { SearchBar } from "@/components/public/SearchBar";

const TOPICS = [
  {
    href: "/property",
    label: "Property",
    desc: "Buying, selling, renting & more",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#D7242A" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/land",
    label: "Land",
    desc: "Agricultural land, sites & investments",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#D7242A" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" strokeLinecap="round" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/construction",
    label: "Construction",
    desc: "Costs, planning & building tips",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#D7242A" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" strokeLinecap="round" />
        <line x1="12" y1="12" x2="12" y2="16" strokeLinecap="round" />
        <line x1="8" y1="14" x2="16" y2="14" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/legal",
    label: "Legal",
    desc: "Documents, registration & legal guides",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#D7242A" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/finance",
    label: "Finance",
    desc: "Loans, EMI, tax & calculators",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#D7242A" strokeWidth="1.8" viewBox="0 0 24 24">
        <line x1="12" y1="1" x2="12" y2="23" strokeLinecap="round" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/guides?category=living",
    label: "Living",
    desc: "Lifestyle, amenities & local insights",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#D7242A" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" />
      </svg>
    ),
  },
];

const POPULAR_CHIPS = [
  "Property in Sagara",
  "Land in Sirsi",
  "Construction Cost",
  "Stamp Duty",
];

async function getHomeData() {
  const [locations, featuredArticles, popularArticles] = await Promise.all([
    db.location.findMany({
      where: { status: "published" },
      orderBy: { order: "asc" },
      take: 8,
      select: { id: true, name: true, slug: true, district: true, shortDescription: true, heroImage: true },
    }),
    db.article.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 5,
      select: {
        id: true, title: true, slug: true, excerpt: true, featuredImage: true,
        publishedAt: true, content: true,
        category: { select: { name: true, slug: true } },
        location: { select: { name: true, slug: true } },
      },
    }),
    db.article.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "asc" },
      take: 4,
      select: {
        id: true, title: true, slug: true, excerpt: true, featuredImage: true,
        publishedAt: true, content: true,
        category: { select: { name: true, slug: true } },
        location: { select: { name: true, slug: true } },
      },
    }),
  ]);
  return { locations, featuredArticles, popularArticles };
}

export default async function HomePage() {
  const { locations, featuredArticles, popularArticles } = await getHomeData();

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[520px] md:min-h-[600px] flex flex-col justify-end bg-black overflow-hidden">
        {/* Hero background */}
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.jpg"
            alt="Malnad landscape"
            fill
            className="object-cover opacity-50"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)" }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pb-10 pt-24 w-full">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 mb-5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D7242A" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-xs font-semibold text-white tracking-wide">Your Local Real Estate Guide</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] mb-4 max-w-2xl">
            Know the place{" "}
            <span style={{ color: "#D7242A" }}>before you buy.</span>
          </h1>
          <p className="text-base md:text-xl text-gray-200 mb-8 max-w-lg leading-relaxed">
            Property, land, homes and local insights across Shivamogga &amp; Uttara Kannada.
          </p>

          {/* Search */}
          <SearchBar />

          {/* Popular chips */}
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-300 font-medium">Popular:</span>
            {POPULAR_CHIPS.map((chip) => (
              <Link
                key={chip}
                href={`/guides?q=${encodeURIComponent(chip)}`}
                className="text-xs px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
              >
                {chip}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        {/* Explore Locations */}
        {locations.length > 0 && (
          <section className="py-12 border-b border-gray-100">
            <SectionHeader
              eyebrow="Explore Locations"
              heading="Browse by location"
              viewAllHref="/locations"
              viewAllLabel="View all locations"
            />
            {/* Horizontal scroll on mobile, grid on desktop */}
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible snap-x snap-mandatory">
              {locations.map((loc) => (
                <div key={loc.id} className="flex-shrink-0 w-44 md:w-auto snap-start">
                  <Link
                    href={`/locations/${loc.slug}`}
                    className="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
                      {loc.heroImage ? (
                        <Image src={loc.heroImage} alt={loc.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="200px" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-bold text-black group-hover:text-[#D7242A] transition-colors">{loc.name}</p>
                      {loc.district && <p className="text-[11px] text-gray-400 mt-0.5">{loc.district}</p>}
                      <span className="mt-1.5 inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#D7242A]">
                        Explore
                        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="m9 18 6-6-6-6" strokeLinecap="round" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Explore Topics */}
        <section className="py-12 border-b border-gray-100">
          <SectionHeader eyebrow="Explore Topics" heading="Find what you're looking for" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {TOPICS.map((topic) => (
              <Link
                key={topic.href}
                href={topic.href}
                className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#D7242A]/30 hover:shadow-md transition-all duration-200"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#fff0f0" }}>
                  {topic.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-black text-[15px] group-hover:text-[#D7242A] transition-colors">{topic.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">{topic.desc}</p>
                </div>
                <svg width="16" height="16" fill="none" stroke="#D7D7D7" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 ml-auto group-hover:stroke-[#D7242A] transition-colors">
                  <path d="m9 18 6-6-6-6" strokeLinecap="round" />
                </svg>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Guides */}
        {featuredArticles.length > 0 && (
          <section className="py-12 border-b border-gray-100">
            <SectionHeader
              eyebrow="Popular Guides"
              heading="Handpicked reads for you"
              viewAllHref="/guides"
              viewAllLabel="View all guides"
            />
            {/* Horizontal scroll on mobile, grid on desktop */}
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible snap-x snap-mandatory">
              {featuredArticles.slice(0, 3).map((article) => (
                <div key={article.id} className="flex-shrink-0 w-72 md:w-auto snap-start">
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popular Questions */}
        {popularArticles.length > 0 && (
          <section className="py-12 border-b border-gray-100">
            <SectionHeader eyebrow="Quick Answers" heading="Common questions answered" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {popularArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/guides/${article.slug}`}
                  className="group flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#D7242A]/30 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5" style={{ backgroundColor: "#D7242A" }}>Q</div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-black leading-snug group-hover:text-[#D7242A] transition-colors">{article.title}</p>
                    {article.excerpt && <p className="text-sm text-gray-400 mt-1 line-clamp-1">{article.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* CTA */}
      <CTASection />
    </>
  );
}

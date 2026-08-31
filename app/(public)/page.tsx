export const revalidate = 300;

import Link from "next/link";
import Image from "next/image";
import { getSettings } from "@/lib/settings";
import { getCachedLocations, getCachedFeaturedArticles, getCachedPopularArticles } from "@/lib/db-cache";
import { ArticleCard } from "@/components/public/ArticleCard";
import { CTASection } from "@/components/public/CTASection";
import { SectionHeader } from "@/components/public/SectionHeader";
import { SearchBar } from "@/components/public/SearchBar";

const TOPICS = [
  {
    href: "/property",
    label: "Property",
    desc: "Buying, selling & renting",
    icon: (
      <svg width="22" height="22" fill="none" stroke="#D7242A" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/land",
    label: "Land",
    desc: "Agricultural & investment",
    icon: (
      <svg width="22" height="22" fill="none" stroke="#D7242A" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" strokeLinecap="round" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/construction",
    label: "Construction",
    desc: "Costs, planning & tips",
    icon: (
      <svg width="22" height="22" fill="none" stroke="#D7242A" strokeWidth="1.8" viewBox="0 0 24 24">
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
    desc: "Docs, registration & law",
    icon: (
      <svg width="22" height="22" fill="none" stroke="#D7242A" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/finance",
    label: "Finance",
    desc: "Loans, EMI & tax",
    icon: (
      <svg width="22" height="22" fill="none" stroke="#D7242A" strokeWidth="1.8" viewBox="0 0 24 24">
        <line x1="12" y1="1" x2="12" y2="23" strokeLinecap="round" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/guides?category=living",
    label: "Living",
    desc: "Lifestyle & local insights",
    icon: (
      <svg width="22" height="22" fill="none" stroke="#D7242A" strokeWidth="1.8" viewBox="0 0 24 24">
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

export default async function HomePage() {
  const [locations, featuredArticles, popularArticles, settings] = await Promise.all([
    getCachedLocations(),
    getCachedFeaturedArticles(),
    getCachedPopularArticles(),
    getSettings(),
  ]);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[520px] md:min-h-[620px] flex flex-col justify-end bg-[#0A0A0A] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={settings.hero_bg_image || "/hero-bg.jpg"}
            alt="Malnad landscape"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            style={{ opacity: 0.45 }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.55) 45%, rgba(10,10,10,0.15) 100%)",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 pb-12 pt-16 md:pb-16 w-full">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-5 h-px bg-[#D7242A]" />
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#D7242A]">
              Shivamogga &amp; Uttara Kannada
            </p>
          </div>

          <h1
            className="text-[2.6rem] leading-[1.08] md:text-[4.5rem] md:leading-[1.06] font-bold text-white mb-5 max-w-3xl"
          >
            {settings.hero_title || "Know the place"}
            <br />
            <span style={{ color: "#D7242A" }}>
              {settings.hero_title_accent || "before you buy."}
            </span>
          </h1>

          <p className="text-base md:text-lg text-[#C0BAB4] mb-8 max-w-lg leading-relaxed">
            {settings.hero_subtitle ||
              "Property, land, homes and local insights across the Malnad region."}
          </p>

          <SearchBar />

          <div className="mt-5 flex flex-wrap gap-2 items-center">
            <span className="text-[11px] text-[#8A8A8A] font-medium tracking-wide">Popular:</span>
            {POPULAR_CHIPS.map((chip) => (
              <Link
                key={chip}
                href={`/guides?q=${encodeURIComponent(chip)}`}
                className="text-[12px] px-3.5 py-1.5 rounded-full border border-white/20 text-white font-medium transition-all duration-200 hover:bg-white hover:text-[#0A0A0A]"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                {chip}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATIONS ────────────────────────────────────────────── */}
      {locations.length > 0 && (
        <section className="py-14 md:py-20 bg-[#F8F6F3]">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <SectionHeader
              eyebrow="Explore Locations"
              heading="Browse by location"
              viewAllHref="/locations"
              viewAllLabel="View all"
            />
            <div className="flex gap-3 overflow-x-auto pb-3 -mx-5 px-5 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible snap-x snap-mandatory scrollbar-hide">
              {locations.map((loc) => (
                <div key={loc.id} className="flex-shrink-0 w-40 md:w-auto snap-start">
                  <Link
                    href={`/locations/${loc.slug}`}
                    className="group block bg-white rounded-xl overflow-hidden border border-[#E8E4DF] hover:border-[#D7D0C8] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-[#F2EFEB] relative">
                      {loc.heroImage ? (
                        <Image
                          src={loc.heroImage}
                          alt={loc.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="200px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#F2EFEB] to-[#E2DDD8]" />
                      )}
                      <div
                        className="absolute inset-x-0 bottom-0 p-3"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(10,10,10,0.80) 0%, transparent 100%)",
                        }}
                      >
                        <p className="text-[13px] font-bold text-white leading-snug">{loc.name}</p>
                        {loc.district && (
                          <p className="text-[10px] text-white/70 mt-0.5">{loc.district}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TOPICS ───────────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <SectionHeader eyebrow="Explore Topics" heading="Find what you're looking for" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TOPICS.map((topic) => (
              <Link
                key={topic.href}
                href={topic.href}
                className="group flex items-center gap-4 p-4 md:p-5 bg-white rounded-xl border border-[#E8E4DF] hover:border-[#D7242A]/20 hover:bg-[#FFFAFA] hover:shadow-md transition-all duration-200"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-[#FDF0F0]">
                  {topic.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#0F0F0F] text-[15px] group-hover:text-[#D7242A] transition-colors leading-snug">
                    {topic.label}
                  </p>
                  <p className="text-[12px] text-[#8A8A8A] mt-0.5 leading-snug hidden sm:block">
                    {topic.desc}
                  </p>
                </div>
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="#CBCBCB"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="flex-shrink-0 ml-auto group-hover:stroke-[#D7242A] group-hover:translate-x-0.5 transition-all duration-200"
                >
                  <path d="m9 18 6-6-6-6" strokeLinecap="round" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED GUIDES ──────────────────────────────────────── */}
      {featuredArticles.length > 0 && (
        <section className="py-14 md:py-20 bg-[#F8F6F3]">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <SectionHeader
              eyebrow="Handpicked Reads"
              heading="Featured guides"
              viewAllHref="/guides"
              viewAllLabel="Browse all guides"
            />
            <div className="flex gap-5 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible snap-x snap-mandatory scrollbar-hide">
              {featuredArticles.slice(0, 3).map((article) => (
                <div key={article.id} className="flex-shrink-0 w-[300px] md:w-auto snap-start">
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── POPULAR Q&A ──────────────────────────────────────────── */}
      {popularArticles.length > 0 && (
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <SectionHeader eyebrow="Quick Answers" heading="Common questions" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {popularArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/guides/${article.slug}`}
                  className="group flex items-start gap-4 p-5 bg-white rounded-xl border border-[#E8E4DF] hover:border-[#D7242A]/20 hover:shadow-md transition-all duration-200"
                >
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white text-[13px] font-bold mt-0.5"
                  >
                    Q
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-[15px] font-semibold text-[#0F0F0F] leading-snug group-hover:text-[#D7242A] transition-colors"
                    >
                      {article.title}
                    </p>
                    {article.excerpt && (
                      <p className="text-sm text-[#8A8A8A] mt-1.5 line-clamp-1 leading-snug">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="#CBCBCB"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="flex-shrink-0 mt-1 group-hover:stroke-[#D7242A] group-hover:translate-x-0.5 transition-all duration-200"
                  >
                    <path d="m9 18 6-6-6-6" strokeLinecap="round" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <CTASection
        eyebrow={settings.cta_eyebrow}
        title={settings.cta_title}
        titleAccent={settings.cta_title_accent}
        ctaLabel={settings.cta_cta_label}
        bgImage={settings.cta_bg_image || undefined}
      />
    </>
  );
}

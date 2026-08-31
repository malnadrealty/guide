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
    desc: "Buying, selling & renting homes",
    icon: (
      <svg width="24" height="24" fill="none" stroke="#D7242A" strokeWidth="1.7" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <path d="M9 22V12h6v10"/>
      </svg>
    ),
  },
  {
    href: "/land",
    label: "Land",
    desc: "Agricultural & investment plots",
    icon: (
      <svg width="24" height="24" fill="none" stroke="#D7242A" strokeWidth="1.7" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20"/>
        <path d="M4 20 8 12l4 5 4-8 4 11"/>
      </svg>
    ),
  },
  {
    href: "/construction",
    label: "Construction",
    desc: "Costs, planning & building tips",
    icon: (
      <svg width="24" height="24" fill="none" stroke="#D7242A" strokeWidth="1.7" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 18h20"/>
        <path d="M4 18a8 8 0 0 1 16 0"/>
        <path d="M12 10V7"/>
      </svg>
    ),
  },
  {
    href: "/legal",
    label: "Legal",
    desc: "Docs, registration & law",
    icon: (
      <svg width="24" height="24" fill="none" stroke="#D7242A" strokeWidth="1.7" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18"/>
        <path d="M5 21h14"/>
        <path d="M4 7h16"/>
        <path d="M4 7 2 13h4z"/>
        <path d="M20 7l2 6h-4z"/>
      </svg>
    ),
  },
  {
    href: "/finance",
    label: "Finance",
    desc: "Loans, EMI & tax planning",
    icon: (
      <svg width="24" height="24" fill="none" stroke="#D7242A" strokeWidth="1.7" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4h10"/>
        <path d="M7 11h10"/>
        <path d="M7 4v7"/>
        <path d="M17 4a6 6 0 0 1-6 7"/>
        <path d="M12 11l7 9"/>
      </svg>
    ),
  },
  {
    href: "/guides?category=living",
    label: "Living",
    desc: "Lifestyle & local insights",
    icon: (
      <svg width="24" height="24" fill="none" stroke="#D7242A" strokeWidth="1.7" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22v-8"/>
        <path d="M12 14c1-4 5-8 9-9-1 4-5 8-9 9z"/>
        <path d="M12 14c-1-4-5-8-9-9 1 4 5 8 9 9z"/>
      </svg>
    ),
  },
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
            {(settings.popular_searches || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .map((chip) => (
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
                            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.2) 70%, transparent 100%)",
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TOPICS.map((topic) => (
              <Link
                key={topic.href}
                href={topic.href}
                className="group relative flex flex-col p-5 bg-white rounded-2xl border border-[#E8E4DF] hover:border-[#D7242A]/25 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
              >
                {/* Accent sweep bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#D7242A] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#FEF2F2] group-hover:bg-[#FDDEDE] transition-colors duration-300 mb-4">
                  {topic.icon}
                </div>

                {/* Text */}
                <p className="font-bold text-[#0F0F0F] text-[15px] leading-snug group-hover:text-[#D7242A] transition-colors duration-200 mb-1.5">
                  {topic.label}
                </p>
                <p className="text-[12px] text-[#8A8A8A] leading-snug flex-1">
                  {topic.desc}
                </p>

                {/* Explore link */}
                <div className="mt-5 flex items-center gap-1 text-[#D7242A] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-[11px] font-semibold tracking-wide">Explore</span>
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="m9 18 6-6-6-6" strokeLinecap="round"/>
                  </svg>
                </div>
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
        <section className="py-14 md:py-20 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-5 md:px-8">

            {/* Header */}
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-2.5 text-[#D7242A]">
                  Quick Answers
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  Common questions
                </h2>
              </div>
              <Link
                href="/guides"
                className="flex items-center gap-1.5 text-sm font-semibold text-[#D7242A] flex-shrink-0 ml-6 group hover:opacity-80 transition-opacity"
              >
                All guides
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                  className="group-hover:translate-x-0.5 transition-transform duration-200">
                  <path d="m9 18 6-6-6-6" strokeLinecap="round"/>
                </svg>
              </Link>
            </div>

            {/* Q&A List */}
            <div className="divide-y divide-[#1C1C1C]">
              {popularArticles.map((article, i) => (
                <Link
                  key={article.id}
                  href={`/guides/${article.slug}`}
                  className="group flex items-start gap-5 md:gap-8 py-5 md:py-6 -mx-5 px-5 md:-mx-8 md:px-8 hover:bg-[#111] transition-colors duration-200"
                >
                  {/* Index number */}
                  <span
                    className="flex-shrink-0 text-[1.6rem] md:text-[2rem] font-black leading-none mt-0.5 tabular-nums w-8 md:w-10 text-right transition-colors duration-200"
                    style={{ color: "#2A2A2A", fontVariantNumeric: "tabular-nums" }}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    {article.category && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white bg-[#D7242A] mb-2">
                        {article.category.name}
                      </span>
                    )}
                    <p className="text-[15px] md:text-[17px] font-bold text-white leading-snug group-hover:text-[#D7242A] transition-colors duration-200">
                      {article.title}
                    </p>
                    {article.excerpt && (
                      <p className="text-[13px] text-[#555] mt-1.5 line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Arrow */}
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="#333"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="flex-shrink-0 mt-1.5 group-hover:stroke-[#D7242A] group-hover:translate-x-1 transition-all duration-200"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6" strokeLinecap="round"/>
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

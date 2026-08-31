import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { CTASection } from "@/components/public/CTASection";

export const metadata: Metadata = {
  title: "About — Malnad Realty",
  description: "Malnad Realty is a local real estate platform helping people buy, sell, and rent properties in the Malnad region in a simple and transparent way.",
  alternates: { canonical: "/about" },
};

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="#D7242A" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="9 12 11 14 15 10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Verified & Reliable Listings",
    desc: "Property listings on the platform are kept genuine and useful. Buyers and tenants can explore options knowing the listings have been verified.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="#D7242A" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="9" y1="7" x2="15" y2="7" strokeLinecap="round" />
        <line x1="9" y1="11" x2="15" y2="11" strokeLinecap="round" />
        <line x1="9" y1="15" x2="12" y2="15" strokeLinecap="round" />
      </svg>
    ),
    title: "Simple & Accessible Property Discovery",
    desc: "Search, shortlist, and explore property details from your phone or computer. The platform works for everyone, including people who are not tech-savvy.",
  },
];

const TOWNS = ["Sagara", "Hosnagara", "Soraba"];

export default function AboutPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-[#F8F6F3] border-b border-[#E8E4DF]">
        <div className="max-w-4xl mx-auto px-5 md:px-8 pt-10 pb-14 md:pt-14 md:pb-20">
          <Breadcrumbs crumbs={[{ label: "About" }]} />
          <div className="mt-8">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#D7242A" }}>
              About Malnad Realty
            </p>
            <h1 className="text-3xl md:text-[2.6rem] font-bold text-[#0F0F0F] leading-tight mb-5 max-w-2xl">
              Simple, trustworthy property search in the Malnad region
            </h1>
            <p className="text-base md:text-lg text-[#4A4A4A] leading-relaxed max-w-2xl">
              Malnad Realty is a local real estate platform that helps people buy, sell, and rent properties in the Malnad region in a simple and transparent way.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHY WE EXIST ─────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#D7242A" }}>
            Why we exist
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F0F0F] mb-8 max-w-2xl">
            Property search in smaller towns deserves to be better
          </h2>
          <div className="space-y-5 text-[#4A4A4A] leading-relaxed text-[15px] max-w-2xl">
            <p>
              Malnad Realty was created with the belief that property search in smaller towns should be simple, trustworthy, and accessible to everyone. In Tier-3 towns, people still depend on scattered information, word-of-mouth, and unorganized broker networks to find properties.
            </p>
            <p>
              This often leads to confusion, lack of reliable information, and unnecessary delays in closing property deals.
            </p>
            <p>
              Malnad Realty brings the local property market online. Buyers, tenants, property owners, brokers, and developers can discover and list properties in one place.
            </p>
          </div>

          {/* Goal callout */}
          <div
            className="mt-10 p-6 md:p-8 rounded-2xl border-l-4 border-[#D7242A]"
            style={{ backgroundColor: "#FDF0F0" }}
          >
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#D7242A] mb-3">Our goal</p>
            <p className="text-[#0F0F0F] font-semibold text-[16px] md:text-[18px] leading-snug">
              To create a trusted local property platform for the Malnad region, starting with Sagara and expanding to nearby towns.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHAT WE FOCUS ON ─────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-[#F8F6F3]">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#D7242A" }}>
            What we focus on
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F0F0F] mb-10">
            Two things that make property discovery easier
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl border border-[#E8E4DF] p-6 md:p-8"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: "#FDF0F0" }}>
                  {f.icon}
                </div>
                <h3 className="text-[16px] font-bold text-[#0F0F0F] mb-3 leading-snug">{f.title}</h3>
                <p className="text-[14px] text-[#6A6A6A] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHERE WE OPERATE ─────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#D7242A" }}>
            Where we operate
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F0F0F] mb-5">
            Currently serving Shimoga District
          </h2>
          <p className="text-[15px] text-[#4A4A4A] leading-relaxed max-w-2xl mb-8">
            Currently active in Sagara, Hosnagara, and Soraba in Shimoga District. More towns will be added as the platform grows.
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            {TOWNS.map((town) => (
              <span
                key={town}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E8E4DF] text-[13px] font-semibold text-[#0F0F0F] bg-[#F8F6F3]"
              >
                <svg width="12" height="12" fill="none" stroke="#D7242A" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {town}
              </span>
            ))}
          </div>

          {/* Contact strip */}
          <div className="border-t border-[#E8E4DF] pt-10">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#D7242A" }}>
              Get in touch
            </p>
            <p className="text-[15px] text-[#4A4A4A] leading-relaxed mb-6 max-w-xl">
              Property owners, brokers, developers, buyers, and tenants. Malnad Realty is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:support@malnadreality.com"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-[#E8E4DF] text-[14px] font-semibold text-[#0F0F0F] hover:border-[#D7242A]/30 hover:bg-[#FFFAFA] transition-all duration-200 group"
              >
                <svg width="16" height="16" fill="none" stroke="#D7242A" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <polyline points="2,4 12,13 22,4" strokeLinecap="round" />
                </svg>
                support@malnadreality.com
              </a>
              <a
                href="tel:+917090316316"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-[#E8E4DF] text-[14px] font-semibold text-[#0F0F0F] hover:border-[#D7242A]/30 hover:bg-[#FFFAFA] transition-all duration-200 group"
              >
                <svg width="16" height="16" fill="none" stroke="#D7242A" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6.18 6.18l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" />
                </svg>
                +91 7090 316 316
              </a>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}

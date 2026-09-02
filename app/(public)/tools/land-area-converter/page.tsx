import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { LandAreaConverter } from "@/components/public/LandAreaConverter";
import { CTASection } from "@/components/public/CTASection";

export const revalidate = false; // static — no DB dependency

export const metadata: Metadata = {
  title: "Land Area Converter - Acre, Gunta, Sq Ft, Cent & Sq Metre",
  description:
    "Convert land measurements used in Karnataka instantly. Acre to Gunta, Square Feet to Gunta, Cent to Square Feet and more. Free land area calculator for property buyers.",
  alternates: {
    canonical: "https://guide.malnadrealty.com/tools/land-area-converter",
  },
  openGraph: {
    type: "website",
    title: "Land Area Converter - Acre, Gunta, Sq Ft, Cent & Sq Metre",
    description:
      "Convert land measurements used in Karnataka instantly. Acre to Gunta, Square Feet to Gunta, Cent to Square Feet and more.",
    url: "https://guide.malnadrealty.com/tools/land-area-converter",
  },
};

const FAQ_ITEMS = [
  {
    q: "What is 1 Acre in Guntas?",
    a: "1 Acre equals 40 Gunta. This is the standard relationship used across Karnataka for agricultural and residential land measurement.",
  },
  {
    q: "How many square feet are in 1 Gunta?",
    a: "1 Gunta equals 1,089 square feet. Gunta (also written Guntha) is one of the most common units for measuring plots and agricultural land in Karnataka.",
  },
  {
    q: "How many square feet are in 1 Cent?",
    a: "1 Cent equals 435.6 square feet. A Cent is 1/100th of an Acre and is widely used in South Karnataka for smaller residential plots.",
  },
  {
    q: "How many Guntas are in 1 Acre?",
    a: "There are 40 Guntas in 1 Acre. Agricultural land in Karnataka is often described in Acres and Guntas — for example, 2 Acres 20 Guntas.",
  },
  {
    q: "How do I convert square feet to Gunta?",
    a: "Divide the square feet value by 1,089. For example, 5,000 square feet ÷ 1,089 = approximately 4.59 Gunta. Use the converter above to calculate any value instantly.",
  },
  {
    q: "How many square metres is 1 Gunta?",
    a: "1 Gunta equals approximately 101.17 square metres (1,089 sq ft ÷ 10.7639). Square metres appear in some official Karnataka land documents and building plans.",
  },
];

export default function LandAreaConverterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Page header */}
      <div className="bg-white border-b border-[#F0EDE8]">
        <div className="max-w-4xl mx-auto px-5 md:px-8 pt-6 pb-8">
          <Breadcrumbs crumbs={[{ label: "Land Area Converter" }]} />

          <div className="mt-6">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
              style={{ color: "#D7242A" }}
            >
              Tools
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F0F0F] leading-tight">
              Land Area Converter
            </h1>
            <p className="text-[#555] text-[1.05rem] mt-2 leading-relaxed">
              Acre · Gunta · Square Feet · Cent · Square Metre
            </p>
            <p className="text-[#6A6A6A] mt-3 max-w-2xl leading-relaxed text-[15px]">
              Convert between land measurement units commonly used in Karnataka.
              Enter any value, select the unit, and see all conversions instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-10 md:py-14">

        {/* Converter widget */}
        <LandAreaConverter />

        {/* Quick reference */}
        <section className="mt-14" aria-labelledby="ref-heading">
          <h2
            id="ref-heading"
            className="text-xl font-bold text-[#0F0F0F] mb-1"
          >
            Common Land Measurements
          </h2>
          <p className="text-[#6A6A6A] text-[13px] mb-5">
            Standard relationships used in Karnataka.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "1 Acre", value: "40 Gunta" },
              { label: "1 Acre", value: "43,560 sq ft" },
              { label: "1 Gunta", value: "1,089 sq ft" },
              { label: "1 Cent", value: "435.6 sq ft" },
              { label: "100 Cent", value: "1 Acre" },
              { label: "1 sq metre", value: "10.764 sq ft" },
            ].map(({ label, value }) => (
              <div
                key={label + value}
                className="flex items-center justify-between px-5 py-3.5 rounded-xl border border-[#E8E4DF] bg-[#F8F6F3]"
              >
                <span className="font-semibold text-[#0F0F0F] text-[14px]">
                  {label}
                </span>
                <span
                  className="font-bold text-[14px]"
                  style={{ color: "#D7242A" }}
                >
                  = {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14" aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="text-xl font-bold text-[#0F0F0F] mb-6"
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {FAQ_ITEMS.map(({ q, a }) => (
              <div key={q} className="border-b border-[#F0EDE8] pb-6">
                <h3 className="font-semibold text-[#0F0F0F] mb-2 text-[15px]">
                  {q}
                </h3>
                <p className="text-[#555] text-[14px] leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related guides */}
        <section
          className="mt-14 p-6 rounded-2xl border border-[#E8E4DF]"
          style={{ backgroundColor: "#F8F6F3" }}
        >
          <h2 className="font-bold text-[#0F0F0F] mb-4 text-[15px]">
            Related land guides
          </h2>
          <ul className="space-y-2.5">
            <li>
              <a
                href="/land"
                className="text-[14px] font-medium hover:underline underline-offset-2"
                style={{ color: "#D7242A" }}
              >
                Land buying guides for the Malnad region →
              </a>
            </li>
            <li>
              <a
                href="/guides/things-to-check-before-buying-land-in-sagara"
                className="text-[14px] font-medium hover:underline underline-offset-2"
                style={{ color: "#D7242A" }}
              >
                Things to check before buying land in Sagara →
              </a>
            </li>
            <li>
              <a
                href="/guides/agricultural-land-in-sagara-a-complete-buyers-guide"
                className="text-[14px] font-medium hover:underline underline-offset-2"
                style={{ color: "#D7242A" }}
              >
                Agricultural land in Sagara: a complete buyer&apos;s guide →
              </a>
            </li>
          </ul>
        </section>
      </div>

      <CTASection />
    </>
  );
}

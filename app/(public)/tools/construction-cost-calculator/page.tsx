import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ConstructionCostCalculator } from "@/components/public/ConstructionCostCalculator";
import { CTASection } from "@/components/public/CTASection";

export const revalidate = false;

export const metadata: Metadata = {
  title: "Construction Cost Calculator - Estimate House Building Cost",
  description:
    "Estimate the cost of building a house using your built-up area and construction rate per square foot. Free construction cost calculator for Shivamogga, Sagara and Malnad region.",
  alternates: {
    canonical: "https://guide.malnadrealty.com/tools/construction-cost-calculator",
  },
  openGraph: {
    type: "website",
    title: "Construction Cost Calculator - Estimate House Building Cost",
    description:
      "Estimate the cost of building a house using built-up area and construction rate per square foot.",
    url: "https://guide.malnadrealty.com/tools/construction-cost-calculator",
  },
};

const FAQ_ITEMS = [
  {
    q: "How is house construction cost calculated?",
    a: "Construction cost is calculated by multiplying the built-up area by the construction rate per square foot. For example, 1,500 sq ft × ₹2,000 per sq ft = ₹30,00,000. This is the standard formula used by contractors and builders across Karnataka.",
  },
  {
    q: "How do I calculate construction cost per square foot?",
    a: "Construction cost per square foot = Total construction cost ÷ Built-up area. If a 1,500 sq ft house costs ₹30,00,000 to build, the cost per sq ft is ₹30,00,000 ÷ 1,500 = ₹2,000 per sq ft.",
  },
  {
    q: "What is built-up area?",
    a: "Built-up area is the total floor area within the outer walls of a building, including all rooms, bathrooms, kitchen, staircase, and internal walls. It does not include open terraces or external compound walls. Construction cost is calculated on built-up area.",
  },
  {
    q: "Does construction cost include the cost of land?",
    a: "No. Construction cost covers only the building structure — materials and labour. Land cost is separate. Your total project budget will also include stamp duty, registration, architect fees, and other charges.",
  },
  {
    q: "Why do construction costs vary so much?",
    a: "Construction costs depend on material quality, finishes, structural design, number of floors, site conditions, labour rates, and contractor. Two houses with the same built-up area can cost very differently. Always get a detailed written quote from your contractor before finalising a budget.",
  },
  {
    q: "How much does it cost to build a house in Sagara or Shivamogga?",
    a: "Costs in smaller towns like Sagara and Shivamogga are generally lower than in Bengaluru, but vary by contractor and finish level. Use this calculator with your contractor's actual quoted rate for a project-specific estimate. Published averages can be misleading.",
  },
];

export default function ConstructionCostCalculatorPage() {
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
          <Breadcrumbs
            crumbs={[
              { label: "Tools", href: "/tools" },
              { label: "Construction Cost Calculator" },
            ]}
          />

          <div className="mt-6">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
              style={{ color: "#D7242A" }}
            >
              Tools
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F0F0F] leading-tight">
              Construction Cost Calculator
            </h1>
            <p className="text-[#555] text-[1.05rem] mt-2 leading-relaxed">
              Estimate the Cost of Building a House
            </p>
            <p className="text-[#6A6A6A] mt-3 max-w-2xl leading-relaxed text-[15px]">
              Enter your built-up area and your contractor&apos;s rate per square foot to get an
              indicative cost estimate. The calculation is simple: area × rate = total cost.
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-10 md:py-14">

        {/* Calculator widget */}
        <ConstructionCostCalculator />

        {/* What affects cost */}
        <section className="mt-14" aria-labelledby="factors-heading">
          <h2 id="factors-heading" className="text-xl font-bold text-[#0F0F0F] mb-1">
            What affects construction cost?
          </h2>
          <p className="text-[#6A6A6A] text-[13px] mb-5">
            Actual cost can differ significantly from an estimate based on area and rate alone.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Quality of materials", detail: "Flooring, fittings, electrical, plumbing grade" },
              { label: "Type of structure", detail: "RCC frame, load-bearing, number of floors" },
              { label: "Design complexity", detail: "Simple rectangle vs. complex floor plan" },
              { label: "Site conditions", detail: "Soil type, slope, foundation requirement" },
              { label: "Labour rates", detail: "Vary by location, season, and contractor" },
              { label: "Finish level", detail: "Basic tiles vs. premium vitrified, woodwork" },
            ].map(({ label, detail }) => (
              <div
                key={label}
                className="flex gap-3 p-4 rounded-xl border border-[#E8E4DF] bg-[#F8F6F3]"
              >
                <span
                  className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-[5px]"
                  style={{ backgroundColor: "#D7242A" }}
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-[#0F0F0F] text-[14px]">{label}</p>
                  <p className="text-[#6A6A6A] text-[13px]">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-xl font-bold text-[#0F0F0F] mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {FAQ_ITEMS.map(({ q, a }) => (
              <div key={q} className="border-b border-[#F0EDE8] pb-6">
                <h3 className="font-semibold text-[#0F0F0F] mb-2 text-[15px]">{q}</h3>
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
          <h2 className="font-bold text-[#0F0F0F] mb-4 text-[15px]">Related guides</h2>
          <ul className="space-y-2.5">
            <li>
              <a
                href="/construction"
                className="text-[14px] font-medium hover:underline underline-offset-2"
                style={{ color: "#D7242A" }}
              >
                Construction guides for the Malnad region →
              </a>
            </li>
            <li>
              <a
                href="/property"
                className="text-[14px] font-medium hover:underline underline-offset-2"
                style={{ color: "#D7242A" }}
              >
                Property buying guides →
              </a>
            </li>
            <li>
              <a
                href="/tools/land-area-converter"
                className="text-[14px] font-medium hover:underline underline-offset-2"
                style={{ color: "#D7242A" }}
              >
                Land Area Converter (Acre, Gunta, Sq Ft) →
              </a>
            </li>
          </ul>
        </section>
      </div>

      <CTASection />
    </>
  );
}

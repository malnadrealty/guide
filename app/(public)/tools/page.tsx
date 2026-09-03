import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { CTASection } from "@/components/public/CTASection";

export const revalidate = false;

export const metadata: Metadata = {
  title: "Property Tools & Calculators",
  description:
    "Free property tools and calculators for land measurement, house construction cost, stamp duty and registration charges in Karnataka.",
  alternates: {
    canonical: "https://guide.malnadrealty.com/tools",
  },
  openGraph: {
    type: "website",
    title: "Property Tools & Calculators | Malnad Realty Guide",
    description:
      "Free property tools and calculators for land measurement, house construction cost, stamp duty and registration charges in Karnataka.",
    url: "https://guide.malnadrealty.com/tools",
  },
};

const TOOLS = [
  {
    href: "/tools/land-area-converter",
    label: "Land Area Converter",
    category: "Measurement",
    desc: "Convert between Square Feet, Gunta, Acre, Square Metre and Cent. Useful for comparing plot sizes quoted in different units.",
    cta: "Use Converter",
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 3v18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/tools/construction-cost-calculator",
    label: "Construction Cost Calculator",
    category: "Cost Estimate",
    desc: "Enter your built-up area and construction rate to get a quick total cost estimate. Useful for budgeting before approaching a contractor.",
    cta: "Calculate Cost",
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 21h18M9 21V8.5L12 5l3 3.5V21M3 21V14l3-3m15 10V14l-3-3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/tools/stamp-duty-registration-calculator",
    label: "Stamp Duty & Registration Calculator",
    category: "Government Fees",
    desc: "Calculate the stamp duty and registration charges for buying property in Karnataka. Rates updated to August 2025.",
    cta: "Calculate Charges",
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="8" y1="13" x2="16" y2="13" strokeLinecap="round" />
        <line x1="8" y1="17" x2="16" y2="17" strokeLinecap="round" />
      </svg>
    ),
  },
];

const TRUST_CHIPS = ["Free to use", "No login required", "Updated for 2026"];

export default function ToolsPage() {
  return (
    <>
      {/* Page header */}
      <div className="bg-white border-b border-[#F0EDE8]">
        <div className="max-w-4xl mx-auto px-5 md:px-8 pt-6 pb-10">
          <Breadcrumbs crumbs={[{ label: "Tools" }]} />
          <div className="mt-6">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
              style={{ color: "#D7242A" }}
            >
              Tools
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F0F0F] leading-tight">
              Free tools to help you plan better
            </h1>
            <p className="text-[#6A6A6A] mt-3 max-w-xl leading-relaxed text-[15px]">
              Simple calculators and converters for buying land, building a house and understanding property costs.
            </p>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-2 mt-5">
              {TRUST_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full border border-[#E8E4DF]"
                  style={{ color: "#555" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: "#D7242A" }}
                  />
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tools grid */}
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              aria-label={tool.label}
              className="group relative flex flex-col gap-5 p-6 rounded-2xl border border-[#E8E4DF] bg-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
            >
              {/* Accent sweep bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#D7242A] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

              {/* Category chip */}
              <span
                className="self-start text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "#FEF2F2", color: "#D7242A" }}
              >
                {tool.category}
              </span>

              {/* Icon */}
              <span
                className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FEF2F2] group-hover:bg-[#FDDEDE] transition-colors duration-300"
                style={{ color: "#D7242A" }}
                aria-hidden="true"
              >
                {tool.icon}
              </span>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h2 className="font-extrabold text-[#0F0F0F] text-[17px] leading-snug mb-2 group-hover:text-[#D7242A] transition-colors duration-200">
                  {tool.label}
                </h2>
                <p className="text-[#6A6A6A] text-[14px] leading-relaxed">
                  {tool.desc}
                </p>
              </div>

              {/* CTA */}
              <span
                className="inline-flex items-center justify-center w-full py-3 rounded-xl text-[13px] font-semibold text-white"
                style={{ backgroundColor: "#D7242A" }}
              >
                {tool.cta}
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  className="ml-1.5"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <CTASection />
    </>
  );
}

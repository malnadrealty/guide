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
    shortDesc: "Convert land measurements easily",
    desc: "Convert between Square Feet, Gunta, Acre, Square Metre and Cent.",
    cta: "Use Converter",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 3v18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/tools/construction-cost-calculator",
    label: "Construction Cost Calculator",
    shortDesc: "Estimate your house construction cost",
    desc: "Enter your built-up area and construction rate to get an estimated cost.",
    cta: "Calculate Cost",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 21h18M9 21V8.5L12 5l3 3.5V21M3 21V14l3-3m15 10V14l-3-3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/tools/stamp-duty-registration-calculator",
    label: "Stamp Duty & Registration Calculator",
    shortDesc: "Estimate property registration costs",
    desc: "Calculate estimated stamp duty and registration charges for a property purchase in Karnataka.",
    cta: "Calculate Charges",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="8" y1="13" x2="16" y2="13" strokeLinecap="round" />
        <line x1="8" y1="17" x2="16" y2="17" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function ToolsPage() {
  return (
    <>
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
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 md:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col gap-3 p-6 rounded-2xl border border-[#E8E4DF] bg-white hover:border-[#D7242A] hover:shadow-sm transition-all duration-150"
            >
              <span
                className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ backgroundColor: "#F8F6F3", color: "#D7242A" }}
              >
                {tool.icon}
              </span>
              <div>
                <p className="font-bold text-[#0F0F0F] mb-0.5 group-hover:text-[#D7242A] transition-colors duration-150">
                  {tool.shortDesc}
                </p>
                <p className="text-[#6A6A6A] text-[13px] leading-relaxed">{tool.desc}</p>
              </div>
              <span
                className="mt-auto text-[12px] font-semibold"
                style={{ color: "#D7242A" }}
              >
                {tool.cta} →
              </span>
            </Link>
          ))}
        </div>
      </div>

      <CTASection />
    </>
  );
}

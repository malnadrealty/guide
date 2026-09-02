import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/public/CTASection";

export const revalidate = false;

export const metadata: Metadata = {
  title: "Tools - Free Property and Land Calculators",
  description:
    "Free tools for property buyers and landowners in Shivamogga, Sagara, and the Malnad region. Convert land areas, estimate construction costs, and more.",
  alternates: {
    canonical: "https://guide.malnadrealty.com/tools",
  },
};

const TOOLS = [
  {
    href: "/tools/land-area-converter",
    label: "Land Area Converter",
    desc: "Convert between Acre, Gunta, Square Feet, Cent, and Square Metre. Supports plot dimension input (L × W).",
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
    desc: "Estimate the cost of building a house. Enter your built-up area and contractor rate to get an indicative total.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 21h18M9 21V8.5L12 5l3 3.5V21M3 21V14l3-3m15 10V14l-3-3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/tools/stamp-duty-registration-calculator",
    label: "Stamp Duty & Registration Calculator",
    desc: "Estimate stamp duty and registration charges when buying property in Karnataka.",
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
        <div className="max-w-4xl mx-auto px-5 md:px-8 pt-10 pb-10">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
            style={{ color: "#D7242A" }}
          >
            Tools
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F0F0F] leading-tight">
            Free property tools
          </h1>
          <p className="text-[#6A6A6A] mt-3 max-w-xl leading-relaxed text-[15px]">
            Simple calculators and converters for buyers, landowners, and builders in the Malnad region.
          </p>
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
                <p className="font-bold text-[#0F0F0F] mb-1 group-hover:text-[#D7242A] transition-colors duration-150">
                  {tool.label}
                </p>
                <p className="text-[#6A6A6A] text-[13px] leading-relaxed">{tool.desc}</p>
              </div>
              <span
                className="mt-auto text-[12px] font-semibold"
                style={{ color: "#D7242A" }}
              >
                Open tool →
              </span>
            </Link>
          ))}
        </div>
      </div>

      <CTASection />
    </>
  );
}

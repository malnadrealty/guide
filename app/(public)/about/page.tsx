import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { CTASection } from "@/components/public/CTASection";

export const metadata: Metadata = {
  title: "About — Malnad Realty Guide",
  description: "Malnad Realty Guide provides local property, land and real estate information across Shimoga and Uttarakannada District to help you understand the place before you buy.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumbs crumbs={[{ label: "About" }]} />

        <div className="mt-8">
          <p className="text-xs font-bold tracking-[0.15em] uppercase mb-3" style={{ color: "#D7242A" }}>About us</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-6">
            Know the place before you buy.
          </h1>
        </div>

        <div className="prose prose-gray max-w-none space-y-6 text-base leading-relaxed text-gray-700">
          <p>
            <strong className="text-black">Malnad Realty Guide</strong> is a local real estate knowledge resource focused on Shimoga and Uttarakannada District — two of Karnataka&apos;s most distinctive regions for property, land and investment.
          </p>
          <p>
            The Guide exists to fill a gap. When someone considers buying land near Sagara or a house in Sirsi, they need more than listings — they need to understand the place. Local property values, land documents, legal procedures, construction costs, connectivity, amenities. Information that is genuinely useful and locally specific.
          </p>
          <p>
            The Guide is maintained by <a href="https://malnadrealty.com" target="_blank" rel="noopener noreferrer" className="text-[#D7242A] font-medium hover:underline">Malnad Realty</a>, a verified property marketplace focused on the same region. The Guide and the marketplace serve different purposes — the Guide helps you understand; the marketplace helps you transact.
          </p>

          <h2 className="text-xl font-bold text-black mt-10 mb-3">What we cover</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Property", desc: "Buying, selling, renting" },
              { label: "Land", desc: "Agricultural, plantation & sites" },
              { label: "Construction", desc: "Costs, process & planning" },
              { label: "Legal", desc: "Documents & registration" },
              { label: "Finance", desc: "Loans, EMI & buying costs" },
              { label: "Locations", desc: "Local area guides" },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="font-bold text-black text-sm">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-black mt-10 mb-3">Our commitment</h2>
          <p>
            Every guide is written to be genuinely useful. We do not publish thin content, invented statistics or keyword-stuffed articles. Where we cite facts about regulations, costs or procedures, we aim to be accurate and indicate where estimates may vary.
          </p>
          <p>
            Real estate information changes. We review and update guides when relevant laws, costs or procedures change. If you find something outdated or incorrect, please let us know.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/guides" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: "#D7242A" }}>
            Browse guides
          </Link>
          <Link href="/contact" className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-black hover:border-gray-400 transition-colors">
            Contact us
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <CTASection />
      </div>
    </>
  );
}

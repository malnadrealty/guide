import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { StampDutyCalculator } from "@/components/public/StampDutyCalculator";
import { CTASection } from "@/components/public/CTASection";

export const revalidate = false;

export const metadata: Metadata = {
  title: "Stamp Duty & Registration Calculator Karnataka | Malnad Realty",
  description:
    "Calculate estimated stamp duty and registration charges for property purchases in Karnataka. Simple, quick and easy to understand.",
  alternates: {
    canonical: "https://guide.malnadrealty.com/tools/stamp-duty-registration-calculator",
  },
  openGraph: {
    type: "website",
    title: "Stamp Duty & Registration Calculator Karnataka | Malnad Realty",
    description:
      "Calculate estimated stamp duty and registration charges for property purchases in Karnataka.",
    url: "https://guide.malnadrealty.com/tools/stamp-duty-registration-calculator",
  },
};

const FAQ_ITEMS = [
  {
    q: "What is stamp duty?",
    a: "Stamp duty is a state government tax paid when buying property. It is collected to give the sale deed legal validity. Without paying stamp duty, the document cannot be used as evidence in court and the transfer is not legally enforceable. In Karnataka, stamp duty ranges from 2% to 5% of the property value depending on the value slab.",
  },
  {
    q: "What is registration fee?",
    a: "Registration fee is the administrative charge paid to record the property in the buyer's name at the Sub-Registrar's office. Once registered, the transfer of ownership is officially entered in government land records, establishing the buyer's legal title. In Karnataka, the registration fee is 2% of the property value, effective from 31 August 2025.",
  },
  {
    q: "How is stamp duty calculated in Karnataka?",
    a: "Karnataka uses a slab-based system. For properties valued up to ₹20 lakh, stamp duty is 2%. For ₹20 lakh to ₹45 lakh it is 3%. Above ₹45 lakh it is 5%. An additional cess of 10% of the stamp duty amount also applies. Charges are calculated on whichever is higher - the agreed sale price or the government guidance value (circle rate) for the property.",
  },
  {
    q: "Who pays stamp duty?",
    a: "The buyer is responsible for paying stamp duty and registration charges in Karnataka. Stamp duty is typically paid before or at the time of document execution. Registration is done at the Sub-Registrar's office and must be completed within four months of the sale date.",
  },
  {
    q: "Are stamp duty and registration charges the same?",
    a: "No. Stamp duty and registration charges are two separate payments. Stamp duty is a tax on the property transaction. Registration fee is the charge for recording the document at the government office. In Karnataka both are calculated on the property value, but at different rates.",
  },
  {
    q: "What other costs should I consider when buying property?",
    a: "In addition to stamp duty and registration, budget for: legal fees for document verification and sale deed drafting, home loan processing charges if you are taking a loan, GST on under-construction properties (not applicable on ready-to-move properties or resale), brokerage if an agent is involved, mutation fees to update revenue records, and any society or development charges. The total cost of purchase is typically 7–8% above the property price in Karnataka.",
  },
];

export default function StampDutyPage() {
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
              { label: "Stamp Duty & Registration Calculator" },
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
              Stamp Duty &amp; Registration Calculator
            </h1>
            <p className="text-[#555] text-[1.05rem] mt-2 leading-relaxed">
              Karnataka - Property Purchase
            </p>
            <p className="text-[#6A6A6A] mt-3 max-w-2xl leading-relaxed text-[15px]">
              Estimate the stamp duty and registration charges payable when buying property in Karnataka.
              Enter the property value to get a quick breakdown of government charges.
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-10 md:py-14">

        {/* Calculator */}
        <StampDutyCalculator />

        {/* How it works */}
        <section className="mt-14" aria-labelledby="how-heading">
          <h2 id="how-heading" className="text-xl font-bold text-[#0F0F0F] mb-1">
            How stamp duty is calculated in Karnataka
          </h2>
          <p className="text-[#6A6A6A] text-[13px] mb-5">
            Karnataka uses a slab system. The rate depends on the property value.
          </p>
          <div className="overflow-x-auto rounded-xl border border-[#E8E4DF]">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-[#E8E4DF]" style={{ backgroundColor: "#F8F6F3" }}>
                  <th className="text-left px-5 py-3 font-semibold text-[#0F0F0F]">Property value</th>
                  <th className="text-right px-5 py-3 font-semibold text-[#0F0F0F]">Stamp duty</th>
                  <th className="text-right px-5 py-3 font-semibold text-[#0F0F0F]">Cess</th>
                  <th className="text-right px-5 py-3 font-semibold text-[#0F0F0F]">Registration</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#F0EDE8]">
                <tr>
                  <td className="px-5 py-3 text-[#555]">Up to ₹20 lakh</td>
                  <td className="px-5 py-3 text-right font-semibold text-[#0F0F0F]">2%</td>
                  <td className="px-5 py-3 text-right text-[#555]">10% of stamp duty</td>
                  <td className="px-5 py-3 text-right font-semibold text-[#0F0F0F]">2%</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-[#555]">₹20 lakh – ₹45 lakh</td>
                  <td className="px-5 py-3 text-right font-semibold text-[#0F0F0F]">3%</td>
                  <td className="px-5 py-3 text-right text-[#555]">10% of stamp duty</td>
                  <td className="px-5 py-3 text-right font-semibold text-[#0F0F0F]">2%</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-[#555]">Above ₹45 lakh</td>
                  <td className="px-5 py-3 text-right font-semibold text-[#0F0F0F]">5%</td>
                  <td className="px-5 py-3 text-right text-[#555]">10% of stamp duty</td>
                  <td className="px-5 py-3 text-right font-semibold text-[#0F0F0F]">2%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[12px] text-[#9A9A9A]">
            Rates apply to residential, commercial, agricultural land and site/plot transactions.
            Registration fee of 2% is effective from 31 August 2025.
            An additional surcharge (2–3% of stamp duty, varies by location) may also apply.
          </p>
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
          <h2 className="font-bold text-[#0F0F0F] mb-4 text-[15px]">Related guides and tools</h2>
          <ul className="space-y-2.5">
            <li>
              <a
                href="/legal"
                className="text-[14px] font-medium hover:underline underline-offset-2"
                style={{ color: "#D7242A" }}
              >
                Legal documents required to buy property in Karnataka →
              </a>
            </li>
            <li>
              <a
                href="/property"
                className="text-[14px] font-medium hover:underline underline-offset-2"
                style={{ color: "#D7242A" }}
              >
                Property buying guides for the Malnad region →
              </a>
            </li>
            <li>
              <a
                href="/tools/construction-cost-calculator"
                className="text-[14px] font-medium hover:underline underline-offset-2"
                style={{ color: "#D7242A" }}
              >
                Construction Cost Calculator →
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

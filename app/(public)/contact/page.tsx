import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contact — Malnad Realty Guide",
  description: "Get in touch with the Malnad Realty Guide team. Questions, corrections or feedback welcome.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Breadcrumbs crumbs={[{ label: "Contact" }]} />

      <div className="mt-8 mb-10">
        <p className="text-xs font-bold tracking-[0.15em] uppercase mb-3" style={{ color: "#D7242A" }}>Get in touch</p>
        <h1 className="text-3xl font-extrabold text-black">Contact us</h1>
        <p className="text-gray-500 mt-3">
          Questions, corrections, or feedback? We are happy to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <a
          href="https://malnadrealty.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 hover:border-[#D7242A]/30 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#fff0f0" }}>
            <svg width="20" height="20" fill="none" stroke="#D7242A" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" />
              <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-black text-sm">Malnad Realty</p>
            <p className="text-xs text-gray-400 mt-0.5">For property enquiries, visit the main marketplace</p>
            <p className="text-xs font-medium text-[#D7242A] mt-2">malnadrealty.com →</p>
          </div>
        </a>

        <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-100">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#fff0f0" }}>
            <svg width="20" height="20" fill="none" stroke="#D7242A" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-black text-sm">Content feedback</p>
            <p className="text-xs text-gray-400 mt-0.5">Found something incorrect or outdated?</p>
            <a href="mailto:guide@malnadrealty.com" className="text-xs font-medium text-[#D7242A] mt-2 block hover:underline">
              guide@malnadrealty.com →
            </a>
          </div>
        </div>
      </div>

      {/* Simple contact form */}
      <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
        <h2 className="text-lg font-bold text-black mb-5">Send a message</h2>
        <form
          action="https://malnadrealty.com/contact"
          method="GET"
          className="space-y-4"
        >
          <div>
            <label htmlFor="contact-name" className="block text-sm font-semibold text-black mb-1.5">
              Your name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              placeholder="Name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D7242A] transition-colors bg-white"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-semibold text-black mb-1.5">
              Phone or email
            </label>
            <input
              id="contact-email"
              name="contact"
              type="text"
              required
              placeholder="Phone number or email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D7242A] transition-colors bg-white"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-sm font-semibold text-black mb-1.5">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              required
              placeholder="Your message..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D7242A] transition-colors bg-white resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#D7242A" }}
          >
            Send message
          </button>
        </form>
      </div>
    </div>
  );
}

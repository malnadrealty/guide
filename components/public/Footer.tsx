import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const TOPIC_LINKS = [
  { href: "/property", label: "Property" },
  { href: "/land", label: "Land" },
  { href: "/construction", label: "Construction" },
  { href: "/legal", label: "Legal" },
  { href: "/finance", label: "Finance" },
];

const GUIDE_LINKS = [
  { href: "/guides", label: "All Guides" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo className="[&_span]:!text-white [&_span:last-child]:!text-gray-400" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Know the place before you buy. Property, land, homes and local insights across Shivamogga &amp; Uttara Kannada.
            </p>
            <a
              href="https://malnadrealty.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-white border border-white/20 px-4 py-2 rounded-lg hover:border-white/60 transition-colors"
            >
              Visit Malnad Realty
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>

          {/* Topics */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">Topics</h3>
            <ul className="space-y-2.5">
              {TOPIC_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">Navigate</h3>
            <ul className="space-y-2.5">
              {GUIDE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            &copy; {year} Malnad Realty. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            A content guide by{" "}
            <a href="https://malnadrealty.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              Malnad Realty
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

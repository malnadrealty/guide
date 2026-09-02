"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const NAV_LINKS = [
  { href: "/locations", label: "Locations" },
  { href: "/guides", label: "Guides" },
  { href: "/property", label: "Property" },
  { href: "/land", label: "Land" },
  { href: "/construction", label: "Construction" },
  { href: "/legal", label: "Legal" },
  { href: "/finance", label: "Finance" },
  { href: "/tools", label: "Tools" },
  { href: "/tools/land-area-converter", label: "Land Area Converter" },
  { href: "/tools/construction-cost-calculator", label: "Construction Cost Calculator" },
  { href: "/tools/stamp-duty-registration-calculator", label: "Stamp Duty Calculator" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  logoImageUrl?: string;
  logoDarkUrl?: string;
}

export function MobileMenu({ open, onClose, logoImageUrl, logoDarkUrl }: Props) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div
      className="fixed inset-0 z-[60] flex"
      style={{
        pointerEvents: open ? "auto" : "none",
      }}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer — slides in from right */}
      <div
        className="relative ml-auto w-[280px] h-full bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Logo imageUrl={logoImageUrl} darkImageUrl={logoDarkUrl} variant="dark" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center justify-between px-5 py-4 text-[15px] font-medium text-black hover:text-[#D7242A] hover:bg-gray-50 active:bg-gray-100 transition-colors"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {link.label}
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="p-5 border-t border-gray-100">
          <a
            href="https://malnadrealty.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold text-white active:opacity-80 transition-opacity"
            style={{ backgroundColor: "#D7242A", WebkitTapHighlightColor: "transparent" }}
          >
            Explore Malnad Realty
          </a>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { MobileMenu } from "@/components/public/MobileMenu";
import { SearchModal } from "@/components/public/SearchModal";

interface HeaderProps {
  logoLine1?: string;
  logoLine2?: string;
  logoImageUrl?: string;
  logoDarkUrl?: string;
}

const NAV_LINKS = [
  { href: "/locations", label: "Locations" },
  { href: "/property", label: "Property" },
  { href: "/land", label: "Land" },
  { href: "/construction", label: "Construction" },
  { href: "/legal", label: "Legal" },
  { href: "/finance", label: "Finance" },
  { href: "/guides", label: "All Guides" },
];

export function Header({ logoLine1, logoLine2, logoImageUrl, logoDarkUrl }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-white transition-all duration-300"
        style={{
          borderBottom: scrolled ? "1px solid #E8E4DF" : "1px solid #F0EDE9",
          boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Logo
            line1={logoLine1}
            line2={logoLine2}
            imageUrl={logoImageUrl}
            darkImageUrl={logoDarkUrl}
            variant="dark"
          />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-[#4A4A4A] hover:text-[#D7242A] hover:bg-[#FDF0F0] rounded-lg transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search guides"
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#4A4A4A] hover:text-[#D7242A] hover:bg-[#FDF0F0] rounded-lg transition-all duration-200 hidden md:flex"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <span className="hidden xl:inline font-medium">Search</span>
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="p-2.5 text-[#4A4A4A] hover:text-[#D7242A] hover:bg-[#FDF0F0] rounded-lg transition-all duration-200 md:hidden"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>

            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              className="p-2.5 text-[#4A4A4A] hover:text-[#D7242A] hover:bg-[#FDF0F0] rounded-lg transition-all duration-200"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                <line x1="3" y1="12" x2="15" y2="12" strokeLinecap="round" />
                <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        logoImageUrl={logoImageUrl}
        logoDarkUrl={logoDarkUrl}
      />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

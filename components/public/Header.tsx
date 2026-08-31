"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { MobileMenu } from "@/components/public/MobileMenu";
import { SearchModal } from "@/components/public/SearchModal";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-white"
        style={{
          borderBottom: scrolled ? "1px solid #E5E5E5" : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
          transition: "box-shadow 0.2s, border-color 0.2s",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-black">
            <Link href="/locations" className="hover:text-[#D7242A] transition-colors">Locations</Link>
            <Link href="/property" className="hover:text-[#D7242A] transition-colors">Property</Link>
            <Link href="/land" className="hover:text-[#D7242A] transition-colors">Land</Link>
            <Link href="/legal" className="hover:text-[#D7242A] transition-colors">Legal</Link>
            <Link href="/finance" className="hover:text-[#D7242A] transition-colors">Finance</Link>
            <Link href="/guides" className="hover:text-[#D7242A] transition-colors">Guides</Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
                <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

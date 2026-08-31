"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    href: "/",
    label: "Home",
    icon: (active: boolean) => (
      <svg width="22" height="22" fill="none" stroke={active ? "#D7242A" : "currentColor"} strokeWidth="2" viewBox="0 0 24 24">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/locations",
    label: "Locations",
    icon: (active: boolean) => (
      <svg width="22" height="22" fill="none" stroke={active ? "#D7242A" : "currentColor"} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    href: "/property",
    label: "Topics",
    icon: (active: boolean) => (
      <svg width="22" height="22" fill="none" stroke={active ? "#D7242A" : "currentColor"} strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/guides",
    label: "Guides",
    icon: (active: boolean) => (
      <svg width="22" height="22" fill="none" stroke={active ? "#D7242A" : "currentColor"} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/guides",
    label: "Menu",
    isMenu: true,
    icon: (active: boolean) => (
      <svg width="22" height="22" fill="none" stroke={active ? "#D7242A" : "currentColor"} strokeWidth="2" viewBox="0 0 24 24">
        <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
        <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
        <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white"
      style={{
        borderTop: "1px solid #E8E4DF",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
      }}
      aria-label="Bottom navigation"
    >
      <div className="flex">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5"
              aria-current={active ? "page" : undefined}
            >
              {item.icon(active)}
              <span
                className="text-[10px] font-semibold"
                style={{ color: active ? "#D7242A" : "#9A9A9A" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

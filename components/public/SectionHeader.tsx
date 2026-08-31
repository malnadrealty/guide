import Link from "next/link";

interface SectionHeaderProps {
  eyebrow: string;
  heading: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export function SectionHeader({ eyebrow, heading, viewAllHref, viewAllLabel = "View all" }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <p className="text-xs font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "#D7242A" }}>
          {eyebrow}
        </p>
        <h2 className="text-2xl font-bold text-black">{heading}</h2>
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-sm font-semibold transition-colors flex-shrink-0 ml-4"
          style={{ color: "#D7242A" }}
        >
          {viewAllLabel}
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="m9 18 6-6-6-6" strokeLinecap="round" />
          </svg>
        </Link>
      )}
    </div>
  );
}

import Link from "next/link";

interface SectionHeaderProps {
  eyebrow: string;
  heading: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  serif?: boolean;
}

export function SectionHeader({
  eyebrow,
  heading,
  viewAllHref,
  viewAllLabel = "View all",
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <p
          className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-2.5"
          style={{ color: "#D7242A" }}
        >
          {eyebrow}
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-[#0F0F0F] leading-tight">
          {heading}
        </h2>
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="flex items-center gap-1.5 text-sm font-semibold flex-shrink-0 ml-6 group transition-colors"
          style={{ color: "#D7242A" }}
        >
          {viewAllLabel}
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            className="group-hover:translate-x-0.5 transition-transform duration-200"
          >
            <path d="m9 18 6-6-6-6" strokeLinecap="round" />
          </svg>
        </Link>
      )}
    </div>
  );
}

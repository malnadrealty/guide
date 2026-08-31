import Image from "next/image";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function CTASection({
  title = "Looking for a property?",
  subtitle = "Explore verified properties on Malnad Realty.",
  ctaLabel = "Visit Malnad Realty",
  ctaHref = "https://malnadrealty.com",
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #D7242A 0%, transparent 60%)" }}
        aria-hidden="true"
      />
      <div className="relative max-w-6xl mx-auto px-4 py-14 md:py-20">
        <div className="max-w-xl">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">
            Malnad Realty
          </p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {title.split("Malnad Realty").map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>{part}<span style={{ color: "#D7242A" }}>Malnad Realty</span></span>
              ) : part
            )}
          </h2>
          <p className="text-gray-300 text-lg mb-8">{subtitle}</p>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-black transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            {ctaLabel}
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="m9 18 6-6-6-6" strokeLinecap="round" />
            </svg>
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-white/10">
          {[
            { icon: "✓", label: "Verified Listings", desc: "100% verified properties" },
            { icon: "📍", label: "Local Insights", desc: "Expert guides & real knowledge" },
            { icon: "🛡", label: "Trusted Information", desc: "Well researched & updated" },
            { icon: "👥", label: "For Everyone", desc: "Buyers, sellers & investors" },
          ].map((b) => (
            <div key={b.label} className="flex items-start gap-3">
              <span className="text-xl" aria-hidden="true">{b.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{b.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

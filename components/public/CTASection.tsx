import Image from "next/image";

interface CTASectionProps {
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  ctaLabel?: string;
  ctaHref?: string;
  bgImage?: string;
}

const BADGES = [
  {
    label: "Verified Listings",
    desc: "100% verified properties on Malnad Realty",
    icon: (
      <svg width="18" height="18" fill="none" stroke="#D7242A" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="9 12 11 14 15 10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Local Insights",
    desc: "Expert guides & real local knowledge",
    icon: (
      <svg width="18" height="18" fill="none" stroke="#D7242A" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: "Trusted Information",
    desc: "Well researched & regularly updated",
    icon: (
      <svg width="18" height="18" fill="none" stroke="#D7242A" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "For Everyone",
    desc: "Buyers, sellers, investors & homeowners",
    icon: (
      <svg width="18" height="18" fill="none" stroke="#D7242A" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function CTASection({
  eyebrow = "Looking for a property?",
  title = "Explore verified properties on",
  titleAccent = "Malnad Realty",
  ctaLabel = "Visit Malnad Realty",
  ctaHref = "https://malnadrealty.com",
  bgImage = "",
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      {/* Background */}
      {bgImage ? (
        <div className="absolute inset-0">
          <Image src={bgImage} alt="" fill className="object-cover opacity-40" sizes="100vw" priority={false} />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(0,0,0,0.95) 45%, rgba(0,0,0,0.4) 100%)" }}
          />
        </div>
      ) : (
        <div
          className="absolute inset-0 opacity-15"
          style={{ backgroundImage: "radial-gradient(circle at 75% 50%, #D7242A, transparent 60%)" }}
          aria-hidden="true"
        />
      )}

      <div className="relative max-w-6xl mx-auto px-4 py-14 md:py-20">
        <div className="max-w-xl">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-gray-400 mb-4">{eyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-7">
            {title}{" "}
            <span style={{ color: "#D7242A" }}>{titleAccent}</span>
          </h2>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-black bg-white hover:bg-gray-100 transition-colors"
          >
            {ctaLabel}
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="m9 18 6-6-6-6" strokeLinecap="round" />
            </svg>
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-5 pt-10 border-t border-white/10">
          {BADGES.map((b) => (
            <div key={b.label} className="flex items-start gap-3">
              <div
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "rgba(215,36,42,0.15)" }}
              >
                {b.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{b.label}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

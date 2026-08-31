import Image from "next/image";

interface CTASectionProps {
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  ctaLabel?: string;
  ctaHref?: string;
  bgImage?: string;
}

const TRUST_ITEMS = [
  {
    label: "Verified Listings",
    desc: "100% verified properties",
    icon: (
      <svg width="20" height="20" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="9 12 11 14 15 10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Local Knowledge",
    desc: "Expert regional insights",
    icon: (
      <svg width="20" height="20" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: "Trusted Research",
    desc: "Regularly updated guides",
    icon: (
      <svg width="20" height="20" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "For Everyone",
    desc: "Buyers, sellers & investors",
    icon: (
      <svg width="20" height="20" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
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
    <section className="relative overflow-hidden" style={{ backgroundColor: "#0A0A0A" }}>
      {/* Background */}
      {bgImage ? (
        <div className="absolute inset-0">
          <Image
            src={bgImage}
            alt=""
            fill
            className="object-cover opacity-30"
            sizes="100vw"
            priority={false}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(10,10,10,0.97) 30%, rgba(10,10,10,0.70) 100%)",
            }}
          />
        </div>
      ) : (
        <>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 80% 40%, #D7242A, transparent 55%)",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 20% 80%, #C9A84C, transparent 50%)",
            }}
            aria-hidden="true"
          />
        </>
      )}

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#8A8A8A] mb-5">
            {eyebrow}
          </p>
          <h2
            className="text-3xl md:text-5xl font-bold leading-tight mb-8 text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}{" "}
            <span style={{ color: "#D7242A" }}>{titleAccent}</span>
          </h2>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl font-semibold text-[#0A0A0A] bg-white hover:bg-[#F8F6F3] transition-all duration-200 text-[15px] group"
            style={{ boxShadow: "0 4px 14px rgba(255,255,255,0.15)" }}
          >
            {ctaLabel}
            <svg
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              className="group-hover:translate-x-0.5 transition-transform duration-200"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>

        {/* Trust strip */}
        <div className="mt-14 pt-10 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="flex items-start gap-3.5">
              <div
                className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "rgba(215,36,42,0.20)" }}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white leading-snug">{item.label}</p>
                <p className="text-[12px] text-[#6A6A6A] mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

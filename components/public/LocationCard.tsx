import Link from "next/link";
import Image from "next/image";

interface LocationCardProps {
  location: {
    name: string;
    slug: string;
    district?: string | null;
    shortDescription?: string | null;
    heroImage?: string | null;
  };
  variant?: "default" | "compact";
}

export function LocationCard({ location, variant = "default" }: LocationCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/locations/${location.slug}`}
        className="group flex-shrink-0 w-40 flex flex-col rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
      >
        <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
          {location.heroImage ? (
            <Image
              src={location.heroImage}
              alt={location.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="160px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
          )}
        </div>
        <div className="p-2.5">
          <p className="text-sm font-bold text-black leading-none">{location.name}</p>
          {location.district && (
            <p className="text-[11px] text-gray-400 mt-0.5">{location.district}</p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/locations/${location.slug}`}
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
        {location.heroImage ? (
          <Image
            src={location.heroImage}
            alt={location.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 300px"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <svg width="36" height="36" fill="none" stroke="#D7D7D7" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold text-black group-hover:text-[#D7242A] transition-colors">{location.name}</h3>
        {location.district && (
          <p className="text-xs text-gray-400 mt-0.5">{location.district}</p>
        )}
        {location.shortDescription && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">{location.shortDescription}</p>
        )}
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#D7242A]">
          Explore
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="m9 18 6-6-6-6" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

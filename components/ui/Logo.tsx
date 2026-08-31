import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  line1?: string;
  line2?: string;
  imageUrl?: string;
}

export function Logo({ className = "", line1, line2, imageUrl }: LogoProps) {
  const text1 = line1 || "MALNAD REALTY";
  const text2 = line2 || "GUIDE";

  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`} aria-label="Malnad Realty Guide — Home">
      <div className="flex-shrink-0" style={{ width: 36, height: 36 }}>
        {imageUrl ? (
          <Image src={imageUrl} alt={text1} width={36} height={36} className="rounded-md object-contain" unoptimized />
        ) : (
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="36" height="36" rx="6" fill="#D7242A" />
            <path d="M8 26V14l10-7 10 7v12" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 26v-7h8v7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 14l10-7 10 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[13px] font-bold text-black" style={{ letterSpacing: "0.06em" }}>
          {text1}
        </span>
        <span className="text-[11px] font-semibold" style={{ color: "#8F8F8F", letterSpacing: "0.1em" }}>
          {text2}
        </span>
      </div>
    </Link>
  );
}

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  line1?: string;
  line2?: string;
  imageUrl?: string;
  darkImageUrl?: string;
  variant?: "light" | "dark";
}

export function Logo({ className = "", line1, line2, imageUrl, darkImageUrl, variant = "dark" }: LogoProps) {
  const text1 = line1 || "MALNAD REALTY";
  const text2 = line2 || "GUIDE";
  const onDark = variant === "light";
  const src = onDark ? (imageUrl || darkImageUrl) : (darkImageUrl || imageUrl);

  return (
    <Link href="/" className={`flex items-center ${className}`} aria-label="Malnad Realty Guide — Home">
      {src ? (
        // Full logo image — natural width, fixed height. No text alongside.
        <div style={{ position: "relative", height: 36, width: "auto", minWidth: 80, maxWidth: 200 }}>
          <Image
            src={src}
            alt={text1}
            height={36}
            width={200}
            className="object-contain object-left"
            style={{ width: "auto", height: 36 }}
            unoptimized
          />
        </div>
      ) : (
        // Fallback: SVG icon + wordmark text
        <div className="flex items-center gap-2.5">
          <div className="flex-shrink-0" style={{ width: 36, height: 36 }}>
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="36" height="36" rx="6" fill="#D7242A" />
              <path d="M8 26V14l10-7 10 7v12" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 26v-7h8v7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 14l10-7 10 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="text-[13px] font-bold"
              style={{ letterSpacing: "0.06em", color: onDark ? "#ffffff" : "#000000" }}
            >
              {text1}
            </span>
            <span
              className="text-[11px] font-semibold"
              style={{ letterSpacing: "0.1em", color: onDark ? "rgba(255,255,255,0.65)" : "#8F8F8F" }}
            >
              {text2}
            </span>
          </div>
        </div>
      )}
    </Link>
  );
}

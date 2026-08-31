"use client";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`} aria-label="Malnad Realty Guide — Home">
      {/* Icon mark */}
      <div className="flex-shrink-0" style={{ width: 36, height: 36 }}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="36" height="36" rx="6" fill="#D7242A" />
          <path d="M8 26V14l10-7 10 7v12" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 26v-7h8v7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 14l10-7 10 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span className="text-[13px] font-bold tracking-[0.08em] uppercase text-black" style={{ letterSpacing: "0.06em" }}>
          MALNAD REALTY
        </span>
        <span className="text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: "#8F8F8F", letterSpacing: "0.1em" }}>
          GUIDE
        </span>
      </div>
    </Link>
  );
}

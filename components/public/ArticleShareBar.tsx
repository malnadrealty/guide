"use client";
import { useState } from "react";

interface Props {
  title: string;
  url: string;
  compact?: boolean;
}

export function ArticleShareBar({ title, url, compact = false }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback: select */
    }
  };

  const waUrl = `https://wa.me/?text=${encodeURIComponent(title + "\n" + url)}`;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#25D366] text-white text-[13px] font-semibold hover:bg-[#1FB85A] transition-colors"
        >
          <WhatsAppIcon />
          Share
        </a>
        <button
          onClick={copy}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#E8E4DF] text-[13px] font-semibold text-[#0F0F0F] hover:border-[#D7242A]/30 hover:bg-[#FEF2F2] transition-all"
        >
          {copied ? <CheckIcon /> : <LinkIcon />}
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-bold uppercase tracking-widest text-[#ABABAB]">Share</p>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-[13px] font-semibold hover:bg-[#1FB85A] transition-colors"
      >
        <WhatsAppIcon />
        WhatsApp
      </a>
      <button
        onClick={copy}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-[#E8E4DF] text-[13px] font-semibold text-[#0F0F0F] hover:border-[#D7242A]/30 hover:bg-[#FEF2F2] transition-all"
      >
        {copied ? <CheckIcon /> : <LinkIcon />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.122 1.521 5.858L.057 23.57a.75.75 0 0 0 .918.9l5.845-1.488A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.71 9.71 0 0 1-4.89-1.318l-.35-.207-3.616.921.949-3.505-.228-.362A9.744 9.744 0 0 1 2.25 12C2.25 6.61 6.61 2.25 12 2.25S21.75 6.61 21.75 12 17.39 21.75 12 21.75z"/>
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="#22C55E" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

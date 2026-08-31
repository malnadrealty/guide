"use client";

export function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8E4DF] text-[13px] font-semibold text-[#8A8A8A] hover:border-[#D7242A]/30 hover:text-[#D7242A] transition-all cursor-pointer"
      aria-label="Scroll back to top"
    >
      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m18 15-6-6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Back to top
    </button>
  );
}

"use client";

// Clicking the hero search bar opens the SearchModal (via custom event listened to in Header).
// This gives live results + consistent UX with the header search button.
export function SearchBar() {
  const openSearch = () => {
    window.dispatchEvent(new CustomEvent("open-search"));
  };

  return (
    <button
      type="button"
      onClick={openSearch}
      className="flex items-center w-full bg-white rounded-xl overflow-hidden max-w-xl cursor-text text-left"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
      aria-label="Search guides"
    >
      <div className="pl-3.5 text-gray-400 flex-shrink-0">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
      </div>
      <span className="flex-1 px-2.5 py-3 text-sm text-gray-400">
        Search guides, locations, topics…
      </span>
      <span
        className="flex-shrink-0 px-4 py-2.5 text-sm font-semibold text-white transition-colors m-1 rounded-lg"
        style={{ backgroundColor: "#D7242A" }}
      >
        Search
      </span>
    </button>
  );
}

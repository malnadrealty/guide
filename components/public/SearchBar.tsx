"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/guides?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center bg-white rounded-xl overflow-hidden max-w-xl shadow-lg" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
      <div className="pl-4 text-gray-400 flex-shrink-0">
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
      </div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search locations, topics or guides..."
        className="flex-1 px-3 py-4 text-base text-black outline-none bg-transparent placeholder:text-gray-400"
        autoComplete="off"
      />
      <button
        type="submit"
        className="flex-shrink-0 px-6 py-4 text-sm font-bold text-white transition-colors m-1 rounded-lg"
        style={{ backgroundColor: "#D7242A" }}
      >
        Search
      </button>
    </form>
  );
}

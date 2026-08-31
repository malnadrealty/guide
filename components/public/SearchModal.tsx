"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  type: "article" | "location";
  category?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  popularSearches?: string;
}

const DEFAULT_POPULAR = "Property in Sagara,Land in Sirsi,Construction Cost,Stamp Duty,Home Loan";

export function SearchModal({ open, onClose, popularSearches }: Props) {
  const chips = (popularSearches || DEFAULT_POPULAR)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/guides?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center pt-[10vh] px-4"
      style={{ pointerEvents: open ? "auto" : "none" }}
      aria-hidden={!open}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        style={{ opacity: open ? 1 : 0 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-200"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.97)",
        }}
      >
        <form onSubmit={handleSubmit} className="flex items-center border-b border-gray-100 focus-within:border-[#D7242A]/30 transition-colors">
          <div className="pl-4 text-[#ABABAB]">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search locations, topics, guides..."
            className="flex-1 px-4 py-4 text-base bg-transparent"
            style={{ outline: "none" }}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onClose}
            className="pr-4 text-gray-400 hover:text-gray-700 text-sm font-medium"
          >
            Cancel
          </button>
        </form>

        {/* Results */}
        {loading && (
          <div className="p-4 text-sm text-center text-gray-400">Searching...</div>
        )}
        {!loading && results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto">
            {results.map((r) => (
              <li key={r.id}>
                <Link
                  href={r.type === "location" ? `/locations/${r.slug}` : `/guides/${r.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: r.type === "location" ? "#fff0f0" : "#F5F5F5", color: r.type === "location" ? "#D7242A" : "#8F8F8F" }}
                  >
                    {r.type === "location" ? "Location" : r.category || "Guide"}
                  </span>
                  <span className="text-sm font-medium text-black">{r.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {!loading && query.length >= 2 && results.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-400">
            No results for &quot;{query}&quot;
          </div>
        )}
        {!query && (
          <div className="p-4">
            <p className="text-xs text-gray-400 mb-3 font-medium">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {chips.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="text-sm px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#D7242A] hover:text-[#D7242A] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

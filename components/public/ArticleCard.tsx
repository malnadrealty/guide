import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  property: "#1D4ED8",
  land: "#15803D",
  construction: "#0369A1",
  legal: "#374151",
  finance: "#6D28D9",
  living: "#7C3AED",
  location: "#B45309",
};

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    featuredImage?: string | null;
    publishedAt?: Date | null;
    content?: string | null;
    category?: { name: string; slug: string } | null;
    location?: { name: string; slug: string } | null;
  };
  variant?: "default" | "compact" | "featured";
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const categoryColor = article.category
    ? CATEGORY_COLORS[article.category.slug] || "#D7242A"
    : "#D7242A";

  if (variant === "compact") {
    return (
      <Link
        href={`/guides/${article.slug}`}
        className="flex gap-4 group py-4 border-b border-[#F0EDE9] last:border-0"
      >
        {article.featuredImage && (
          <div className="flex-shrink-0 w-[72px] h-[72px] rounded-lg overflow-hidden bg-[#F8F6F3]">
            <Image
              src={article.featuredImage}
              alt={article.title}
              width={72}
              height={72}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {article.category && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: categoryColor }}
            >
              {article.category.name}
            </span>
          )}
          <h3
            className="text-sm font-semibold text-[#0F0F0F] leading-snug line-clamp-2 group-hover:text-[#D7242A] transition-colors mt-0.5"
          >
            {article.title}
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/guides/${article.slug}`}
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-[#E8E4DF] hover:border-[#D7D0C8] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="aspect-[3/2] overflow-hidden bg-[#F8F6F3] relative">
        {article.featuredImage ? (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 420px"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#F2EFEB] to-[#E8E4DF] flex items-center justify-center">
            <svg width="32" height="32" fill="none" stroke="#C8C4BE" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        {article.category && (
          <span
            className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md text-white"
            style={{ backgroundColor: categoryColor }}
          >
            {article.category.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {article.location && (
          <p className="text-[11px] font-medium text-[#8A8A8A] mb-1.5 flex items-center gap-1">
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {article.location.name}
          </p>
        )}

        <h3
          className="text-[17px] font-bold text-[#0F0F0F] leading-snug mb-2 line-clamp-2 group-hover:text-[#D7242A] transition-colors"
        >
          {article.title}
        </h3>

        {article.excerpt && (
          <p className="text-sm text-[#6A6A6A] line-clamp-2 mb-4 leading-relaxed">{article.excerpt}</p>
        )}

        <div className="mt-auto flex items-center justify-between text-[11px] text-[#9A9A9A] pt-3 border-t border-[#F0EDE9]">
          <div className="flex items-center gap-3">
            {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
          </div>
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="#D7242A"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
          >
            <path d="m9 18 6-6-6-6" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

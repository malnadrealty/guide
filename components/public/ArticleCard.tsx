import Link from "next/link";
import Image from "next/image";
import { formatDate, readingTime } from "@/lib/utils";

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
  const mins = article.content ? readingTime(article.content) : null;

  if (variant === "compact") {
    return (
      <Link
        href={`/guides/${article.slug}`}
        className="flex gap-3 group py-3 border-b border-gray-100 last:border-0"
      >
        {article.featuredImage && (
          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={article.featuredImage}
              alt={article.title}
              width={64}
              height={64}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {article.category && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D7242A]">
              {article.category.name}
            </span>
          )}
          <h3 className="text-sm font-semibold text-black leading-snug line-clamp-2 group-hover:text-[#D7242A] transition-colors">
            {article.title}
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/guides/${article.slug}`}
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      {/* Image */}
      <div className="aspect-[16/9] overflow-hidden bg-gray-100 relative">
        {article.featuredImage ? (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <svg width="40" height="40" fill="none" stroke="#D7D7D7" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        {/* Category badge */}
        {article.category && (
          <span
            className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white"
            style={{ backgroundColor: "#D7242A" }}
          >
            {article.category.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[15px] font-bold text-black leading-snug mb-1.5 line-clamp-2 group-hover:text-[#D7242A] transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">{article.excerpt}</p>
        )}
        <div className="mt-auto flex items-center gap-3 text-xs text-gray-400">
          {mins && (
            <span className="flex items-center gap-1">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {mins} min read
            </span>
          )}
          {article.publishedAt && (
            <span>{formatDate(article.publishedAt)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ArticleCard } from "@/components/public/ArticleCard";
import { CTASection } from "@/components/public/CTASection";
import { formatDate, readingTime } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await db.article.findUnique({
    where: { slug, status: "published" },
    select: { title: true, seoTitle: true, metaDescription: true, excerpt: true, ogImage: true, featuredImage: true, canonicalUrl: true },
  });
  if (!article) return {};
  return {
    title: article.seoTitle || article.title,
    description: article.metaDescription || article.excerpt || undefined,
    openGraph: {
      images: [{ url: article.ogImage || article.featuredImage || "/og-default.jpg" }],
    },
    alternates: { canonical: article.canonicalUrl || `/guides/${slug}` },
  };
}

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await db.article.findUnique({
    where: { slug, status: "published" },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true, slug: true } },
      location: { select: { name: true, slug: true } },
    },
  });

  if (!article) notFound();

  const relatedArticles = await db.article.findMany({
    where: {
      status: "published",
      id: { not: article.id },
      OR: [
        { categoryId: article.categoryId || undefined },
        { locationId: article.locationId || undefined },
      ],
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    select: {
      id: true, title: true, slug: true, excerpt: true, featuredImage: true,
      publishedAt: true, content: true,
      category: { select: { name: true, slug: true } },
      location: { select: { name: true, slug: true } },
    },
  });

  const mins = article.content ? readingTime(article.content) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.seoTitle || article.title,
    description: article.metaDescription || article.excerpt,
    image: article.featuredImage || article.ogImage,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt?.toISOString(),
    author: { "@type": "Organization", name: article.author.name || "Malnad Realty" },
    publisher: { "@type": "Organization", name: "Malnad Realty", url: "https://malnadrealty.com" },
    url: `https://guide.malnadrealty.com/guides/${slug}`,
  };

  const crumbs = [
    { label: "Guides", href: "/guides" },
    ...(article.category ? [{ label: article.category.name, href: `/guides?category=${article.category.slug}` }] : []),
    { label: article.title },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs crumbs={crumbs} />

        {/* Header */}
        <div className="mt-6 mb-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {article.category && (
              <Link
                href={`/guides?category=${article.category.slug}`}
                className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: "#D7242A" }}
              >
                {article.category.name}
              </Link>
            )}
            {article.location && (
              <Link
                href={`/locations/${article.location.slug}`}
                className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-gray-200 text-gray-600 hover:border-[#D7242A] hover:text-[#D7242A] transition-colors"
              >
                {article.location.name}
              </Link>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-black leading-tight mb-4">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg text-gray-500 leading-relaxed mb-5">{article.excerpt}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-400 pb-6 border-b border-gray-100">
            {article.author.name && <span className="font-medium text-gray-600">{article.author.name}</span>}
            {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
            {mins && (
              <span className="flex items-center gap-1">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                {mins} min read
              </span>
            )}
            {article.updatedAt && article.publishedAt && article.updatedAt > article.publishedAt && (
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">Updated {formatDate(article.updatedAt)}</span>
            )}
          </div>
        </div>

        {/* Featured image */}
        {article.featuredImage && (
          <div className="mb-8 rounded-2xl overflow-hidden aspect-[16/9] relative">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        {/* Content */}
        {article.content && (
          <div
            className="tiptap-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 pt-10 border-t border-gray-100">
            <h2 className="text-xl font-bold text-black mb-6">Related guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}
      </div>

      <CTASection />
    </>
  );
}

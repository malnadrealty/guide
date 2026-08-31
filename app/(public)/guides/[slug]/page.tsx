import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ArticleCard } from "@/components/public/ArticleCard";
import { CTASection } from "@/components/public/CTASection";
import { ReadingProgress } from "@/components/public/ReadingProgress";
import { ArticleShareBar } from "@/components/public/ArticleShareBar";
import { BackToTop } from "@/components/public/BackToTop";
import { formatDate } from "@/lib/utils";

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

export const revalidate = 300;

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

  const shareUrl = `https://guide.malnadrealty.com/guides/${slug}`;
  const authorInitial = (article.author.name || "M")[0].toUpperCase();
  const isUpdated = article.updatedAt && article.publishedAt && article.updatedAt > article.publishedAt;

  return (
    <>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── ARTICLE HEADER ─────────────────────────────────────────── */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-5 md:px-8 pt-6 pb-0">
          <Breadcrumbs crumbs={crumbs} />

          {/* Tags */}
          <div className="flex items-center gap-2 mt-6 flex-wrap">
            {article.category && (
              <Link
                href={`/guides?category=${article.category.slug}`}
                className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: "#D7242A" }}
              >
                {article.category.name}
              </Link>
            )}
            {article.location && (
              <Link
                href={`/locations/${article.location.slug}`}
                className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-[#E8E4DF] text-[#555] hover:border-[#D7242A]/40 hover:text-[#D7242A] transition-colors"
              >
                {article.location.name}
              </Link>
            )}
          </div>

          {/* Title */}
          <h1 className="mt-4 text-[1.85rem] md:text-[2.6rem] lg:text-[3rem] font-extrabold text-[#0F0F0F] leading-[1.1] md:leading-[1.08] text-balance">
            {article.title}
          </h1>

          {/* Excerpt / Lead */}
          {article.excerpt && (
            <p className="mt-4 text-[1.05rem] md:text-[1.15rem] text-[#555] leading-relaxed font-normal max-w-[680px]">
              {article.excerpt}
            </p>
          )}

          {/* Author + Meta */}
          <div className="mt-7 flex items-center gap-3 pb-7 border-b border-[#F0EDE8]">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
              style={{ backgroundColor: "#D7242A" }}
              aria-hidden="true"
            >
              {authorInitial}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#0F0F0F] leading-none mb-1">
                {article.author.name || "Malnad Realty"}
              </p>
              <div className="flex items-center gap-2 text-[12px] text-[#9A9A9A] flex-wrap">
                {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
                {isUpdated && (
                  <>
                    <span>·</span>
                    <span className="bg-[#F0EDE8] text-[#666] px-2 py-0.5 rounded-full text-[11px] font-medium">
                      Updated {formatDate(article.updatedAt!)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Desktop inline share */}
            <div className="ml-auto hidden sm:block">
              <ArticleShareBar title={article.title} url={shareUrl} compact />
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURED IMAGE ─────────────────────────────────────────── */}
      {article.featuredImage && (
        <div className="max-w-5xl mx-auto px-0 sm:px-5 md:px-8 mt-7 mb-2">
          <div
            className="sm:rounded-2xl overflow-hidden relative bg-[#F0EDE8]"
            style={{ aspectRatio: "16/9" }}
          >
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
            />
          </div>
        </div>
      )}

      {/* ── ARTICLE BODY ───────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-10 md:py-14">
        <div className="lg:grid lg:grid-cols-[1fr_196px] lg:gap-14 lg:items-start">

          {/* Content */}
          <article className="min-w-0">
            {article.content ? (
              <div
                className="tiptap-content"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <p className="text-[#9A9A9A] italic">No content yet.</p>
            )}

            {/* Mobile share — below content */}
            <div className="mt-10 pt-8 border-t border-[#F0EDE8] sm:hidden">
              <ArticleShareBar title={article.title} url={shareUrl} />
            </div>

            {/* Tablet share */}
            <div className="mt-10 pt-8 border-t border-[#F0EDE8] hidden sm:flex lg:hidden">
              <ArticleShareBar title={article.title} url={shareUrl} compact />
            </div>
          </article>

          {/* Desktop sticky sidebar */}
          <aside className="hidden lg:block sticky top-24 pt-1">
            <ArticleShareBar title={article.title} url={shareUrl} />

            <BackToTop />
          </aside>
        </div>
      </div>

      {/* ── RELATED ARTICLES ───────────────────────────────────────── */}
      {relatedArticles.length > 0 && (
        <section className="border-t border-[#F0EDE8] bg-[#F8F6F3] py-14 md:py-16">
          <div className="max-w-4xl mx-auto px-5 md:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#0F0F0F]">Continue reading</h2>
              <Link
                href="/guides"
                className="text-[13px] font-semibold text-[#D7242A] hover:underline underline-offset-2"
              >
                All guides →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}

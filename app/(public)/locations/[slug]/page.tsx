import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ArticleCard } from "@/components/public/ArticleCard";
import { CTASection } from "@/components/public/CTASection";
import { safeJsonLd } from "@/lib/sanitize";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loc = await db.location.findUnique({ where: { slug, status: "published" } });
  if (!loc) return {};
  return {
    title: loc.seoTitle || `${loc.name} — Property & Land Guide`,
    description: loc.metaDescription || loc.shortDescription || undefined,
    openGraph: loc.ogImage ? { images: [{ url: loc.ogImage }] } : undefined,
    alternates: { canonical: `/locations/${slug}` },
  };
}

export const revalidate = 300;

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const [loc, relatedArticles] = await Promise.all([
    db.location.findUnique({ where: { slug, status: "published" } }),
    db.article.findMany({
      where: { status: "published", location: { slug } },
      orderBy: { publishedAt: "desc" },
      take: 6,
      select: {
        id: true, title: true, slug: true, excerpt: true, featuredImage: true,
        publishedAt: true, content: true,
        category: { select: { name: true, slug: true } },
        location: { select: { name: true, slug: true } },
      },
    }),
  ]);

  if (!loc) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    name: loc.seoTitle || `${loc.name} — Property & Land Guide`,
    description: loc.metaDescription || loc.shortDescription,
    url: `https://guide.malnadrealty.com/locations/${slug}`,
    publisher: { "@type": "Organization", name: "Malnad Realty", url: "https://malnadrealty.com" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      {/* Hero */}
      <div className="relative h-64 md:h-80 bg-black overflow-hidden">
        {loc.heroImage ? (
          <Image src={loc.heroImage} alt={loc.name} fill className="object-cover opacity-60" priority sizes="100vw" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
        )}
        <div className="absolute inset-0 flex flex-col justify-end p-6 max-w-6xl mx-auto w-full left-0 right-0">
          <div className="relative">
            <Breadcrumbs crumbs={[{ label: "Locations", href: "/locations" }, { label: loc.name }]} />
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-3">{loc.name}</h1>
            {loc.district && (
              <p className="text-gray-300 mt-1 font-medium">
                {loc.taluk ? `${loc.taluk}, ` : ""}{loc.district}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Short description */}
        {loc.shortDescription && (
          <p className="text-lg text-gray-600 leading-relaxed mb-8 pb-8 border-b border-gray-100">
            {loc.shortDescription}
          </p>
        )}

        {/* Long description */}
        {loc.description && (
          <div
            className="tiptap-content prose-sm max-w-none mb-10"
            dangerouslySetInnerHTML={{ __html: loc.description }}
          />
        )}

        {/* Gallery */}
        {loc.gallery && loc.gallery.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {loc.gallery.map((img, i) => (
                <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 relative">
                  <Image src={img} alt={`${loc.name} ${i + 1}`} fill className="object-cover" sizes="300px" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related guides */}
        {relatedArticles.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-5">
              Guides for {loc.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* No guides state */}
        {relatedArticles.length === 0 && (
          <div className="mb-10 p-6 bg-gray-50 rounded-xl text-center">
            <p className="text-gray-500 text-sm">Guides for {loc.name} coming soon.</p>
            <Link href="/guides" className="mt-3 inline-block text-sm font-semibold text-[#D7242A]">
              Browse all guides →
            </Link>
          </div>
        )}
      </div>

      <CTASection />
    </>
  );
}

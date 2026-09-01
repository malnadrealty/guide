import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCachedLocationBySlug } from "@/lib/db-cache";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ArticleCard } from "@/components/public/ArticleCard";
import { CTASection } from "@/components/public/CTASection";
import { safeJsonLd } from "@/lib/sanitize";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loc = await getCachedLocationBySlug(slug);
  if (!loc) return {};
  const title = loc.seoTitle || `${loc.name} — Property & Land Guide | Malnad Realty`;
  const description = loc.metaDescription || loc.shortDescription || `Property, land and real estate guides for ${loc.name}.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(loc.ogImage ? { images: [{ url: loc.ogImage, width: 1200, height: 630, alt: loc.name }] } : {}),
    },
    alternates: { canonical: `/locations/${slug}` },
  };
}

export const revalidate = 300;

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  // getCachedLocationBySlug includes articles — one query, one cache entry
  const loc = await getCachedLocationBySlug(slug);
  const relatedArticles = loc?.articles ?? [];

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
      <div className="relative h-64 md:h-80 bg-[#0A0A0A] overflow-hidden">
        {loc.heroImage && (
          <Image src={loc.heroImage} alt={loc.name} fill className="object-cover opacity-55" priority sizes="100vw" />
        )}
        {/* Gradient overlay to ensure text is always readable over any image */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)" }}
        />
        <div className="absolute inset-0 flex flex-col justify-end px-5 pb-6 md:px-8 max-w-6xl mx-auto w-full left-0 right-0">
          <Breadcrumbs crumbs={[{ label: "Locations", href: "/locations" }, { label: loc.name }]} dark />
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-3">{loc.name}</h1>
          {loc.district && (
            <p className="text-white/70 mt-1 font-medium">
              {loc.taluk ? `${loc.taluk}, ` : ""}{loc.district}
            </p>
          )}
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

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ArticleCard } from "@/components/public/ArticleCard";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";

const VALID_CATEGORIES = ["property", "land", "construction", "legal", "finance"];

const CATEGORY_META: Record<string, { eyebrow: string; heading: string; desc: string }> = {
  property: {
    eyebrow: "Property",
    heading: "Property Guides",
    desc: "Guides on buying, selling and renting residential and commercial property across Shivamogga and Uttara Kannada.",
  },
  land: {
    eyebrow: "Land",
    heading: "Land Buying Guides",
    desc: "Agricultural land, farmland, plantation land — everything about buying and selling land in the Malnad and Uttara Kannada region.",
  },
  construction: {
    eyebrow: "Construction",
    heading: "Construction Guides",
    desc: "House construction costs, planning, building process and materials — practical guides for building in Shivamogga and Uttara Kannada.",
  },
  legal: {
    eyebrow: "Legal",
    heading: "Legal & Documents",
    desc: "RTC, Pahani, Khata, EC, sale deed, registration, stamp duty — understand the legal side of property and land transactions.",
  },
  finance: {
    eyebrow: "Finance",
    heading: "Finance & Loans",
    desc: "Home loans, land loans, stamp duty, EMI and buying costs — financial guides for property buyers in Karnataka.",
  },
};

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!VALID_CATEGORIES.includes(category)) return {};
  const meta = CATEGORY_META[category];
  return {
    title: `${meta.heading} — Malnad Realty Guide`,
    description: meta.desc,
    alternates: { canonical: `/${category}` },
  };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!VALID_CATEGORIES.includes(category)) notFound();

  const meta = CATEGORY_META[category];

  const articles = await db.article.findMany({
    where: {
      status: "published",
      category: { slug: category },
    },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true, title: true, slug: true, excerpt: true, featuredImage: true,
      publishedAt: true, content: true,
      category: { select: { name: true, slug: true } },
      location: { select: { name: true, slug: true } },
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs crumbs={[{ label: meta.eyebrow }]} />

      <div className="mt-6 mb-10">
        <p className="text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "#D7242A" }}>{meta.eyebrow}</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-black">{meta.heading}</h1>
        <p className="text-gray-500 mt-3 max-w-2xl">{meta.desc}</p>
      </div>

      {articles.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          <p className="text-lg font-semibold mb-2">Coming soon</p>
          <p className="text-sm">Guides for this topic are being prepared.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

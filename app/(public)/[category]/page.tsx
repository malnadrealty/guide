import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCachedArticlesByCategory } from "@/lib/db-cache";
import { ArticleCard } from "@/components/public/ArticleCard";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";

const VALID_CATEGORIES = ["property", "land", "construction", "legal", "finance"];

const CATEGORY_META: Record<string, { eyebrow: string; heading: string; desc: string }> = {
  property: {
    eyebrow: "Property",
    heading: "Property Guides",
    desc: "Guides on buying, selling and renting residential and commercial property across Shimoga and Uttarakannada District.",
  },
  land: {
    eyebrow: "Land",
    heading: "Land Buying Guides",
    desc: "Agricultural land, farmland and plantation land. Buying and selling guides for the Malnad and Uttarakannada District region.",
  },
  construction: {
    eyebrow: "Construction",
    heading: "Construction Guides",
    desc: "House construction costs, planning, process and materials. Practical guides for building in Shimoga and Uttarakannada District.",
  },
  legal: {
    eyebrow: "Legal",
    heading: "Legal & Documents",
    desc: "RTC, Pahani, Khata, EC, sale deed, registration and stamp duty. Guides on the legal side of property and land transactions.",
  },
  finance: {
    eyebrow: "Finance",
    heading: "Finance & Loans",
    desc: "Home loans, land loans, stamp duty, EMI and buying costs. Financial guides for property buyers in Karnataka.",
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

export const revalidate = 300;

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!VALID_CATEGORIES.includes(category)) notFound();

  const meta = CATEGORY_META[category];

  const articles = await getCachedArticlesByCategory(category);

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

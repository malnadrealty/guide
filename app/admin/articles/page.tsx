import { db } from "@/lib/db";
import Link from "next/link";
import { ArticlesTable } from "@/components/admin/ArticlesTable";

export default async function ArticlesPage() {
  const articles = await db.article.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: { select: { name: true } }, location: { select: { name: true } } },
  });

  const published = articles.filter((a) => a.status === "published");
  const drafts = articles.filter((a) => a.status === "draft");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Articles</h1>
          <p className="text-sm text-gray-400 mt-0.5">{published.length} published · {drafts.length} drafts</p>
        </div>
        <Link href="/admin/articles/new" className="px-4 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: "#D7242A" }}>
          + New Article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
          <p className="text-gray-400 mb-4">No articles yet.</p>
          <Link href="/admin/articles/new" className="text-sm font-semibold text-[#D7242A]">Create your first article →</Link>
        </div>
      ) : (
        <ArticlesTable articles={articles} />
      )}
    </div>
  );
}

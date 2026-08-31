import { db } from "@/lib/db";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

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
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="text-left px-5 py-3">Title</th>
                <th className="text-left px-3 py-3 hidden md:table-cell">Category</th>
                <th className="text-left px-3 py-3 hidden md:table-cell">Location</th>
                <th className="text-left px-3 py-3">Status</th>
                <th className="text-left px-3 py-3 hidden md:table-cell">Updated</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/admin/articles/${a.id}`} className="font-medium text-black hover:text-[#D7242A] transition-colors line-clamp-1">
                      {a.title}
                    </Link>
                  </td>
                  <td className="px-3 py-4 text-gray-500 hidden md:table-cell">{a.category?.name || "—"}</td>
                  <td className="px-3 py-4 text-gray-500 hidden md:table-cell">{a.location?.name || "—"}</td>
                  <td className="px-3 py-4">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: a.status === "published" ? "#e6f9f0" : "#F5F5F5", color: a.status === "published" ? "#16a34a" : "#8F8F8F" }}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-gray-400 hidden md:table-cell text-xs">{formatDate(a.updatedAt)}</td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/articles/${a.id}`} className="text-xs font-semibold text-gray-500 hover:text-black">Edit</Link>
                      {a.status === "published" && (
                        <a href={`/guides/${a.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#D7242A]">View</a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

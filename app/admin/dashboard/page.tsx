import { db } from "@/lib/db";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const [totalArticles, publishedArticles, draftArticles, totalLocations, totalCategories, totalMedia, recentArticles] = await Promise.all([
    db.article.count(),
    db.article.count({ where: { status: "published" } }),
    db.article.count({ where: { status: "draft" } }),
    db.location.count(),
    db.category.count(),
    db.media.count(),
    db.article.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, slug: true, status: true, updatedAt: true, category: { select: { name: true } } },
    }),
  ]);

  const stats = [
    { label: "Total Articles", value: totalArticles, sub: `${publishedArticles} published · ${draftArticles} drafts`, href: "/admin/articles" },
    { label: "Locations", value: totalLocations, sub: "Published & draft", href: "/admin/locations" },
    { label: "Categories", value: totalCategories, sub: "Content categories", href: "/admin/categories" },
    { label: "Media", value: totalMedia, sub: "Uploaded images", href: "/admin/media" },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Malnad Realty Guide</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: "#D7242A" }}
        >
          + New Article
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link key={stat.href} href={stat.href} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all group">
            <p className="text-3xl font-extrabold text-black group-hover:text-[#D7242A] transition-colors">{stat.value}</p>
            <p className="text-sm font-semibold text-black mt-1">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-bold text-black">Recent articles</h2>
          <Link href="/admin/articles" className="text-xs font-semibold text-[#D7242A]">View all</Link>
        </div>
        {recentArticles.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400 text-sm">
            No articles yet.{" "}
            <Link href="/admin/articles/new" className="text-[#D7242A] font-medium">Create your first</Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {recentArticles.map((a) => (
              <li key={a.id}>
                <Link href={`/admin/articles/${a.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-black truncate">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.category?.name} · Updated {formatDate(a.updatedAt)}</p>
                  </div>
                  <span
                    className="ml-3 flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: a.status === "published" ? "#e6f9f0" : "#F5F5F5", color: a.status === "published" ? "#16a34a" : "#8F8F8F" }}
                  >
                    {a.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: "/admin/locations/new", label: "Add Location", icon: "📍" },
          { href: "/admin/media", label: "Upload Media", icon: "🖼" },
          { href: "/admin/categories", label: "Manage Categories", icon: "🏷" },
        ].map((action) => (
          <Link key={action.href} href={action.href} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-[#D7242A]/20 transition-all text-sm font-semibold text-black">
            <span className="text-xl">{action.icon}</span>
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

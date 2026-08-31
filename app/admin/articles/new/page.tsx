import { db } from "@/lib/db";
import { ArticleEditor } from "@/components/admin/ArticleEditor";

export default async function NewArticlePage() {
  const [categories, locations] = await Promise.all([
    db.category.findMany({ orderBy: { order: "asc" } }),
    db.location.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="max-w-4xl">
      <ArticleEditor categories={categories} locations={locations} />
    </div>
  );
}

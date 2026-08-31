import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ArticleEditor } from "@/components/admin/ArticleEditor";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const [article, categories, locations] = await Promise.all([
    db.article.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { order: "asc" } }),
    db.location.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!article) notFound();

  return (
    <div className="max-w-4xl">
      <ArticleEditor
        initialData={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          categoryId: article.categoryId || "",
          locationId: article.locationId || "",
          excerpt: article.excerpt || "",
          content: article.content || "",
          featuredImage: article.featuredImage || "",
          seoTitle: article.seoTitle || "",
          metaDescription: article.metaDescription || "",
          ogImage: article.ogImage || "",
          status: article.status,
        }}
        categories={categories}
        locations={locations}
      />
    </div>
  );
}

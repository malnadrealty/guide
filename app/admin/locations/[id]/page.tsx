import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { LocationForm } from "@/components/admin/LocationForm";

interface Props { params: Promise<{ id: string }> }

export default async function EditLocationPage({ params }: Props) {
  const { id } = await params;
  const loc = await db.location.findUnique({ where: { id } });
  if (!loc) notFound();
  return (
    <div className="max-w-4xl">
      <LocationForm initialData={{
        id: loc.id, name: loc.name, slug: loc.slug, district: loc.district || "",
        taluk: loc.taluk || "", shortDescription: loc.shortDescription || "",
        description: loc.description || "", heroImage: loc.heroImage || "",
        seoTitle: loc.seoTitle || "", metaDescription: loc.metaDescription || "",
        status: loc.status, order: loc.order,
      }} />
    </div>
  );
}

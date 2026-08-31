"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { toSlug } from "@/lib/utils";

interface LocationData {
  id?: string;
  name: string;
  slug: string;
  district: string;
  taluk: string;
  shortDescription: string;
  description: string;
  heroImage: string;
  seoTitle: string;
  metaDescription: string;
  status: string;
  order: number;
}

interface Props {
  initialData?: Partial<LocationData>;
}

export function LocationForm({ initialData }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [form, setForm] = useState<LocationData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    district: initialData?.district || "",
    taluk: initialData?.taluk || "",
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",
    heroImage: initialData?.heroImage || "",
    seoTitle: initialData?.seoTitle || "",
    metaDescription: initialData?.metaDescription || "",
    status: initialData?.status || "draft",
    order: initialData?.order || 0,
  });

  const set = (key: keyof LocationData, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleNameChange = (val: string) => {
    setForm((f) => ({ ...f, name: val, slug: f.slug || toSlug(val) }));
  };

  const save = async (status?: string) => {
    if (!form.name) { alert("Name is required"); return; }
    setSaving(true);
    const body = { ...form, status: status || form.status };
    try {
      const url = initialData?.id ? `/api/locations/${initialData.id}` : "/api/locations";
      const method = initialData?.id ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      router.push("/admin/locations");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm("Delete this location?")) return;
    await fetch(`/api/locations/${initialData.id}`, { method: "DELETE" });
    router.push("/admin/locations");
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-black">{initialData?.id ? "Edit location" : "New location"}</h1>
        <div className="flex items-center gap-2">
          {initialData?.id && <button onClick={handleDelete} className="px-3 py-2 text-xs font-semibold text-red-500 hover:text-red-700">Delete</button>}
          <button onClick={() => save("draft")} disabled={saving} className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-black hover:border-gray-400 disabled:opacity-60">Save draft</button>
          <button onClick={() => save("published")} disabled={saving} className="px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-60" style={{ backgroundColor: "#D7242A" }}>
            {saving ? "Saving..." : form.status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Name *</label>
            <input type="text" value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Sagara" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] transition-colors" required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="sagara" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] transition-colors font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">District</label>
              <select value={form.district} onChange={(e) => set("district", e.target.value)} className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] bg-white">
                <option value="">Select district</option>
                <option value="Shivamogga">Shivamogga</option>
                <option value="Uttara Kannada">Uttara Kannada</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Taluk</label>
              <input type="text" value={form.taluk} onChange={(e) => set("taluk", e.target.value)} placeholder="e.g. Sagara Taluk" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Short Description</label>
            <textarea value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} rows={2} placeholder="2-3 sentence intro shown in listings" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Full Description (HTML)</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={8} placeholder="Full location content (supports HTML)" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] transition-colors resize-y font-mono text-xs" />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Hero Image</label>
            {form.heroImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.heroImage} alt="" className="w-full aspect-video object-cover rounded-xl mb-2 border border-gray-200" />
            )}
            <button type="button" onClick={() => setMediaOpen(true)} className="w-full py-2 text-xs font-semibold border border-gray-200 rounded-lg hover:border-gray-400 transition-colors">
              {form.heroImage ? "Change image" : "Select image"}
            </button>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">SEO Title</label>
            <input type="text" value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder="SEO title" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A]" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Meta Description</label>
            <textarea value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} rows={3} placeholder="Meta description" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Display Order</label>
            <input type="number" value={form.order} onChange={(e) => set("order", parseInt(e.target.value) || 0)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A]" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] bg-white">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      <MediaPicker open={mediaOpen} onClose={() => setMediaOpen(false)} onSelect={(url) => { set("heroImage", url); setMediaOpen(false); }} />
    </>
  );
}

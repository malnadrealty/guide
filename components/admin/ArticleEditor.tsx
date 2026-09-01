"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { toSlug } from "@/lib/utils";

interface Category { id: string; name: string; slug: string }
interface Location { id: string; name: string; slug: string }

interface ArticleData {
  id?: string;
  title: string;
  slug: string;
  categoryId: string;
  locationId: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  seoTitle: string;
  metaDescription: string;
  ogImage: string;
  status: string;
  isFeatured: boolean;
  isPopular: boolean;
}

interface Props {
  initialData?: Partial<ArticleData>;
  categories: Category[];
  locations: Location[];
}

type TabKey = "content" | "seo" | "settings";

export function ArticleEditor({ initialData, categories, locations }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("content");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<"featured" | "og">("featured");

  const [form, setForm] = useState<ArticleData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    categoryId: initialData?.categoryId || "",
    locationId: initialData?.locationId || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    featuredImage: initialData?.featuredImage || "",
    seoTitle: initialData?.seoTitle || "",
    metaDescription: initialData?.metaDescription || "",
    ogImage: initialData?.ogImage || "",
    status: initialData?.status || "draft",
    isFeatured: initialData?.isFeatured ?? false,
    isPopular: initialData?.isPopular ?? false,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        isAllowedUri: (url) => {
          try {
            const parsed = url.startsWith("/") ? new URL(`https://x.com${url}`) : new URL(url);
            return /^(https?|mailto|tel):$/.test(parsed.protocol);
          } catch {
            return false;
          }
        },
      }),
      Image,
      Placeholder.configure({ placeholder: "Start writing your guide..." }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: form.content,
    editorProps: {
      attributes: { class: "tiptap-content outline-none min-h-[400px] px-1" },
    },
    onUpdate({ editor }) {
      setForm((f) => ({ ...f, content: editor.getHTML() }));
    },
  });

  const set = (key: keyof ArticleData, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleTitleChange = (val: string) => {
    setForm((f) => ({ ...f, title: val, slug: f.slug || toSlug(val) }));
  };

  const save = async (status?: string) => {
    if (!form.title) { alert("Title is required"); return; }
    setSaving(true);
    const body = { ...form, status: status || form.status };
    try {
      const url = initialData?.id ? `/api/articles/${initialData.id}` : "/api/articles";
      const method = initialData?.id ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      router.push("/admin/articles");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm("Delete this article? This cannot be undone.")) return;
    await fetch(`/api/articles/${initialData.id}`, { method: "DELETE" });
    router.push("/admin/articles");
    router.refresh();
  };

  const handleMediaSelect = (url: string) => {
    if (mediaPickerTarget === "featured") set("featuredImage", url);
    else set("ogImage", url);
    setMediaPickerOpen(false);
  };

  const TABS: { key: TabKey; label: string }[] = [
    { key: "content", label: "Content" },
    { key: "seo", label: "SEO" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-black">{initialData?.id ? "Edit article" : "New article"}</h1>
        <div className="flex items-center gap-2">
          {initialData?.id && (
            <button onClick={handleDelete} className="px-3 py-2 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors">
              Delete
            </button>
          )}
          <button
            onClick={() => save("draft")}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-black hover:border-gray-400 transition-colors disabled:opacity-60"
          >
            Save draft
          </button>
          <button
            onClick={() => save("published")}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-60"
            style={{ backgroundColor: "#D7242A" }}
          >
            {saving ? "Saving..." : form.status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {/* Title */}
      <input
        type="text"
        value={form.title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Article title"
        className="w-full text-2xl font-bold text-black outline-none border-0 border-b-2 border-transparent focus:border-[#D7242A] transition-colors mb-2 py-2 bg-transparent"
      />
      <input
        type="text"
        value={form.slug}
        onChange={(e) => set("slug", e.target.value)}
        placeholder="url-slug"
        className="w-full text-xs text-gray-400 outline-none border-0 border-b border-gray-100 focus:border-gray-300 transition-colors mb-6 py-1.5 bg-transparent font-mono"
      />

      {/* Tabs */}
      <div className="flex gap-0 mb-6 border-b border-gray-100">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${activeTab === tab.key ? "border-[#D7242A] text-[#D7242A]" : "border-transparent text-gray-500 hover:text-black"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content tab */}
      {activeTab === "content" && (
        <div>
          {/* Featured image */}
          <div className="mb-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Featured Image</label>
            <div className="flex gap-2 items-center">
              {form.featuredImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.featuredImage} alt="" className="w-20 h-14 object-cover rounded-lg border border-gray-200" />
              )}
              <button
                type="button"
                onClick={() => { setMediaPickerTarget("featured"); setMediaPickerOpen(true); }}
                className="px-3 py-2 text-xs font-semibold border border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
              >
                {form.featuredImage ? "Change image" : "Select image"}
              </button>
              {form.featuredImage && (
                <button type="button" onClick={() => set("featuredImage", "")} className="text-xs text-red-400 hover:text-red-600">Remove</button>
              )}
            </div>
          </div>

          {/* Excerpt */}
          <div className="mb-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={2}
              placeholder="Short summary shown in card previews..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] transition-colors resize-none"
            />
          </div>

          {/* Toolbar */}
          {editor && (
            <div className="flex flex-wrap gap-1 mb-3 p-2 bg-gray-50 rounded-xl border border-gray-100">
              {[
                { label: "B", action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
                { label: "I", action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
                { label: "U", action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive("underline") },
              ].map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={btn.action}
                  className={`px-2.5 py-1.5 text-sm font-bold rounded-md transition-colors ${btn.active ? "bg-[#D7242A] text-white" : "hover:bg-gray-200 text-black"}`}
                >
                  {btn.label}
                </button>
              ))}
              <div className="w-px bg-gray-200 mx-1" />
              {[1, 2, 3].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run()}
                  className={`px-2 py-1.5 text-xs font-bold rounded-md transition-colors ${editor.isActive("heading", { level }) ? "bg-[#D7242A] text-white" : "hover:bg-gray-200 text-black"}`}
                >
                  H{level}
                </button>
              ))}
              <div className="w-px bg-gray-200 mx-1" />
              <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${editor.isActive("bulletList") ? "bg-[#D7242A] text-white" : "hover:bg-gray-200"}`}>• List</button>
              <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${editor.isActive("orderedList") ? "bg-[#D7242A] text-white" : "hover:bg-gray-200"}`}>1. List</button>
              <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${editor.isActive("blockquote") ? "bg-[#D7242A] text-white" : "hover:bg-gray-200"}`}>" Quote</button>
              <div className="w-px bg-gray-200 mx-1" />
              <button
                type="button"
                onClick={() => {
                  const url = prompt("Link URL:");
                  if (url) editor.chain().focus().setLink({ href: url }).run();
                }}
                className="px-2.5 py-1.5 text-xs rounded-md hover:bg-gray-200 transition-colors"
              >
                🔗 Link
              </button>
              <button
                type="button"
                onClick={() => { setMediaPickerTarget("featured"); setMediaPickerOpen(true); }}
                className="px-2.5 py-1.5 text-xs rounded-md hover:bg-gray-200 transition-colors"
              >
                🖼 Image
              </button>
            </div>
          )}

          {/* Editor */}
          <div className="min-h-[400px] border border-gray-200 rounded-xl p-5 focus-within:border-[#D7242A] transition-colors">
            <EditorContent editor={editor} />
          </div>
        </div>
      )}

      {/* SEO tab */}
      {activeTab === "seo" && (
        <div className="space-y-5 max-w-2xl">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">SEO Title</label>
            <input
              type="text"
              value={form.seoTitle}
              onChange={(e) => set("seoTitle", e.target.value)}
              placeholder={form.title || "SEO title (defaults to article title)"}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">{form.seoTitle.length}/60 chars recommended</p>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Meta Description</label>
            <textarea
              value={form.metaDescription}
              onChange={(e) => set("metaDescription", e.target.value)}
              rows={3}
              placeholder="Appears in search results. Keep under 160 chars."
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] transition-colors resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{form.metaDescription.length}/160 chars recommended</p>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Canonical URL (optional)</label>
            <input
              type="text"
              value={form.ogImage}
              onChange={(e) => set("ogImage", e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">OG Image</label>
            <div className="flex gap-2 items-center">
              {form.ogImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.ogImage} alt="" className="w-20 h-14 object-cover rounded-lg border border-gray-200" />
              )}
              <button
                type="button"
                onClick={() => { setMediaPickerTarget("og"); setMediaPickerOpen(true); }}
                className="px-3 py-2 text-xs font-semibold border border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
              >
                Select OG image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings tab */}
      {activeTab === "settings" && (
        <div className="space-y-5 max-w-md">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] transition-colors bg-white"
            >
              <option value="">No category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Location</label>
            <select
              value={form.locationId}
              onChange={(e) => set("locationId", e.target.value)}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] transition-colors bg-white"
            >
              <option value="">No location</option>
              {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] transition-colors bg-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Visibility</label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => set("isFeatured", e.target.checked)}
                  className="sr-only"
                />
                <div
                  className="w-10 h-6 rounded-full transition-colors duration-200"
                  style={{ backgroundColor: form.isFeatured ? "#D7242A" : "#E5E7EB" }}
                />
                <div
                  className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                  style={{ transform: form.isFeatured ? "translateX(16px)" : "translateX(0)" }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-black">Featured on homepage</p>
                <p className="text-xs text-gray-400 mt-0.5">Shows in the Featured guides section</p>
              </div>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.isPopular}
                  onChange={(e) => set("isPopular", e.target.checked)}
                  className="sr-only"
                />
                <div
                  className="w-10 h-6 rounded-full transition-colors duration-200"
                  style={{ backgroundColor: form.isPopular ? "#D7242A" : "#E5E7EB" }}
                />
                <div
                  className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                  style={{ transform: form.isPopular ? "translateX(16px)" : "translateX(0)" }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-black">Show in Quick Answers</p>
                <p className="text-xs text-gray-400 mt-0.5">Appears in the Quick Answers section on the homepage</p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Media picker */}
      <MediaPicker
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
      />
    </>
  );
}

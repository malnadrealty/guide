"use client";
import { useState, useEffect } from "react";

interface Category { id: string; name: string; slug: string; description?: string | null; order: number }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    setSaving(true);
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDesc }),
    });
    setNewName(""); setNewDesc("");
    await load();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Articles using it will be uncategorized.")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setCategories((c) => c.filter((cat) => cat.id !== id));
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Categories</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage content categories</p>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <h2 className="font-bold text-black mb-4">Add category</h2>
        <div className="space-y-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            required
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] transition-colors"
          />
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] transition-colors"
          />
          <button type="submit" disabled={saving || !newName} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60" style={{ backgroundColor: "#D7242A" }}>
            {saving ? "Adding..." : "Add category"}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-10 text-center text-gray-400 text-sm">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="py-10 text-center text-gray-400 text-sm">No categories yet.</div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium text-black text-sm">{cat.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">/guides?category={cat.slug}</p>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

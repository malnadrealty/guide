"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Media { id: string; url: string; filename: string; size: number; createdAt: string; alt?: string | null }

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async (q = "") => {
    setLoading(true);
    const res = await fetch(`/api/media${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    const data = await res.json();
    setMedia(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (res.ok) setMedia((m) => [data, ...m]);
    else alert(data.error || "Upload failed");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    await fetch("/api/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setMedia((m) => m.filter((item) => item.id !== id));
    setSelected((s) => { const n = new Set(s); n.delete(id); return n; });
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} image${selected.size > 1 ? "s" : ""}? This cannot be undone.`)) return;
    setBulkDeleting(true);
    const ids = [...selected];
    await Promise.all(
      ids.map((id) => fetch("/api/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }))
    );
    setMedia((m) => m.filter((item) => !ids.includes(item.id)));
    setSelected(new Set());
    setBulkDeleting(false);
  };

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const allIds = media.map((m) => m.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(allIds));

  const copyUrl = (url: string) => {
    const full = url.startsWith("http") ? url : window.location.origin + url;
    navigator.clipboard.writeText(full);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Media</h1>
          <p className="text-sm text-gray-400 mt-0.5">{media.length} images</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
          style={{ backgroundColor: "#D7242A" }}
        >
          {uploading ? "Uploading..." : "Upload image"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); load(e.target.value); }}
          placeholder="Search by filename..."
          className="w-full max-w-sm px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] transition-colors"
        />
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="mb-4 flex items-center gap-3 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl">
          <span className="text-sm font-semibold text-red-700">{selected.size} selected</span>
          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
            className="ml-auto px-4 py-1.5 text-sm font-bold text-white rounded-lg disabled:opacity-60"
            style={{ backgroundColor: "#D7242A" }}
          >
            {bulkDeleting ? "Deleting..." : `Delete ${selected.size} image${selected.size > 1 ? "s" : ""}`}
          </button>
          <button onClick={() => setSelected(new Set())} className="text-sm text-gray-500 hover:text-black">Cancel</button>
        </div>
      )}

      {/* Select all row (only when media exists) */}
      {!loading && media.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="accent-[#D7242A] w-4 h-4 cursor-pointer"
          />
          <span className="text-xs text-gray-400 font-medium">Select all</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">Loading...</div>
      ) : media.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          <p className="mb-3">No images yet.</p>
          <button onClick={() => fileRef.current?.click()} className="text-sm font-semibold text-[#D7242A]">Upload your first image →</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((m) => (
            <div
              key={m.id}
              className={`group relative bg-white rounded-xl overflow-hidden border transition-all ${selected.has(m.id) ? "border-[#D7242A] shadow-md ring-2 ring-[#D7242A]/20" : "border-gray-100 hover:shadow-md"}`}
            >
              {/* Checkbox overlay */}
              <div className="absolute top-2 left-2 z-10">
                <input
                  type="checkbox"
                  checked={selected.has(m.id)}
                  onChange={() => toggle(m.id)}
                  className="accent-[#D7242A] w-4 h-4 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className="aspect-square relative bg-gray-100">
                <Image src={m.url} alt={m.alt || m.filename} fill className="object-cover" sizes="200px" />
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate font-medium">{m.filename}</p>
                <p className="text-[10px] text-gray-400">{(m.size / 1024).toFixed(0)} KB</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <button onClick={() => copyUrl(m.url)} className="text-[10px] font-semibold text-[#D7242A]">
                    {copied === m.url ? "Copied!" : "Copy URL"}
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="text-[10px] font-semibold text-gray-400 hover:text-red-500 ml-auto">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

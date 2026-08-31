"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Media {
  id: string;
  url: string;
  filename: string;
  alt?: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function MediaPicker({ open, onClose, onSelect }: Props) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async (q = "") => {
    setLoading(true);
    const res = await fetch(`/api/media${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    const data = await res.json();
    setMedia(data);
    setLoading(false);
  };

  useEffect(() => {
    if (open) fetchMedia();
  }, [open]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (res.ok) {
      setMedia((m) => [data, ...m]);
    } else {
      alert(data.error || "Upload failed");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-black">Media Library</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white disabled:opacity-60"
              style={{ backgroundColor: "#D7242A" }}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-gray-50">
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); fetchMedia(e.target.value); }}
            placeholder="Search by filename..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] transition-colors"
          />
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="text-center py-10 text-gray-400 text-sm">Loading...</div>
          ) : media.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              No images yet. Upload your first image.
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {media.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onSelect(m.url)}
                  className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-[#D7242A] transition-colors relative bg-gray-100 group"
                >
                  <Image src={m.url} alt={m.alt || m.filename} fill className="object-cover" sizes="150px" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

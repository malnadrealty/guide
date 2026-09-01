"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Location {
  id: string;
  name: string;
  slug: string;
  status: string;
  district: string | null;
}

export function LocationsTable({ locations }: { locations: Location[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const allIds = locations.map((l) => l.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(allIds));

  const deleteOne = async (id: string) => {
    if (!confirm("Delete this location? Associated articles will lose their location. This cannot be undone.")) return;
    setDeleting((d) => new Set(d).add(id));
    await fetch(`/api/locations/${id}`, { method: "DELETE" });
    setDeleting((d) => { const n = new Set(d); n.delete(id); return n; });
    setSelected((s) => { const n = new Set(s); n.delete(id); return n; });
    startTransition(() => router.refresh());
  };

  const deleteSelected = async () => {
    if (!confirm(`Delete ${selected.size} location${selected.size > 1 ? "s" : ""}? This cannot be undone.`)) return;
    const ids = [...selected];
    setDeleting(new Set(ids));
    await Promise.all(ids.map((id) => fetch(`/api/locations/${id}`, { method: "DELETE" })));
    setDeleting(new Set());
    setSelected(new Set());
    startTransition(() => router.refresh());
  };

  return (
    <>
      {selected.size > 0 && (
        <div className="mb-3 flex items-center gap-3 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl">
          <span className="text-sm font-semibold text-red-700">{selected.size} selected</span>
          <button
            onClick={deleteSelected}
            disabled={isPending}
            className="ml-auto px-4 py-1.5 text-sm font-bold text-white rounded-lg disabled:opacity-60"
            style={{ backgroundColor: "#D7242A" }}
          >
            Delete {selected.size} location{selected.size > 1 ? "s" : ""}
          </button>
          <button onClick={() => setSelected(new Set())} className="text-sm text-gray-500 hover:text-black">Cancel</button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="accent-[#D7242A] w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="text-left px-3 py-3">Name</th>
              <th className="text-left px-3 py-3 hidden md:table-cell">District</th>
              <th className="text-left px-3 py-3">Status</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {locations.map((loc) => (
              <tr
                key={loc.id}
                className={`transition-colors ${selected.has(loc.id) ? "bg-red-50/50" : "hover:bg-gray-50"}`}
              >
                <td className="px-4 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={selected.has(loc.id)}
                    onChange={() => toggle(loc.id)}
                    className="accent-[#D7242A] w-4 h-4 cursor-pointer"
                  />
                </td>
                <td className="px-3 py-4">
                  <Link href={`/admin/locations/${loc.id}`} className="font-medium text-black hover:text-[#D7242A] transition-colors">
                    {loc.name}
                  </Link>
                </td>
                <td className="px-3 py-4 text-gray-500 hidden md:table-cell">{loc.district || "—"}</td>
                <td className="px-3 py-4">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: loc.status === "published" ? "#e6f9f0" : "#F5F5F5", color: loc.status === "published" ? "#16a34a" : "#8F8F8F" }}
                  >
                    {loc.status}
                  </span>
                </td>
                <td className="px-3 py-4">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/locations/${loc.id}`} className="text-xs font-semibold text-gray-500 hover:text-black">Edit</Link>
                    {loc.status === "published" && (
                      <a href={`/locations/${loc.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#D7242A]">View</a>
                    )}
                    <button
                      onClick={() => deleteOne(loc.id)}
                      disabled={deleting.has(loc.id)}
                      className="text-xs font-semibold text-gray-400 hover:text-red-600 disabled:opacity-40 transition-colors"
                    >
                      {deleting.has(loc.id) ? "…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

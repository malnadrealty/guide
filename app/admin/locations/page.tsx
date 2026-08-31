import { db } from "@/lib/db";
import Link from "next/link";

export default async function AdminLocationsPage() {
  const locations = await db.location.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Locations</h1>
          <p className="text-sm text-gray-400 mt-0.5">{locations.length} total</p>
        </div>
        <Link href="/admin/locations/new" className="px-4 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: "#D7242A" }}>
          + New Location
        </Link>
      </div>

      {locations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
          <p className="text-gray-400 mb-4">No locations yet.</p>
          <Link href="/admin/locations/new" className="text-sm font-semibold text-[#D7242A]">Add your first location →</Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-3 py-3 hidden md:table-cell">District</th>
                <th className="text-left px-3 py-3">Status</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {locations.map((loc) => (
                <tr key={loc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/admin/locations/${loc.id}`} className="font-medium text-black hover:text-[#D7242A] transition-colors">{loc.name}</Link>
                  </td>
                  <td className="px-3 py-4 text-gray-500 hidden md:table-cell">{loc.district || "—"}</td>
                  <td className="px-3 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: loc.status === "published" ? "#e6f9f0" : "#F5F5F5", color: loc.status === "published" ? "#16a34a" : "#8F8F8F" }}>
                      {loc.status}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/locations/${loc.id}`} className="text-xs font-semibold text-gray-500 hover:text-black">Edit</Link>
                      {loc.status === "published" && (
                        <a href={`/locations/${loc.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#D7242A]">View</a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { db } from "@/lib/db";
import Link from "next/link";
import { LocationsTable } from "@/components/admin/LocationsTable";

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
        <LocationsTable locations={locations} />
      )}
    </div>
  );
}

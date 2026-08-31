export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { db } from "@/lib/db";
import { LocationCard } from "@/components/public/LocationCard";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";

export const metadata: Metadata = {
  title: "Locations — Property & Land Guides",
  description: "Explore local property, land and real estate guides across Shivamogga and Uttara Kannada. Find insights for Sagara, Sirsi, Honnavar, Kumta and more.",
};

export default async function LocationsPage() {
  const locations = await db.location.findMany({
    where: { status: "published" },
    orderBy: { order: "asc" },
  });

  const shivamogga = locations.filter((l) => l.district === "Shivamogga");
  const uttaraKannada = locations.filter((l) => l.district === "Uttara Kannada");
  const others = locations.filter((l) => l.district !== "Shivamogga" && l.district !== "Uttara Kannada");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs crumbs={[{ label: "Locations" }]} />

      <div className="mt-6 mb-10">
        <p className="text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "#D7242A" }}>All Locations</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-black">Browse by location</h1>
        <p className="text-gray-500 mt-3 max-w-xl">
          Find local property guides, land information and real estate insights for towns and taluks across Shivamogga and Uttara Kannada.
        </p>
      </div>

      {locations.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          <p className="text-lg font-semibold mb-2">No locations yet</p>
          <p className="text-sm">Locations will appear here once published.</p>
        </div>
      )}

      {shivamogga.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-black mb-5 pb-3 border-b border-gray-100">Shivamogga District</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {shivamogga.map((loc) => <LocationCard key={loc.id} location={loc} />)}
          </div>
        </section>
      )}

      {uttaraKannada.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-black mb-5 pb-3 border-b border-gray-100">Uttara Kannada District</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uttaraKannada.map((loc) => <LocationCard key={loc.id} location={loc} />)}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-black mb-5 pb-3 border-b border-gray-100">Other Locations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {others.map((loc) => <LocationCard key={loc.id} location={loc} />)}
          </div>
        </section>
      )}
    </div>
  );
}

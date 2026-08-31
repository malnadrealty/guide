export default function LocationsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 animate-pulse">
      <div className="mb-8">
        <div className="h-3 w-28 bg-[#F0EDE8] rounded mb-3" />
        <div className="h-8 w-52 bg-[#F0EDE8] rounded" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-[#F2EFEB] overflow-hidden">
            <div className="aspect-[3/4]" />
          </div>
        ))}
      </div>
    </div>
  );
}

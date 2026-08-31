export default function GuidesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-3 w-24 bg-[#F0EDE8] rounded mb-3" />
        <div className="h-8 w-64 bg-[#F0EDE8] rounded" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#F0EDE8] overflow-hidden">
            <div className="aspect-[16/9] bg-[#F2EFEB]" />
            <div className="p-4 space-y-3">
              <div className="h-3 w-16 bg-[#F0EDE8] rounded" />
              <div className="h-5 w-full bg-[#F0EDE8] rounded" />
              <div className="h-4 w-4/5 bg-[#F2EFEB] rounded" />
              <div className="h-4 w-3/5 bg-[#F2EFEB] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

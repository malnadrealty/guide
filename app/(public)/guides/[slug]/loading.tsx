export default function ArticleLoading() {
  return (
    <div className="animate-pulse">
      {/* Article header */}
      <div className="bg-white max-w-4xl mx-auto px-5 md:px-8 pt-6 pb-8">
        {/* Breadcrumb */}
        <div className="flex gap-2 mb-6">
          <div className="h-3 w-12 bg-[#F0EDE8] rounded" />
          <div className="h-3 w-3 bg-[#F0EDE8] rounded" />
          <div className="h-3 w-20 bg-[#F0EDE8] rounded" />
        </div>
        {/* Category chip */}
        <div className="h-5 w-16 bg-[#FEF2F2] rounded-full mb-5" />
        {/* Title */}
        <div className="space-y-3 mb-5">
          <div className="h-9 w-full bg-[#F0EDE8] rounded" />
          <div className="h-9 w-4/5 bg-[#F0EDE8] rounded" />
          <div className="h-9 w-2/3 bg-[#F2EFEB] rounded" />
        </div>
        {/* Excerpt */}
        <div className="space-y-2 mb-7">
          <div className="h-4 w-full bg-[#F2EFEB] rounded" />
          <div className="h-4 w-5/6 bg-[#F2EFEB] rounded" />
        </div>
        {/* Author */}
        <div className="flex items-center gap-3 pt-6 border-t border-[#F0EDE8]">
          <div className="w-9 h-9 rounded-full bg-[#FEF2F2]" />
          <div className="space-y-1.5">
            <div className="h-3 w-24 bg-[#F0EDE8] rounded" />
            <div className="h-3 w-32 bg-[#F2EFEB] rounded" />
          </div>
        </div>
      </div>

      {/* Featured image */}
      <div className="max-w-5xl mx-auto sm:px-5 md:px-8 mt-7 mb-2">
        <div className="sm:rounded-2xl bg-[#F2EFEB]" style={{ aspectRatio: "16/9" }} />
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-10 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-[#F2EFEB] rounded"
            style={{ width: `${70 + Math.random() * 30}%` }}
          />
        ))}
      </div>
    </div>
  );
}

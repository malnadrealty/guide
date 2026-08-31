import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white">
      <div className="mb-6">
        <span className="text-7xl font-extrabold text-black">4</span>
        <span className="text-7xl font-extrabold" style={{ color: "#D7242A" }}>0</span>
        <span className="text-7xl font-extrabold text-black">4</span>
      </div>
      <h1 className="text-2xl font-bold text-black mb-3">Page not found</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        This page doesn&apos;t exist or has been moved. Try browsing locations or guides.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: "#D7242A" }}
        >
          Go home
        </Link>
        <Link
          href="/locations"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-black hover:border-gray-400 transition-colors"
        >
          Browse locations
        </Link>
        <Link
          href="/guides"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-black hover:border-gray-400 transition-colors"
        >
          Browse guides
        </Link>
      </div>
    </div>
  );
}

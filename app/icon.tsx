import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const contentType = "image/png";
export const size = { width: 64, height: 64 };

export default async function Icon() {
  const settings = await getSettings();

  if (settings.favicon_url) {
    try {
      const res = await fetch(settings.favicon_url, { cache: "no-store" });
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const ct = res.headers.get("content-type") || "image/png";
        return new Response(buffer, { headers: { "Content-Type": ct, "Cache-Control": "public, max-age=3600" } });
      }
    } catch { /* fall through to default */ }
  }

  // Default: red house SVG rendered as PNG via ImageResponse
  const { ImageResponse } = await import("next/og");
  return new ImageResponse(
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: 14,
        background: "#D7242A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="38" height="38" viewBox="0 0 36 36" fill="none">
        <path d="M8 26V14l10-7 10 7v12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 26v-7h8v7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>,
    { width: 64, height: 64 }
  );
}

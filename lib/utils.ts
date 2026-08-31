import slugify from "slugify";

export function toSlug(str: string): string {
  const ascii = slugify(str, { lower: true, strict: true });
  if (ascii) return ascii;
  // Non-ASCII titles (e.g. Kannada): encode as percent-decoded unicode slug
  const unicode = str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^ಀ-೿ऀ-ॿঀ-৿\w-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return unicode || Math.random().toString(36).slice(2, 8);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function readingTime(content: string): number {
  const text = content.replace(/<[^>]+>/g, "");
  // Kannada/Devanagari: count syllables (approx 2 chars each), 100 wpm
  const hasIndic = /[ಀ-೿ऀ-ॿ]/.test(text);
  if (hasIndic) {
    const syllables = Math.ceil(text.replace(/\s/g, "").length / 2);
    return Math.max(1, Math.ceil(syllables / 100));
  }
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

export function absoluteUrl(path: string): string {
  const base =
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return `${base}${path}`;
}

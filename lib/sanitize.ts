import sanitizeHtml from "sanitize-html";

// Tiptap-generated HTML — allow rich content but block all script execution
const ALLOWED_TAGS = [
  "p", "br", "strong", "b", "em", "i", "u", "s", "del",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li",
  "blockquote", "pre", "code",
  "a", "img",
  "table", "thead", "tbody", "tr", "th", "td",
  "hr", "figure", "figcaption",
  "div", "span",
];

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] = {
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "width", "height", "loading"],
  th: ["colspan", "rowspan"],
  td: ["colspan", "rowspan"],
  "*": ["class"],
};

const ALLOWED_SCHEMES = ["https", "http", "mailto", "tel"];

export function sanitizeContent(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ALLOWED_SCHEMES,
    // Force rel="noopener noreferrer" on external links
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: "noopener noreferrer",
          // Remove target="_blank" from non-https links
          ...(attribs.target === "_blank" ? { target: "_blank" } : {}),
        },
      }),
    },
    disallowedTagsMode: "discard",
  });
}

// Safe JSON-LD serialization — escapes </script> to prevent script injection
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/<\/script>/gi, "<\\/script>");
}

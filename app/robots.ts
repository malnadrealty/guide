import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: "https://guide.malnadrealty.com/sitemap.xml",
    host: "https://guide.malnadrealty.com",
  };
}

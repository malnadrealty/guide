import type { Metadata } from "next";
import { Inter, Noto_Sans_Kannada } from "next/font/google";
import { getSettings } from "@/lib/settings";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const notoKannada = Noto_Sans_Kannada({
  subsets: ["kannada"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kannada",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteName = settings.site_name || "Malnad Realty Guide";
  const metaTitle = settings.site_meta_title || `${siteName} — ${settings.site_tagline || "Know the place before you buy."}`;
  const description = settings.site_description || "Property, land, homes and local insights across Shimoga & Uttarakannada District.";
  const ogImage = settings.site_og_image || "/og-default.jpg";

  return {
    metadataBase: new URL(process.env.NEXTAUTH_URL || "https://guide.malnadrealty.com"),
    title: {
      default: metaTitle,
      template: `%s | ${siteName}`,
    },
    description,
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: "https://guide.malnadrealty.com",
      siteName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@malnadrealty",
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${notoKannada.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://guide.malnadrealty.com"),
  title: {
    default: "Malnad Realty Guide — Know the place before you buy.",
    template: "%s | Malnad Realty Guide",
  },
  description:
    "Property, land, homes and local insights across Shivamogga & Uttara Kannada. Local real estate guides, location information and buying advice.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://guide.malnadrealty.com",
    siteName: "Malnad Realty Guide",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Malnad Realty Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@malnadrealty",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

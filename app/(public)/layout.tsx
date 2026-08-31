import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { BottomNav } from "@/components/public/BottomNav";
import { getSettings } from "@/lib/settings";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        logoLine1={settings.logo_text_line1}
        logoLine2={settings.logo_text_line2}
        logoImageUrl={settings.logo_image_url || undefined}
        logoDarkUrl={settings.logo_dark_url || undefined}
      />
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <Footer settings={settings} />
      <BottomNav />
    </div>
  );
}

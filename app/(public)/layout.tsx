import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { NavShell } from "@/components/public/NavShell";
import { NavigationProgress } from "@/components/public/NavigationProgress";
import { getSettings } from "@/lib/settings";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationProgress />
      <Header
        logoLine1={settings.logo_text_line1}
        logoLine2={settings.logo_text_line2}
        logoImageUrl={settings.logo_image_url || undefined}
        logoDarkUrl={settings.logo_dark_url || undefined}
        popularSearches={settings.popular_searches}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer settings={settings} />
      <NavShell
        logoImageUrl={settings.logo_image_url || undefined}
        logoDarkUrl={settings.logo_dark_url || undefined}
      />
    </div>
  );
}

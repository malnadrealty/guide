import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { getSettings } from "@/lib/settings";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "▦" },
  { href: "/admin/articles", label: "Articles", icon: "📄" },
  { href: "/admin/locations", label: "Locations", icon: "📍" },
  { href: "/admin/categories", label: "Categories", icon: "🏷" },
  { href: "/admin/media", label: "Media", icon: "🖼" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const settings = await getSettings();
  const logoProps = {
    imageUrl: settings.logo_image_url || undefined,
    darkImageUrl: settings.logo_dark_url || undefined,
    variant: "dark" as const,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-gray-100">
          <Logo {...logoProps} />
          <p className="text-[10px] text-gray-400 mt-1 ml-1 font-medium uppercase tracking-wider">Admin</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2">{session.user?.email}</p>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="w-full text-left text-xs text-red-500 font-medium hover:text-red-700 transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <Logo {...logoProps} />
          <nav className="flex items-center gap-1">
            {NAV.slice(0, 4).map((item) => (
              <Link key={item.href} href={item.href} className="p-2 text-sm rounded-lg hover:bg-gray-100 transition-colors" title={item.label}>
                {item.icon}
              </Link>
            ))}
          </nav>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import type { SettingKey } from "@/lib/setting-constants";
import { SETTING_DEFAULTS } from "@/lib/setting-constants";

const TOPIC_LINKS = [
  { href: "/property", label: "Property" },
  { href: "/land", label: "Land" },
  { href: "/construction", label: "Construction" },
  { href: "/legal", label: "Legal" },
  { href: "/finance", label: "Finance" },
];

const GUIDE_LINKS = [
  { href: "/guides", label: "All Guides" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

type Settings = Record<SettingKey, string>;

interface FooterProps {
  settings?: Partial<Settings>;
}

function s(settings: Partial<Settings> | undefined, key: SettingKey) {
  return settings?.[key] || SETTING_DEFAULTS[key];
}

export function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear();
  const facebook = s(settings, "footer_facebook");
  const instagram = s(settings, "footer_instagram");
  const youtube = s(settings, "footer_youtube");
  const phone = s(settings, "contact_phone");
  const email = s(settings, "contact_email");
  const address = s(settings, "contact_address");
  const hasSocial = facebook || instagram || youtube;
  const hasContact = phone || email || address;

  return (
    <footer className="bg-black text-white pb-16 md:pb-0">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo
                line1={s(settings, "logo_text_line1")}
                line2={s(settings, "logo_text_line2")}
                imageUrl={s(settings, "logo_image_url") || undefined}
                className="[&_span]:!text-white [&_span:last-child]:!text-gray-400"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {s(settings, "footer_tagline")}
            </p>

            {/* Contact info */}
            {hasContact && (
              <div className="mt-5 space-y-1.5 text-sm text-gray-400">
                {phone && <p>{phone}</p>}
                {email && (
                  <a href={`mailto:${email}`} className="block hover:text-white transition-colors">
                    {email}
                  </a>
                )}
                {address && <p className="leading-snug">{address}</p>}
              </div>
            )}

            {/* Social */}
            {hasSocial && (
              <div className="flex gap-3 mt-5">
                {facebook && (
                  <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                    className="p-2 rounded-lg border border-white/20 hover:border-white/60 transition-colors">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                )}
                {instagram && (
                  <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                    className="p-2 rounded-lg border border-white/20 hover:border-white/60 transition-colors">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                )}
                {youtube && (
                  <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                    className="p-2 rounded-lg border border-white/20 hover:border-white/60 transition-colors">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
                    </svg>
                  </a>
                )}
              </div>
            )}

            <a
              href="https://malnadrealty.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-white border border-white/20 px-4 py-2 rounded-lg hover:border-white/60 transition-colors"
            >
              Visit Malnad Realty
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>

          {/* Topics */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">Topics</h3>
            <ul className="space-y-2.5">
              {TOPIC_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">Navigate</h3>
            <ul className="space-y-2.5">
              {GUIDE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            &copy; {year} {s(settings, "footer_copyright")}. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            A content guide by{" "}
            <a href="https://malnadrealty.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              Malnad Realty
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

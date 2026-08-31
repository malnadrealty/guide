"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SETTING_DEFAULTS, type SettingKey } from "@/lib/setting-constants";
import { MediaPicker } from "@/components/admin/MediaPicker";

type Settings = Record<SettingKey, string>;

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({ ...SETTING_DEFAULTS });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [picker, setPicker] = useState<{ open: boolean; field: SettingKey | "" }>({
    open: false,
    field: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings((prev) => ({ ...prev, ...data })));
  }, []);

  const set = (key: SettingKey, value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setToast({ msg: res.ok ? "Settings saved" : "Failed to save", ok: res.ok });
    } catch {
      setToast({ msg: "Failed to save", ok: false });
    }
    setSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  function Field({
    label,
    settingKey,
    type = "text",
    placeholder,
    hint,
  }: {
    label: string;
    settingKey: SettingKey;
    type?: string;
    placeholder?: string;
    hint?: string;
  }) {
    return (
      <div>
        <label className="block text-sm font-semibold text-black mb-1.5">{label}</label>
        <input
          type={type}
          value={settings[settingKey] || ""}
          onChange={(e) => set(settingKey, e.target.value)}
          placeholder={placeholder || SETTING_DEFAULTS[settingKey] || ""}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] transition-colors"
        />
        {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      </div>
    );
  }

  function TextArea({ label, settingKey }: { label: string; settingKey: SettingKey }) {
    return (
      <div>
        <label className="block text-sm font-semibold text-black mb-1.5">{label}</label>
        <textarea
          value={settings[settingKey] || ""}
          onChange={(e) => set(settingKey, e.target.value)}
          rows={3}
          placeholder={SETTING_DEFAULTS[settingKey] || ""}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] transition-colors resize-none"
        />
      </div>
    );
  }

  function ImageField({ label, settingKey, hint }: { label: string; settingKey: SettingKey; hint?: string }) {
    return (
      <div>
        <label className="block text-sm font-semibold text-black mb-1.5">{label}</label>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={settings[settingKey] || ""}
            onChange={(e) => set(settingKey, e.target.value)}
            placeholder="Paste URL or pick →"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#D7242A] transition-colors"
          />
          <button
            type="button"
            onClick={() => setPicker({ open: true, field: settingKey })}
            className="w-full px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 hover:border-[#D7242A] hover:text-[#D7242A] transition-colors"
          >
            Pick from library
          </button>
        </div>
        {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
        {settings[settingKey] && (
          <div className="mt-2 relative h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
            <Image
              src={settings[settingKey]}
              alt=""
              fill
              className="object-cover"
              sizes="600px"
              unoptimized
            />
            <button
              type="button"
              onClick={() => set(settingKey, "")}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Site Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">Configure public website content and appearance</p>
        </div>
        <div className="flex items-center gap-3">
          {toast && (
            <span className={`text-sm font-semibold ${toast.ok ? "text-green-600" : "text-red-600"}`}>
              {toast.msg}
            </span>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-bold rounded-xl text-white disabled:opacity-60 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#D7242A" }}
          >
            {saving ? "Saving…" : "Save All"}
          </button>
        </div>
      </div>

      {/* Site Identity */}
      <Section title="Site Identity" desc="Basic information shown in browser tabs and SEO">
        <Field label="Site Name" settingKey="site_name" />
        <Field label="Tagline" settingKey="site_tagline" />
        <TextArea label="Site Description" settingKey="site_description" />
      </Section>

      {/* Logo */}
      <Section title="Logo & Favicon" desc="Logo appears in the header and footer. Upload both versions if you have them.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ImageField
            label="Logo — Light version"
            settingKey="logo_image_url"
            hint="Use on dark/coloured backgrounds (e.g. hero, dark overlays)"
          />
          <ImageField
            label="Logo — Dark version"
            settingKey="logo_dark_url"
            hint="Use on white/light backgrounds (main header)"
          />
          <ImageField
            label="Favicon"
            settingKey="favicon_url"
            hint="Browser tab icon. Square image recommended (512×512 px)."
          />
        </div>
      </Section>

      {/* Hero */}
      <Section title="Homepage Hero" desc="The large banner at the top of the homepage">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Heading (white)" settingKey="hero_title" />
          <Field label="Heading accent (red, second line)" settingKey="hero_title_accent" />
        </div>
        <TextArea label="Subheading" settingKey="hero_subtitle" />
        <ImageField label="Background Image" settingKey="hero_bg_image" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="CTA Button Text" settingKey="hero_cta_text" />
          <Field label="CTA Button URL" settingKey="hero_cta_url" />
        </div>
        <Field
          label="Popular Searches"
          settingKey="popular_searches"
          placeholder="Property in Sagara, Land in Sirsi, Construction Cost"
          hint="Comma-separated. Shown as chips in the search popup and hero section."
        />
      </Section>

      {/* CTA Banner */}
      <Section title="CTA Banner" desc="The dark promotional section at the bottom of the homepage">
        <ImageField
          label="Background Image"
          settingKey="cta_bg_image"
          hint="A property or landscape photo. Shown on the right side of the banner."
        />
        <Field label="Eyebrow Text" settingKey="cta_eyebrow" placeholder="Looking for a property?" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Heading (white)" settingKey="cta_title" placeholder="Explore verified properties on" />
          <Field label="Heading accent (red)" settingKey="cta_title_accent" placeholder="Malnad Realty" />
        </div>
        <Field label="Button Label" settingKey="cta_cta_label" placeholder="Visit malnadrealty.com" />
      </Section>

      {/* Footer */}
      <Section title="Footer" desc="Content shown at the bottom of every page">
        <TextArea label="Footer Description" settingKey="footer_tagline" />
        <Field label="Copyright Name" settingKey="footer_copyright" placeholder="e.g. Malnad Realty" />
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Social Links</p>
          <Field label="Facebook URL" settingKey="footer_facebook" placeholder="https://facebook.com/malnadrealty" />
          <Field label="Instagram URL" settingKey="footer_instagram" placeholder="https://instagram.com/malnadrealty" />
          <Field label="YouTube URL" settingKey="footer_youtube" placeholder="https://youtube.com/@malnadrealty" />
        </div>
      </Section>

      {/* Contact */}
      <Section title="Contact Information" desc="Phone, email and address shown in the footer">
        <Field label="Phone" settingKey="contact_phone" placeholder="+91 99999 99999" />
        <Field label="Email" settingKey="contact_email" placeholder="info@malnadrealty.com" />
        <TextArea label="Address" settingKey="contact_address" />
      </Section>

      <MediaPicker
        open={picker.open}
        onClose={() => setPicker({ open: false, field: "" })}
        onSelect={(url) => {
          if (picker.field) set(picker.field as SettingKey, url);
          setPicker({ open: false, field: "" });
        }}
      />
    </div>
  );
}

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
      <div className="pb-4 border-b border-gray-50">
        <h2 className="font-bold text-black">{title}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      {children}
    </div>
  );
}

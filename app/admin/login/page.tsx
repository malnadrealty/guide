import { getSettings } from "@/lib/settings";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const settings = await getSettings();
  return (
    <LoginForm
      logoImageUrl={settings.logo_image_url || undefined}
      logoDarkUrl={settings.logo_dark_url || undefined}
    />
  );
}

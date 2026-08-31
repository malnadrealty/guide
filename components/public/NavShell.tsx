"use client";
import { useState } from "react";
import { BottomNav } from "@/components/public/BottomNav";
import { MobileMenu } from "@/components/public/MobileMenu";

interface Props {
  logoImageUrl?: string;
  logoDarkUrl?: string;
}

export function NavShell({ logoImageUrl, logoDarkUrl }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <BottomNav onMenuOpen={() => setMenuOpen(true)} />
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        logoImageUrl={logoImageUrl}
        logoDarkUrl={logoDarkUrl}
      />
    </>
  );
}

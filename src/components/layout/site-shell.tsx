"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileCTABar } from "@/components/layout/mobile-cta-bar";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { Tracker } from "@/components/shared/tracker";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAnalytics = pathname.startsWith("/analytics");
  const isHome = pathname === "/";

  if (isAnalytics) {
    return <>{children}</>;
  }

  if (isHome) {
    return (
      <>
        <Header />
        <main className="flex-1">{children}</main>
        <Tracker />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
      <MobileCTABar />
      <CookieConsent />
      <Tracker />
      {/* Bottom padding spacer for mobile CTA bar */}
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
}

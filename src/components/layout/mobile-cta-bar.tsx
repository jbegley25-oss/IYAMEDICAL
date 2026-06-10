"use client";

// Link replaced with <a>;
import { Phone } from "lucide-react";
import { siteConfig } from "@/content/site";

export function MobileCTABar() {
  return (
    <div suppressHydrationWarning className="fixed right-0 bottom-0 left-0 z-40 border-t border-gray-200 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.06)] md:hidden">
      <div className="flex gap-2 p-2">
        <a
          href={siteConfig.phoneHref}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-teal-700 text-sm font-semibold text-white transition-colors active:bg-teal-800"
        >
          <Phone className="size-4" />
          Call Now
        </a>
        <a
          href="/patient-forms"
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-teal-100 text-sm font-semibold text-teal-700 transition-colors active:bg-teal-200"
        >
          Book Online
        </a>
      </div>
    </div>
  );
}

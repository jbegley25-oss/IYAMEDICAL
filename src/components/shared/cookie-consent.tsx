"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "iya-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleChoice(choice: "accepted" | "declined") {
    localStorage.setItem(COOKIE_KEY, choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div suppressHydrationWarning className="fixed right-0 bottom-16 left-0 z-50 px-4 pb-2 md:bottom-0 md:pb-4">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 rounded-2xl bg-gray-900 px-5 py-4 shadow-xl sm:flex-row sm:gap-4">
        <p className="flex-1 text-sm leading-relaxed text-gray-300">
          We use cookies to improve your experience. By continuing, you agree to
          our{" "}
          <Link
            href="/privacy-policy"
            className="text-teal-400 underline underline-offset-2 hover:text-teal-300"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            onClick={() => handleChoice("declined")}
            variant="ghost"
            className="h-8 rounded-full px-4 text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-200"
          >
            Decline
          </Button>
          <Button
            onClick={() => handleChoice("accepted")}
            className="h-8 rounded-full bg-teal-600 px-4 text-xs font-semibold text-white shadow-none hover:bg-teal-700"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

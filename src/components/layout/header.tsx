"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Phone, ChevronDown, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/content/site";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeDropdown = useCallback(() => setOpenDropdown(null), []);

  return (
    <header
      suppressHydrationWarning
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-cyan-300/10 bg-slate-950/92 shadow-lg shadow-slate-950/30 backdrop-blur-xl"
          : "border-b border-white/10 bg-slate-950/78 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/icon.png"
            alt="IYA Medical"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg"
            priority
          />
          <span className="text-base font-bold tracking-tight whitespace-nowrap" style={{
            background: 'linear-gradient(90deg, #5eead4, #22d3ee, #818cf8, #a78bfa, #f472b6, #fb923c, #4ade80, #5eead4)',
            backgroundSize: '300% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'logo-gradient 8s ease infinite',
          }}>
            IYA Medical
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {siteConfig.navLinks.map((link) =>
            "children" in link && link.children ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-cyan-200"
                >
                  {link.label}
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-slate-500 transition-transform duration-200",
                      openDropdown === link.label && "rotate-180"
                    )}
                  />
                </Link>
                {openDropdown === link.label && (
                  <div className="absolute left-0 z-50 w-72 pt-2" style={{ top: '100%' }}>
                    <div className="rounded-xl border border-cyan-300/10 bg-slate-950/95 p-2 shadow-xl shadow-slate-950/50 backdrop-blur-xl">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeDropdown}
                          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-cyan-300/10 hover:text-cyan-100"
                        >
                          <ChevronRight className="size-3.5 text-cyan-300" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-cyan-200"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Desktop Right */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={siteConfig.phoneHref}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-300 transition-colors hover:text-cyan-200"
          >
            <Phone className="size-4" />
            {siteConfig.phone}
          </a>
          <a
            href="/patient-intake"
            className="inline-flex h-9 items-center rounded-full bg-cyan-300 px-5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
          >
            Start Intake
          </a>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={siteConfig.phoneHref}
            className="flex size-9 items-center justify-center rounded-lg text-slate-200"
          >
            <Phone className="size-5" />
          </a>
          <Sheet>
            <SheetTrigger
              className="inline-flex size-9 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-200 hover:bg-cyan-300/20"
            >
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto p-0">
              <SheetHeader className="border-b border-gray-100 p-4">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetClose
                  render={
                    <Link
                      href="/patient-forms"
                      className="inline-flex h-11 w-full items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white hover:bg-teal-700"
                    >
                      Start Intake
                    </Link>
                  }
                />
              </SheetHeader>

              <nav className="flex flex-col p-2">
                {siteConfig.navLinks.map((link) =>
                  "children" in link && link.children ? (
                    <Accordion key={link.label}>
                      <AccordionItem value={link.label} className="border-none">
                        <AccordionTrigger className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:no-underline">
                          {link.label}
                        </AccordionTrigger>
                        <AccordionContent className="pl-3">
                          {link.children.map((child) => (
                            <SheetClose
                              key={child.href}
                              render={
                                <Link
                                  href={child.href}
                                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-teal-50 hover:text-teal-700"
                                >
                                  <ChevronRight className="size-3.5 text-teal-500" />
                                  {child.label}
                                </Link>
                              }
                            />
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <SheetClose
                      key={link.label}
                      render={
                        <Link
                          href={link.href}
                          className="flex rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-teal-700"
                        >
                          {link.label}
                        </Link>
                      }
                    />
                  )
                )}
              </nav>

              {/* Mobile phone */}
              <div className="mt-auto border-t border-gray-100 p-4">
                <a
                  href={siteConfig.phoneHref}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600"
                >
                  <Phone className="size-4 text-teal-600" />
                  {siteConfig.phone}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

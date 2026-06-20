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
          ? "border-b border-[#37b5db]/20 bg-[#020513]/92 shadow-lg shadow-[#4d5bd6]/15 backdrop-blur-xl"
          : "border-b border-white/10 bg-[#020513]/72 backdrop-blur-xl"
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
            background: 'linear-gradient(90deg, #eb201b, #f5762c, #fed434, #a8e648, #4fd196, #37b5db, #4d5bd6, #ce2edf, #eb201b)',
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
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:text-[#37b5db]"
                >
                  {link.label}
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-[#4d5bd6]/60 transition-all duration-200",
                      openDropdown === link.label && "rotate-180 text-[#ce2edf]"
                    )}
                  />
                </Link>
                {openDropdown === link.label && (
                  <div className="absolute left-0 z-50 w-72 pt-2" style={{ top: '100%' }}>
                    <div className="rounded-xl border border-[#37b5db]/20 bg-[#020513]/95 p-2 shadow-xl shadow-[#4d5bd6]/20 backdrop-blur-xl">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeDropdown}
                          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-200 transition-colors hover:bg-[#37b5db]/10 hover:text-white"
                        >
                          <ChevronRight className="size-3.5 text-[#a8e648]" />
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
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:text-[#37b5db]"
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
            className="flex items-center gap-1.5 text-sm font-medium text-slate-200 transition-colors hover:text-[#37b5db]"
          >
            <Phone className="size-4" />
            {siteConfig.phone}
          </a>
          <a
            href="/patient-intake"
            className="inline-flex h-9 items-center rounded-full border border-white/20 bg-[linear-gradient(90deg,#fed434,#a8e648,#4fd196,#37b5db)] px-5 text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(55,181,219,0.22)] transition-opacity hover:opacity-90"
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
              className="inline-flex size-9 items-center justify-center rounded-lg border border-[#37b5db]/20 bg-[#37b5db]/10 text-[#37b5db] hover:bg-[#37b5db]/18"
            >
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto border-[#37b5db]/20 bg-[#020513] p-0 text-white">
              <SheetHeader className="border-b border-[#37b5db]/20 p-4">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetClose
                  render={
                    <Link
                      href="/patient-forms"
                      className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[linear-gradient(90deg,#fed434,#a8e648,#4fd196,#37b5db)] text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(55,181,219,0.22)] hover:opacity-90"
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
                        <AccordionTrigger className="rounded-lg px-3 py-3 text-sm font-medium text-slate-200 hover:bg-[#37b5db]/10 hover:text-white hover:no-underline">
                          {link.label}
                        </AccordionTrigger>
                        <AccordionContent className="pl-3">
                          {link.children.map((child) => (
                            <SheetClose
                              key={child.href}
                              render={
                                <Link
                                  href={child.href}
                                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-[#37b5db]/10 hover:text-white"
                                >
                                  <ChevronRight className="size-3.5 text-[#a8e648]" />
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
                          className="flex rounded-lg px-3 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-[#37b5db]/10 hover:text-white"
                        >
                          {link.label}
                        </Link>
                      }
                    />
                  )
                )}
              </nav>

              {/* Mobile phone */}
              <div className="mt-auto border-t border-[#37b5db]/20 p-4">
                <a
                  href={siteConfig.phoneHref}
                  className="flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-[#37b5db]"
                >
                  <Phone className="size-4 text-[#37b5db]" />
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

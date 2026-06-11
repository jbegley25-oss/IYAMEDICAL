'use client'

import { ArrowRight, ChevronDown } from 'lucide-react'
import { siteConfig } from '@/content/site'

export function ImmersiveHero() {
  return (
    <section className="relative flex min-h-[104vh] items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_40%,rgba(3,16,29,0.03)_0%,rgba(3,16,29,0.22)_46%,rgba(1,7,18,0.82)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-48 bg-gradient-to-b from-transparent via-[#010712]/50 to-[#010712]" />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.42em] text-cyan-200/90 sm:text-sm">
          IYA Medical
        </p>

        <h1 className="mx-auto mt-7 max-w-3xl text-5xl font-light leading-[0.96] tracking-tight text-white sm:text-7xl lg:text-8xl">
          Find your care.
          <br />
          <span className="text-cyan-200">Precisely.</span>
        </h1>

        <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Explore symptoms, procedures, and consultation paths with one guided flow.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#find-care"
            className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-cyan-200 px-8 text-base font-semibold text-slate-950 transition-all duration-300 hover:bg-orange-300 hover:shadow-[0_0_42px_rgba(251,146,60,0.38)]"
          >
            Find your care
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href={siteConfig.phoneHref}
            className="inline-flex h-13 items-center justify-center rounded-full border border-white/15 bg-white/[0.025] px-8 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-orange-300/60 hover:bg-orange-300/10 hover:text-orange-100"
          >
            {siteConfig.phone}
          </a>
        </div>
      </div>

      <a
        href="#find-care"
        aria-label="Scroll to find your care"
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 text-slate-500 transition-colors hover:text-orange-200"
      >
        <span className="text-xs font-medium uppercase tracking-widest">Explore</span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </a>
    </section>
  )
}

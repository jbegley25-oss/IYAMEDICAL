'use client'

import { HelixBuilder } from './helix-builder'

export function ImmersiveHero() {
  return (
    <section data-helix-scroll className="relative h-[118svh] overflow-visible">
      <div className="sticky top-0 min-h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_62%,rgba(56,78,130,0.22)_0%,rgba(8,13,31,0.18)_30%,rgba(1,4,12,0.0)_62%),radial-gradient(circle_at_45%_118%,rgba(124,58,237,0.13)_0%,rgba(1,4,12,0.0)_42%),linear-gradient(115deg,#01030a_0%,#020513_48%,#00030a_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[10vh] bg-gradient-to-t from-[#010712] via-[#010712]/60 to-transparent" />

        <div className="absolute inset-x-0 top-24 z-30 mx-auto flex max-w-5xl flex-col items-center px-6 text-center sm:top-28">
          <p className="max-w-4xl text-balance text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl">
            Arizona&apos;s Most Advanced Medical Practice
          </p>
          <p className="mt-4 text-base font-normal tracking-wide text-slate-200/90 sm:text-lg">
            Hyper-specialized and minimally invasive procedures. No down time. Only healing.
          </p>
          <a
            href="/patient-intake"
            className="mt-7 inline-flex animate-pulse items-center justify-center rounded-full border border-white/20 bg-white px-6 py-3 text-sm font-semibold tracking-wide text-slate-950 shadow-[0_0_34px_rgba(255,255,255,0.22)] transition hover:border-cyan-200 hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Now Accepting
          </a>
        </div>

        <div className="absolute inset-0 z-10">
          <HelixBuilder />
        </div>
      </div>
    </section>
  )
}

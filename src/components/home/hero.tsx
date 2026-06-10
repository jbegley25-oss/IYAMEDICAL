'use client'

import { ArrowRight, MapPin, Activity, ScanLine, ShieldCheck } from 'lucide-react'
import { siteConfig } from '@/content/site'

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-slate-950 pt-24 pb-16 sm:pt-32 sm:pb-24"
      suppressHydrationWarning
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(20,184,166,0.22),transparent_32%),radial-gradient(circle_at_84%_28%,rgba(56,189,248,0.18),transparent_30%),linear-gradient(135deg,#020617_0%,#0f172a_45%,#042f2e_100%)]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Advanced Multi-Specialty Care
            </p>

            <h1 className="mt-6 text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.1]">
              Precision care,{' '}
              <span className="text-cyan-300">guided by imaging.</span>
              <br />
              <span className="font-semibold">Built around people.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              {siteConfig.description} Board-certified physicians delivering
              minimally invasive treatments with faster recovery times.
            </p>

            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {[
                ['Image-guided', ScanLine],
                ['Same-day care', Activity],
                ['Lower downtime', ShieldCheck],
              ].map(([label, Icon]) => {
                const TypedIcon = Icon as typeof Activity
                return (
                  <div
                    key={label as string}
                    className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 hover:border-cyan-300/60 hover:bg-cyan-300/10"
                  >
                    <TypedIcon className="h-5 w-5 text-cyan-300 transition-colors duration-300 group-hover:text-emerald-300" />
                    <p className="mt-3 text-sm font-semibold text-white">{label as string}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="/patient-intake"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-cyan-300 px-8 text-base font-semibold text-slate-950 transition-all duration-300 hover:bg-emerald-300 hover:shadow-[0_0_34px_rgba(45,212,191,0.35)]"
              >
                Start Patient Intake
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/locations"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-white/15 px-8 text-base font-semibold text-white transition-all duration-300 hover:border-cyan-300/70 hover:bg-cyan-300/10 hover:text-cyan-100"
              >
                <MapPin className="h-4 w-4" />
                Search Locations
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/40 transition-all duration-500 hover:border-cyan-300/50 hover:shadow-cyan-500/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_42%,rgba(34,211,238,0.22),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%)]" />
              <div className="relative flex h-full flex-col justify-between rounded-2xl border border-cyan-300/15 bg-slate-950/70 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
                      Procedure Suite
                    </p>
                    <p className="mt-1 text-sm text-slate-400">Live imaging guidance</p>
                  </div>
                  <div className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                    Active
                  </div>
                </div>

                <div className="relative mx-auto flex aspect-square w-[78%] items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/[0.03] transition-transform duration-500 group-hover:scale-[1.03]">
                  <div className="absolute inset-[13%] rounded-full border border-cyan-300/20" />
                  <div className="absolute inset-[26%] rounded-full border border-emerald-300/20" />
                  <div className="absolute h-[1px] w-full bg-cyan-300/35" />
                  <div className="absolute h-full w-[1px] bg-cyan-300/35" />
                  <div className="absolute h-[64%] w-[64%] rounded-full bg-[conic-gradient(from_130deg,transparent,rgba(34,211,238,0.28),transparent_38%)] transition-transform duration-700 group-hover:rotate-45" />
                  <div className="relative h-20 w-20 rounded-full border border-cyan-200/50 bg-slate-950 shadow-[0_0_34px_rgba(34,211,238,0.28)]">
                    <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(110,231,183,0.8)]" />
                  </div>
                  <div className="absolute right-[16%] top-[28%] h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.85)]" />
                  <div className="absolute bottom-[20%] left-[22%] h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.85)]" />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {['Map vessels', 'Target area', 'Treat precisely'].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs font-medium text-slate-300 transition-colors duration-300 group-hover:border-cyan-300/25 group-hover:text-cyan-100"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-3xl bg-cyan-300/10 blur-sm" />
          </div>
        </div>
      </div>
    </section>
  )
}

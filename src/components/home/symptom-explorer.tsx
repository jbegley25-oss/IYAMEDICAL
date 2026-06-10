'use client'

import { useMemo, useState } from 'react'
import {
  Footprints,
  PersonStanding,
  Activity,
  Venus,
  Mars,
  Ribbon,
  Wind,
  Droplets,
  Brain,
  Stethoscope,
  Search,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  CalendarCheck,
  CircleHelp,
  type LucideIcon,
} from 'lucide-react'
import { bodyAreas, allConcerns, type BodyArea, type Concern } from '@/content/conditions'
import { siteConfig } from '@/content/site'

const iconMap: Record<string, LucideIcon> = {
  Footprints,
  PersonStanding,
  Activity,
  Venus,
  Mars,
  Ribbon,
  Wind,
  Droplets,
  Brain,
  Stethoscope,
}

export function SymptomExplorer() {
  const [area, setArea] = useState<BodyArea | null>(null)
  const [query, setQuery] = useState('')

  // Free-text search across every concern in the catalog.
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    return allConcerns
      .filter(
        (c) =>
          c.label.toLowerCase().includes(q) ||
          c.condition.toLowerCase().includes(q) ||
          c.detail.toLowerCase().includes(q) ||
          c.areaLabel.toLowerCase().includes(q)
      )
      .slice(0, 6)
  }, [query])

  const searching = query.trim().length >= 2

  return (
    <section className="relative overflow-hidden bg-transparent py-20 sm:py-28" id="find-care">
      {/* Ambient glow — decorative only, never hides content */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.08),transparent_45%),radial-gradient(circle_at_80%_90%,rgba(251,146,60,0.08),transparent_42%),linear-gradient(to_bottom,rgba(1,7,18,0.24),rgba(1,7,18,0.72)_34%,rgba(1,7,18,0.94))]" />

      <div className="relative mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Find your care
          </p>
          <h2 className="mt-4 text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
            What&apos;s bothering you?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
            Tell us where it hurts. We&apos;ll show you the condition it points to and
            the minimally invasive treatment that can help.
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mt-10 max-w-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your symptom — e.g. leg pain, heavy periods, knee"
            className="h-14 w-full rounded-full border border-white/10 bg-[#03101d]/70 pl-12 pr-4 text-base text-white shadow-[0_24px_80px_rgba(0,0,0,0.26)] outline-none backdrop-blur-md transition placeholder:text-slate-500 focus:border-orange-300/60 focus:bg-[#061a2e]/78"
            />
          </div>
        </div>

        {/* ── Search results ─────────────────────────────── */}
        {searching && (
          <div className="mx-auto mt-8 max-w-2xl space-y-3">
            {searchResults.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-slate-300">
                <p>No direct match — but we treat far more than this list.</p>
                <a
                  href="/patient-intake"
                  className="mt-3 inline-flex items-center gap-2 font-semibold text-cyan-300 hover:text-emerald-300"
                >
                  Tell us about your case <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ) : (
              searchResults.map((c, i) => (
                <ConcernCard key={c.procedureSlug + c.label} concern={c} index={i} />
              ))
            )}
          </div>
        )}

        {/* ── Body-area browse (hidden while searching) ──── */}
        {!searching && !area && (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {bodyAreas.map((a, i) => {
              const Icon = iconMap[a.icon] ?? CircleHelp
              return (
                <button
                  key={a.id}
                  onClick={() => setArea(a)}
                  style={{ animationDelay: `${i * 45}ms` }}
                  className="group flex animate-[slide-up_0.45s_ease-out_both] flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#03101d]/64 p-5 text-center shadow-[0_18px_70px_rgba(0,0,0,0.18)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300/50 hover:bg-orange-300/[0.08] active:scale-[0.97]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/20 bg-slate-950/60 text-cyan-300 transition-colors group-hover:border-orange-300/50 group-hover:text-orange-200">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-semibold leading-tight text-white">
                    {a.label}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* ── Selected area → its concerns ───────────────── */}
        {!searching && area && (
          <div className="mt-12">
            <button
              onClick={() => setArea(null)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition-colors hover:text-cyan-300"
            >
              <ArrowLeft className="h-4 w-4" /> All areas
            </button>

            <div className="mt-5 flex items-center gap-4">
              {(() => {
                const Icon = iconMap[area.icon] ?? CircleHelp
                return (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-cyan-300">
                    <Icon className="h-6 w-6" />
                  </span>
                )
              })()}
              <div>
                <h3 className="text-xl font-semibold text-white">{area.label}</h3>
                <p className="text-sm text-slate-400">{area.blurb}</p>
              </div>
            </div>

            <div key={area.id} className="mt-6 space-y-3">
              {area.concerns.map((c, i) => (
                <ConcernCard key={c.procedureSlug + c.label} concern={c} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Reassurance footer */}
        <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-slate-500">
          Not sure where you fit? That&apos;s what a consultation is for.{' '}
          <a href={siteConfig.phoneHref} className="font-medium text-cyan-300 hover:text-orange-200">
            Call {siteConfig.phone}
          </a>{' '}
          and we&apos;ll point you the right way.
        </p>
      </div>
    </section>
  )
}

function ConcernCard({ concern, index = 0 }: { concern: Concern; index?: number }) {
  return (
    <div
      style={{ animationDelay: `${index * 60}ms` }}
      className="group animate-[slide-up_0.4s_ease-out_both] rounded-2xl border border-white/10 bg-[#03101d]/68 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.16)] backdrop-blur-md transition-all duration-200 hover:border-orange-300/40 hover:bg-orange-300/[0.055]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-base font-semibold text-white">{concern.label}</p>
          <p className="mt-1 text-sm text-slate-400">{concern.detail}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-cyan-300">
            Likely: {concern.condition}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={`/procedures/${concern.procedureSlug}`}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/15 px-4 text-sm font-semibold text-white transition-colors hover:border-orange-300/60 hover:text-orange-100"
          >
            See the fix <ChevronRight className="h-4 w-4" />
          </a>
          <a
            href="/patient-intake"
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-cyan-200 px-4 text-sm font-semibold text-slate-950 transition-colors hover:bg-orange-300"
          >
            <CalendarCheck className="h-4 w-4" /> Book
          </a>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/lib/use-in-view'
import { Star, Quote } from 'lucide-react'
import { testimonials } from '@/content/testimonials'

export function TestimonialsMasonry() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section suppressHydrationWarning ref={ref} className="bg-slate-900 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Patient Stories
          </p>
          <h2 className="mt-4 text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
            Journeys of{' '}
            <span className="font-semibold">healing and trust</span>
          </h2>
          <p className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Real patients, real results. See why thousands trust IYA Medical for their care.
          </p>
        </motion.div>

        {/* Simple grid of testimonial cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/45 hover:bg-emerald-300/10 hover:shadow-[0_18px_55px_rgba(16,185,129,0.12)]"
            >
              <Quote className="h-6 w-6 text-cyan-300/50 mb-4 transition-colors duration-300 group-hover:text-emerald-300" />

              <p className="text-slate-300 leading-relaxed text-[15px] transition-colors duration-300 group-hover:text-white">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Rating */}
              <div className="flex gap-0.5 mt-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`h-4 w-4 ${j < (t.rating ?? 5) ? 'text-amber-300 fill-amber-300' : 'text-slate-700'}`}
                  />
                ))}
              </div>

              {/* Author */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="font-semibold text-white">{t.name}</p>
                {t.condition && (
                  <p className="text-xs text-cyan-300 mt-0.5">{t.condition}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

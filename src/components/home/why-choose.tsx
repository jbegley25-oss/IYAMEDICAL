'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/lib/use-in-view'
import { CalendarCheck, Building2, FileCheck, ArrowRight } from 'lucide-react'

const steps = [
  {
    step: 'Step 1',
    icon: CalendarCheck,
    title: 'Book Your Visit',
    description:
      'Schedule online or by phone. Complete your intake forms from the comfort of home before your appointment.',
    href: '/patient-intake',
    linkText: 'Start intake',
    bg: 'bg-teal-50',
  },
  {
    step: 'Step 2',
    icon: Building2,
    title: 'Visit Our Office',
    description:
      'Meet with your specialist for a thorough evaluation. Most procedures are performed same-day on an outpatient basis.',
    href: '/locations',
    linkText: 'Find a location',
    bg: 'bg-cyan-50',
  },
  {
    step: 'Step 3',
    icon: FileCheck,
    title: 'Get Your Results',
    description:
      'Return home the same day with a clear recovery plan. Our team follows up to ensure your optimal outcome.',
    href: '/contact',
    linkText: 'Contact us',
    bg: 'bg-emerald-50',
  },
]

export function WhyChoose() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section suppressHydrationWarning ref={ref} className="bg-slate-950 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            How It Works
          </p>
          <h2 className="mt-4 text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
            Planning your visit,{' '}
            <span className="font-semibold">made simple</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400 leading-relaxed">
            From your first call to full recovery, we make every step accessible and stress-free.
          </p>
        </motion.div>

        {/* 3 Step Cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-cyan-300/10 hover:shadow-[0_18px_55px_rgba(34,211,238,0.12)]"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-300 transition-colors duration-300 group-hover:text-emerald-300">
                  {item.step}
                </span>

                <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-slate-950/70 shadow-sm transition-colors duration-300 group-hover:border-emerald-300/40 group-hover:bg-emerald-300/10">
                  <Icon className="h-6 w-6 text-cyan-300 transition-colors duration-300 group-hover:text-emerald-300" />
                </div>

                <h3 className="mt-5 text-xl font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-slate-400 transition-colors duration-300 group-hover:text-slate-200">
                  {item.description}
                </p>

                <a
                  href={item.href}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 transition-colors group-hover:text-emerald-300"
                >
                  {item.linkText}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/lib/use-in-view'
import { ArrowRight, Phone } from 'lucide-react'
import { siteConfig } from '@/content/site'

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section suppressHydrationWarning ref={ref} className="relative overflow-hidden bg-slate-950 py-20 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.2),transparent_35%),linear-gradient(135deg,#042f2e,#020617_65%)]" />
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
            Schedule your{' '}
            <span className="font-semibold">appointment today</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-teal-100/80 leading-relaxed">
            Most procedures are performed on a same-day, outpatient basis. Get back to your life
            faster with minimally invasive treatments from Arizona&apos;s leading interventional
            radiology team.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <a
            href="/patient-intake"
            className="inline-flex h-13 items-center gap-2.5 rounded-full bg-cyan-300 px-8 text-base font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
          >
            Start Patient Intake
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href={siteConfig.phoneHref}
            className="inline-flex h-13 items-center gap-2.5 rounded-full border border-white/20 px-8 text-base font-semibold text-white transition-colors hover:border-cyan-300/70 hover:bg-cyan-300/10"
          >
            <Phone className="h-4 w-4" />
            {siteConfig.phone}
          </a>
        </motion.div>
      </div>
    </section>
  )
}

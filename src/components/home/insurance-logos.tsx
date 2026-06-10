'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from '@/lib/use-in-view'
import { insuranceProviders } from '@/content/insurance'

export function InsuranceLogos() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section suppressHydrationWarning ref={ref} className="bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Insurance
          </p>
          <h2 className="mt-3 text-2xl font-light tracking-tight text-white sm:text-3xl">
            Accepted insurance{' '}
            <span className="font-semibold">partners</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            We accept most major insurance plans. Contact us to verify your coverage.
          </p>
        </motion.div>

        {/* Logo Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 grid grid-cols-3 gap-6 sm:grid-cols-4 lg:grid-cols-6"
        >
          {insuranceProviders.map((provider) => (
            <div
              key={provider.name}
              className="group flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-300/10"
            >
              <div className="relative h-10 w-full opacity-85 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0">
                <Image
                  src={provider.logoPath}
                  alt={provider.name}
                  fill
                  className="object-contain"
                  sizes="120px"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

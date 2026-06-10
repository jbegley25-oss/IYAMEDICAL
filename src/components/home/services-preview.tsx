'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from '@/lib/use-in-view'
import { useRef } from 'react'
import { CheckCircle, ArrowRight } from 'lucide-react'

const benefits = [
  'Minimally invasive image-guided procedures',
  'Same-day outpatient treatments',
  'Faster recovery with less pain',
  'No general anesthesia required',
  'Board-certified interventional radiologists',
  'State-of-the-art imaging technology',
]

export function ServicesPreview() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section suppressHydrationWarning ref={ref} className="bg-slate-900 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
              <Image
                src="/images/facility-interior.jpg"
                alt="IYA Medical state-of-the-art facility"
                fill
                className="object-cover opacity-55 saturate-75 transition-all duration-500 group-hover:scale-105 group-hover:opacity-75 group-hover:saturate-100"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/25 to-cyan-300/20" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-5 backdrop-blur-md transition-colors duration-300 group-hover:border-emerald-300/40">
                <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Precision Workflow</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Imaging, access, treatment, and recovery in one focused outpatient path.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Why Interventional Radiology
            </p>
            <h2 className="mt-4 text-3xl font-light tracking-tight text-white sm:text-4xl">
              Minimally invasive,{' '}
              <span className="font-semibold">maximum results</span>
            </h2>
            <p className="mt-5 text-lg text-slate-400 leading-relaxed">
              Interventional radiology replaces traditional surgery with precision image-guided
              procedures. Smaller incisions mean less pain, lower risk, and dramatically faster
              recovery times.
            </p>

            <ul className="mt-8 space-y-4">
              {benefits.map((benefit, i) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className="group flex items-start gap-3 rounded-xl border border-transparent p-2 transition-colors duration-300 hover:border-cyan-300/20 hover:bg-cyan-300/10"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-300 transition-colors duration-300 group-hover:text-emerald-300" />
                  <span className="text-slate-300">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-10">
              <a
                href="/services"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-7 py-3 text-base font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
              >
                Explore Our Services
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

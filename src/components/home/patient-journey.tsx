'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/lib/use-in-view'
import { ClipboardList, Stethoscope, Syringe, HeartPulse } from 'lucide-react'

const steps = [
  {
    icon: ClipboardList,
    title: 'Schedule',
    description:
      'Book your appointment online or by phone. Complete intake forms from the comfort of home.',
    color: 'from-teal-500 to-teal-600',
  },
  {
    icon: Stethoscope,
    title: 'Consultation',
    description:
      'Meet with your specialist for a thorough evaluation and personalized treatment plan.',
    color: 'from-teal-600 to-emerald-600',
  },
  {
    icon: Syringe,
    title: 'Treatment',
    description:
      'Same-day outpatient procedures using minimally invasive, image-guided techniques.',
    color: 'from-emerald-600 to-cyan-600',
  },
  {
    icon: HeartPulse,
    title: 'Recovery',
    description:
      'Return home the same day with a comprehensive follow-up care plan for optimal recovery.',
    color: 'from-cyan-600 to-teal-500',
  },
]

export function PatientJourney() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section suppressHydrationWarning ref={ref} className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-teal-600">
            How It Works
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your Path to Better Health
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            From your first call to full recovery, we make every step simple and stress-free.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Connecting line (desktop) */}
          <div className="absolute top-14 left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] hidden lg:block">
            <div className="h-0.5 w-full bg-gradient-to-r from-teal-200 via-emerald-300 to-teal-200" />
          </div>

          {/* Connecting line (mobile/tablet) */}
          <div className="absolute top-0 bottom-0 left-7 hidden w-0.5 bg-gradient-to-b from-teal-200 via-emerald-300 to-teal-200 sm:max-lg:block" />

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Step number + icon */}
                  <div className="relative">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-teal-700 shadow-md ring-2 ring-teal-100">
                      {i + 1}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-gray-900">{step.title}</h3>
                  <p className="mt-2 max-w-[240px] text-sm leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

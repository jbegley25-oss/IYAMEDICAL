'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from '@/lib/use-in-view'
import { ArrowRight } from 'lucide-react'
import { procedures } from '@/content/procedures'
import { siteConfig } from '@/content/site'

const displayProcedures = procedures.slice(0, 12)

export function ConditionsList() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section suppressHydrationWarning ref={ref} className="bg-gray-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-teal-600">
            Procedures
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {siteConfig.sections.procedures.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            {siteConfig.sections.procedures.description}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {displayProcedures.map((procedure, i) => (
            <motion.div
              key={procedure.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }}
            >
              <a
                href={`/procedures/${procedure.slug}`}
                className="group flex items-center justify-between rounded-xl bg-white px-5 py-4 ring-1 ring-gray-900/5 transition-all duration-200 hover:bg-teal-50 hover:ring-teal-200 hover:shadow-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 group-hover:text-teal-700 transition-colors">
                    {procedure.title}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-gray-500">
                    {procedure.shortDescription}
                  </p>
                </div>
                <ArrowRight className="ml-3 h-4 w-4 flex-shrink-0 text-gray-400 transition-all group-hover:text-teal-600 group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 text-center"
        >
          <Link
            href="/procedures"
            className="inline-flex items-center gap-2 text-base font-semibold text-teal-600 transition-colors hover:text-teal-500"
          >
            View All Procedures
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

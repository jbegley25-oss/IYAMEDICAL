'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from '@/lib/use-in-view'
import { ArrowRight } from 'lucide-react'
import { doctors } from '@/content/doctors'

// Dr. Iya Agha is a resident not seeing patients — filter out
const displayDoctors = doctors.filter(d => d.id !== 'dr-iya-agha')

export function DoctorCards() {
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
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Expert Care
          </p>
          <h2 className="mt-4 text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
            Trusted interpretation from{' '}
            <span className="font-semibold">subspecialty experts</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400 leading-relaxed">
            Board-certified specialists delivering compassionate, cutting-edge medical care
          </p>
        </motion.div>

        {/* Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {displayDoctors.map((doctor, i) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
            >
              <a
                href={`/doctors/${doctor.id}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-cyan-300/10 hover:shadow-[0_22px_60px_rgba(34,211,238,0.14)]"
              >
                {/* Photo */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-800 to-cyan-950">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover object-top opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white">{doctor.name}</h3>
                  <p className="mt-1 text-sm font-medium text-cyan-300">
                    {doctor.title} &middot; {doctor.specialty}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
                      {doctor.specialty}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                      {doctor.title}
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-2 text-sm text-slate-400 leading-relaxed transition-colors duration-300 group-hover:text-slate-200">{doctor.bio}</p>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 transition-colors group-hover:text-emerald-300">
                    View Profile
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

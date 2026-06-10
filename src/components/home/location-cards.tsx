'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/lib/use-in-view'
import { MapPin, Phone, Navigation } from 'lucide-react'
import { locations } from '@/content/locations'
import { siteConfig } from '@/content/site'

export function LocationCards() {
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
            Locations
          </p>
          <h2 className="mt-4 text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
            {siteConfig.sections.locations.title}
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location, i) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/45 hover:bg-cyan-300/10 hover:shadow-[0_18px_55px_rgba(34,211,238,0.12)]"
            >
              {/* Map Embed */}
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <iframe
                  src={location.mapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of IYA Medical ${location.name}`}
                  className="h-full w-full grayscale transition-all duration-500 group-hover:grayscale-0"
                />
              </div>

              {/* Card Content */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 transition-colors duration-300 group-hover:border-emerald-300/40 group-hover:bg-emerald-300/10">
                    <MapPin className="h-5 w-5 text-cyan-300 transition-colors duration-300 group-hover:text-emerald-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{location.name}</h3>
                </div>

                <p className="mt-4 text-sm text-slate-400 leading-relaxed transition-colors duration-300 group-hover:text-slate-200">
                  {location.address}
                  <br />
                  {location.city}, {location.state} {location.zip}
                </p>

                <a
                  href={`tel:+1${location.phone.replace(/\D/g, '')}`}
                  className="mt-3 flex items-center gap-2 text-sm font-medium text-cyan-300 transition-colors hover:text-emerald-300"
                >
                  <Phone className="h-4 w-4" />
                  {location.phone}
                </a>

                <a
                  href={location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-950/50 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-emerald-300/50 hover:bg-emerald-300 hover:text-slate-950"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

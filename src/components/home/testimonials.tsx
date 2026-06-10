'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/lib/use-in-view'
import { Star, Quote, Play } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { testimonials } from '@/content/testimonials'
import { siteConfig } from '@/content/site'

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

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
            Patient Stories
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {siteConfig.sections.testimonial.title}
          </h2>
        </motion.div>

        {/* Horizontal scroll container */}
        <div className="mt-14 -mx-6 px-6">
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                className="w-[340px] flex-shrink-0 snap-start"
              >
                <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
                  {/* Video thumbnail */}
                  {t.videoId && (
                    <button
                      onClick={() => setActiveVideo(t.videoId)}
                      className="group relative mb-5 aspect-video w-full overflow-hidden rounded-xl bg-gray-100"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${t.videoId}/mqdefault.jpg`}
                        alt={`${t.name} video testimonial`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                          <Play className="h-6 w-6 text-teal-600 ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Quote icon */}
                  <Quote className="h-8 w-8 text-teal-500/20" />

                  {/* Quote text */}
                  <p className="mt-3 flex-1 text-gray-700 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Rating */}
                  <div className="mt-4 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        className={`h-4 w-4 ${starIdx < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="mt-3 border-t pt-3">
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.condition}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Dialog */}
      <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-black">
          <DialogTitle className="sr-only">Patient Video Testimonial</DialogTitle>
          {activeVideo && (
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

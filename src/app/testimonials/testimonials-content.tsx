'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Play, X } from 'lucide-react'
import { testimonials } from '@/content/testimonials'

function StarRating({ rating }: { rating: number }) {
  return (
    <div suppressHydrationWarning className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

function VideoModal({
  videoId,
  onClose,
}: {
  videoId: string
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-4xl">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
          aria-label="Close video"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            width="100%"
            height="100%"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-xl"
            title="Patient testimonial video"
          />
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsContent() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  const featuredTestimonial = testimonials.find((t) => t.videoId)

  return (
    <>
      {/* Hero Section */}
      <section className="page-hero relative bg-gradient-to-br from-teal-600 to-teal-800 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Patient Testimonials
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-teal-100">
            Journeys of Healing And Trust From Our Patients
          </p>
        </div>
      </section>

      {/* Featured Video */}
      {featuredTestimonial?.videoId && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
              Watch Our Patients&apos; Stories
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 overflow-hidden rounded-xl shadow-lg"
            >
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${featuredTestimonial.videoId}`}
                  width="100%"
                  height="100%"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-xl"
                  title={`Testimonial from ${featuredTestimonial.name}`}
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Testimonial Grid */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            What Our Patients Say
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative rounded-xl bg-white p-6 shadow-sm"
              >
                <StarRating rating={testimonial.rating} />
                <blockquote className="mt-4 text-gray-600 leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.condition}</p>
                  </div>
                  {testimonial.videoId && (
                    <button
                      onClick={() => setActiveVideo(testimonial.videoId)}
                      className="flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-600 transition-colors hover:bg-teal-100"
                      aria-label={`Watch ${testimonial.name}'s video`}
                    >
                      <Play className="h-3 w-3" />
                      Watch
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal videoId={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </>
  )
}

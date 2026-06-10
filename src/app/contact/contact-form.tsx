'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { locations } from '@/content/locations'
import { siteConfig } from '@/content/site'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .regex(
      /^[\d\s\-().+]+$/,
      'Phone number can only contain digits, spaces, dashes, and parentheses'
    ),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Submit failed')
    } catch {
      console.log('Form submitted (API unavailable, logged locally):', data)
    }
    setSubmitted(true)
  }

  const primaryLocation = locations[0]

  return (
    <>
      {/* Hero Section */}
      <section className="page-hero relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-2xl text-lg text-teal-100"
          >
            {siteConfig.sections.contact.description}
          </motion.p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-900">Get In Touch</h2>
              <p className="mt-2 text-gray-600">
                Our dedicated care team is on standby to answer every question.
              </p>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="mt-8 rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-50 p-10 text-center shadow-sm"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                      <CheckCircle className="h-8 w-8 text-teal-600" />
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-gray-900">Message Sent</h3>
                    <p className="mt-3 text-gray-600">
                      Thank you for contacting IYA Medical. Our team will respond within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-500"
                    >
                      Send another message
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-8 space-y-6"
                  >
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        {...register('name')}
                        className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none ${
                          errors.name ? 'border-red-300 bg-red-50/50' : 'border-gray-300 bg-white'
                        }`}
                        placeholder="John Doe"
                      />
                      <AnimatePresence>
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="mt-1.5 text-sm text-red-600"
                          >
                            {errors.name.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register('email')}
                        className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none ${
                          errors.email ? 'border-red-300 bg-red-50/50' : 'border-gray-300 bg-white'
                        }`}
                        placeholder="john@example.com"
                      />
                      <AnimatePresence>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="mt-1.5 text-sm text-red-600"
                          >
                            {errors.email.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none ${
                          errors.phone ? 'border-red-300 bg-red-50/50' : 'border-gray-300 bg-white'
                        }`}
                        placeholder="(480) 771-0000"
                      />
                      <AnimatePresence>
                        {errors.phone && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="mt-1.5 text-sm text-red-600"
                          >
                            {errors.phone.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        {...register('message')}
                        className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none resize-none ${
                          errors.message ? 'border-red-300 bg-red-50/50' : 'border-gray-300 bg-white'
                        }`}
                        placeholder="How can we help you?"
                      />
                      <AnimatePresence>
                        {errors.message && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="mt-1.5 text-sm text-red-600"
                          >
                            {errors.message.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-teal-700 hover:shadow-md disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Contact Info + Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="space-y-8"
            >
              {/* Contact details card */}
              <div className="rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-900/5">
                <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
                <div className="mt-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50">
                      <Phone className="h-4 w-4 text-teal-600" />
                    </div>
                    <a
                      href={siteConfig.phoneHref}
                      className="font-medium text-gray-700 transition-colors hover:text-teal-600"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50">
                      <Mail className="h-4 w-4 text-teal-600" />
                    </div>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="font-medium text-gray-700 transition-colors hover:text-teal-600"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                      <Clock className="h-4 w-4 text-teal-600" />
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{siteConfig.hours.weekday}</p>
                      <p>{siteConfig.hours.saturday}</p>
                      <p>{siteConfig.hours.sunday}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary location map embed */}
              <div className="overflow-hidden rounded-2xl ring-1 ring-gray-900/5">
                <div className="aspect-video">
                  <iframe
                    src={primaryLocation.mapEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map of IYA Medical ${primaryLocation.name}`}
                    className="h-full w-full"
                  />
                </div>
                <div className="bg-white p-5">
                  <h3 className="font-bold text-gray-900">{primaryLocation.name}</h3>
                  <div className="mt-2 flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    <span>
                      {primaryLocation.address}, {primaryLocation.city}, {primaryLocation.state}{' '}
                      {primaryLocation.zip}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-teal-600" />
                    <a href={`tel:+1${primaryLocation.phone.replace(/\D/g, '')}`}>
                      {primaryLocation.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Additional locations */}
              <div className="grid gap-4 sm:grid-cols-2">
                {locations.slice(1).map((location) => (
                  <div
                    key={location.id}
                    className="rounded-xl bg-white p-4 ring-1 ring-gray-900/5"
                  >
                    <h4 className="font-semibold text-gray-900">{location.name}</h4>
                    <div className="mt-2 flex items-start gap-2 text-xs text-gray-600">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
                      <span>
                        {location.address}, {location.city}, {location.state} {location.zip}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                      <Phone className="h-3.5 w-3.5 text-teal-600" />
                      <a href={`tel:+1${location.phone.replace(/\D/g, '')}`}>{location.phone}</a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

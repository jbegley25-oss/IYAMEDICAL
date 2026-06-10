import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { doctors } from '@/content/doctors'

export const metadata: Metadata = {
  title: 'Our Physicians | Board-Certified Specialists',
  description:
    'Meet the board-certified physicians at IYA Medical. Specialists in interventional radiology, neurology, internal medicine, and dermatology providing expert care in Scottsdale, AZ.',
  openGraph: {
    title: 'Our Physicians | Board-Certified Specialists at IYA Medical',
    description:
      'Meet our team of board-certified specialists in interventional radiology, neurology, internal medicine, and dermatology in Scottsdale.',
    url: 'https://iyamedical.com/doctors',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'IYA Medical Physicians' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Physicians | Board-Certified Specialists at IYA Medical',
    description:
      'Meet our board-certified specialists in interventional radiology, neurology, and internal medicine.',
    images: ['/og-image.png'],
  },
}

export default function DoctorsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="page-hero relative bg-gradient-to-br from-teal-600 to-teal-800 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Our Doctors
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-teal-100">
            Qualified Medical Professionals. Your Health is Our Priority.
          </p>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900">{doctor.name}</h2>
                  <p className="mt-1 text-sm font-medium text-teal-600">{doctor.specialty}</p>
                  <p className="mt-3 text-sm text-gray-600 line-clamp-3">{doctor.bio}</p>
                  <Link
                    href={`/doctors/${doctor.id}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 transition-colors hover:text-teal-700"
                  >
                    View Profile
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

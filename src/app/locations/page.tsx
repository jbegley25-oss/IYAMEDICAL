import type { Metadata } from 'next'
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react'
import { locations } from '@/content/locations'
import { siteConfig } from '@/content/site'

export const metadata: Metadata = {
  title: 'Locations | 3 Scottsdale Offices',
  description:
    'Find IYA Medical near you. Three convenient locations in Scottsdale, AZ offering interventional radiology, neurology, and primary care services. Open Monday-Saturday.',
  openGraph: {
    title: 'Locations | 3 Scottsdale Offices | IYA Medical',
    description:
      'Three convenient Scottsdale locations for interventional radiology, neurology, and primary care. Open Monday-Saturday.',
    url: 'https://iyamedical.com/locations',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'IYA Medical Locations' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Locations | 3 Scottsdale Offices | IYA Medical',
    description:
      'Three convenient Scottsdale, AZ locations for interventional radiology, neurology, and primary care.',
    images: ['/og-image.png'],
  },
}

export default function LocationsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="page-hero relative bg-gradient-to-br from-teal-600 to-teal-800 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Our Locations
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-teal-100">
            Find Our Locations Near You
          </p>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {locations.map((location) => (
              <div
                key={location.id}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
              >
                {/* Map Embed */}
                <div className="aspect-video">
                  <iframe
                    src={location.mapEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map of IYA Medical ${location.name}`}
                  />
                </div>

                {/* Info */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    IYA Medical &mdash; {location.name}
                  </h2>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-start gap-3 text-sm text-gray-600">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                      <span>
                        {location.address}
                        <br />
                        {location.city}, {location.state} {location.zip}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone className="h-4 w-4 shrink-0 text-teal-600" />
                      <a
                        href={`tel:+1${location.phone.replace(/\D/g, '')}`}
                        className="hover:text-teal-600"
                      >
                        {location.phone}
                      </a>
                    </div>

                    <div className="flex items-start gap-3 text-sm text-gray-600">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                      <div>
                        <p>{siteConfig.hours.weekday}</p>
                        <p>{siteConfig.hours.saturday}</p>
                        <p>{siteConfig.hours.sunday}</p>
                      </div>
                    </div>
                  </div>

                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Get Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

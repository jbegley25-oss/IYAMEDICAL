import type { Metadata } from 'next'
import { Mail, Briefcase, MapPin } from 'lucide-react'
import { careerPositions } from '@/content/careers'
import { siteConfig } from '@/content/site'

export const metadata: Metadata = {
  title: 'Careers | Join Our Medical Team in Scottsdale',
  description:
    'Join the IYA Medical team in Scottsdale, AZ. Open positions for medical assistants, front desk staff, radiology technologists, and more. Competitive benefits and growth opportunities.',
  openGraph: {
    title: 'Careers | Join Our Medical Team at IYA Medical',
    description:
      'Explore career opportunities at IYA Medical. Open positions in Scottsdale, AZ with competitive benefits.',
    url: 'https://iyamedical.com/careers',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Careers at IYA Medical' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers | Join Our Medical Team at IYA Medical',
    description:
      'Explore career opportunities at IYA Medical in Scottsdale, AZ. Competitive benefits and growth.',
    images: ['/og-image.png'],
  },
}

export default function CareersPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="page-hero relative bg-gradient-to-br from-teal-600 to-teal-800 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Join Our Team
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-teal-100">
            Build your career with one of Scottsdale&apos;s leading medical practices.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Career Opportunities at IYA Medical
            </h2>
            <p className="mt-4 text-gray-600">
              At IYA Medical, we are committed to building a team of dedicated professionals who
              share our passion for patient care and medical excellence. We offer competitive
              compensation, a supportive work environment, and the opportunity to work alongside
              leading physicians in interventional radiology.
            </p>
          </div>

          {/* Positions */}
          <div className="mt-12 space-y-6">
            {careerPositions.map((position) => (
              <div
                key={position.title}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{position.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                        <Briefcase className="h-3.5 w-3.5" />
                        {position.type}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin className="h-3.5 w-3.5" />
                        Scottsdale, AZ
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">{position.description}</p>
                  </div>
                  <a
                    href={`mailto:${siteConfig.email}?subject=Application: ${position.title}`}
                    className="shrink-0 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Email CTA */}
          <div className="mt-16 rounded-xl bg-teal-50 p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900">
              Don&apos;t See Your Position Listed?
            </h2>
            <p className="mt-2 text-gray-600">
              We&apos;re always looking for talented individuals. Send us your resume and we&apos;ll
              keep it on file for future opportunities.
            </p>
            <a
              href={`mailto:${siteConfig.email}?subject=General Application - Resume Submission`}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-700"
            >
              <Mail className="h-4 w-4" />
              Email Your Resume
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

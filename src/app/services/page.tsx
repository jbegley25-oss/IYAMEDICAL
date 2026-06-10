import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Scan, Brain, Stethoscope, Sparkles } from 'lucide-react'
import { procedures } from '@/content/procedures'
import { doctors } from '@/content/doctors'
import { siteConfig } from '@/content/site'

export const metadata: Metadata = {
  title: 'Services | Interventional Radiology, Neurology & More',
  description:
    'Explore the full range of medical services at IYA Medical: interventional radiology, neurology, internal medicine, and dermatology. Expert care in Scottsdale, AZ.',
  openGraph: {
    title: 'Services | Interventional Radiology, Neurology & More | IYA Medical',
    description:
      'Interventional radiology, neurology, internal medicine, and dermatology services from board-certified specialists in Scottsdale.',
    url: 'https://iyamedical.com/services',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'IYA Medical Services' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services | Interventional Radiology, Neurology & More | IYA Medical',
    description:
      'Interventional radiology, neurology, internal medicine, and dermatology from board-certified specialists.',
    images: ['/og-image.png'],
  },
}

const serviceCategories = [
  {
    title: 'Interventional Radiology',
    icon: Scan,
    description:
      'Our flagship program uses state-of-the-art minimally invasive techniques and imaging guidance to treat complex conditions without traditional surgery. From cancer treatment to vascular disease, our IR procedures offer less pain, lower risk, and faster recovery.',
    leadDoctorId: 'dr-ayad-agha',
    category: 'IR' as const,
  },
  {
    title: 'Neurology',
    icon: Brain,
    description:
      'Comprehensive neurological evaluations, diagnostics, and treatment for conditions affecting the brain and nervous system. Our neurologist provides expert care for headaches, neuropathy, seizures, and other neurological disorders.',
    leadDoctorId: 'dr-yazan-al-hasan',
    category: 'Neurology' as const,
  },
  {
    title: 'Internal Medicine',
    icon: Stethoscope,
    description:
      'Preventive health and chronic disease management from our experienced internist. We focus on building lasting patient relationships and delivering personalized care for conditions including diabetes, hypertension, and heart disease.',
    leadDoctorId: 'dr-ahmed-agha',
    category: 'Internal Medicine' as const,
  },
  {
    title: 'Dermatology',
    icon: Sparkles,
    description:
      'Expert skin health care including diagnosis and treatment of dermatological conditions. Our dermatology team supports comprehensive care for patients with skin concerns.',
    leadDoctorId: 'dr-iya-agha',
    category: null,
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="page-hero relative bg-gradient-to-br from-teal-600 to-teal-800 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Our Services
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-teal-100">
            {siteConfig.sections.service.description}
          </p>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {serviceCategories.map((service) => {
              const leadDoctor = doctors.find((d) => d.id === service.leadDoctorId)
              const categoryProcedures = service.category
                ? procedures.filter((p) => p.category === service.category)
                : []

              return (
                <div
                  key={service.title}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                >
                  <div className="p-8 md:p-10">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                        <service.icon className="h-7 w-7 text-teal-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>
                        {leadDoctor && (
                          <p className="mt-1 text-sm text-gray-500">
                            Lead:{' '}
                            <Link
                              href={`/doctors/${leadDoctor.id}`}
                              className="text-teal-600 hover:underline"
                            >
                              {leadDoctor.name}
                            </Link>
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="mt-4 text-gray-600 leading-relaxed">{service.description}</p>

                    {categoryProcedures.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                          Procedures
                        </h3>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {categoryProcedures.map((procedure) => (
                            <Link
                              key={procedure.slug}
                              href={`/procedures/${procedure.slug}`}
                              className="group flex items-center gap-2 rounded-lg border border-gray-100 px-4 py-3 text-sm transition-colors hover:border-teal-200 hover:bg-teal-50"
                            >
                              <span className="text-gray-700 group-hover:text-teal-700">
                                {procedure.title}
                              </span>
                              <ArrowRight className="ml-auto h-3.5 w-3.5 text-gray-400 group-hover:text-teal-600" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

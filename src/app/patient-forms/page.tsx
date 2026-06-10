import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, ArrowRight } from 'lucide-react'
import { siteConfig } from '@/content/site'

export const metadata: Metadata = {
  title: 'Patient Forms | Download & Online Intake',
  description:
    'Download patient forms or complete your intake online before visiting IYA Medical. Save time with our digital registration process for new and returning patients.',
  openGraph: {
    title: 'Patient Forms | Download & Online Intake | IYA Medical',
    description:
      'Download patient forms or complete your intake online before your visit. Save time with digital registration.',
    url: 'https://iyamedical.com/patient-forms',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'IYA Medical Patient Forms' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Patient Forms | Download & Online Intake | IYA Medical',
    description:
      'Download patient forms or complete your intake online before your visit to IYA Medical.',
    images: ['/og-image.png'],
  },
}

const forms = [
  {
    title: 'Patient Registration Form',
    description:
      'New patient registration including personal information, emergency contacts, and consent to treatment.',
    downloadUrl: '#',
  },
  {
    title: 'Medical History Form',
    description:
      'Comprehensive medical history including past surgeries, current medications, allergies, and family health history.',
    downloadUrl: '#',
  },
  {
    title: 'Insurance Information Form',
    description:
      'Insurance details and authorization for benefits assignment. Please bring your insurance card to your appointment.',
    downloadUrl: '#',
  },
  {
    title: 'HIPAA Privacy Acknowledgment',
    description:
      'Acknowledgment of receipt of our Notice of Privacy Practices in compliance with HIPAA regulations.',
    downloadUrl: '#',
  },
]

export default function PatientFormsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="page-hero relative bg-gradient-to-br from-teal-600 to-teal-800 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Patient Forms
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-teal-100">
            Save time by completing your forms before your visit.
          </p>
        </div>
      </section>

      {/* Online Intake CTA */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-teal-50 p-8 md:p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Fill Out Your Forms Online
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Complete your patient intake digitally from the comfort of your home. Our secure
              online system makes registration fast and easy.
            </p>
            <Link
              href="/patient-intake"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-700"
            >
              Start Online Intake
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Form Information */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900">Required Forms</h2>
            <p className="mt-2 text-gray-600">
              The following information will be collected during your online intake. You can also request printed copies at any of our offices.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {forms.map((form) => (
                <div
                  key={form.title}
                  className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                      <FileText className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{form.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{form.description}</p>
                      <a
                        href="/patient-intake"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700"
                      >
                        <ArrowRight className="h-4 w-4" />
                        Complete Online
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-gray-100 bg-gray-50 p-6 text-center">
              <p className="text-sm text-gray-600">
                Need printed forms? Call us at{' '}
                <a href={`tel:${siteConfig.phone}`} className="font-medium text-teal-600 hover:text-teal-700">
                  {siteConfig.phone}
                </a>{' '}
                or request them at your next visit.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

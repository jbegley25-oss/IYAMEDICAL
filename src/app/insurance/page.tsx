import type { Metadata } from 'next'
import Image from 'next/image'
import { Phone, Mail } from 'lucide-react'
import { insuranceProviders } from '@/content/insurance'
import { siteConfig } from '@/content/site'

export const metadata: Metadata = {
  title: 'Insurance | Accepted Plans & Coverage',
  description:
    'IYA Medical accepts most major insurance plans including Aetna, Blue Cross Blue Shield, Cigna, Humana, Medicare, AHCCCS, and United Health Care. Contact us for insurance verification.',
  openGraph: {
    title: 'Insurance | Accepted Plans & Coverage at IYA Medical',
    description:
      'We accept Aetna, BCBS, Cigna, Humana, Medicare, AHCCCS, United, and more. Contact us for verification.',
    url: 'https://iyamedical.com/insurance',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'IYA Medical Insurance' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insurance | Accepted Plans & Coverage at IYA Medical',
    description:
      'We accept most major insurance plans including Aetna, BCBS, Cigna, Medicare, and more.',
    images: ['/og-image.png'],
  },
}

export default function InsurancePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="page-hero relative bg-gradient-to-br from-teal-600 to-teal-800 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Medical Insurance
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-teal-100">
            We accept most major insurance plans to make quality healthcare accessible.
          </p>
        </div>
      </section>

      {/* Insurance Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              We Accept Most Major Insurance Plans
            </h2>
            <p className="mt-4 text-gray-600">
              IYA Medical is proud to work with a wide range of insurance providers. If you don&apos;t
              see your insurance listed below, please contact us to verify your coverage.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {insuranceProviders.map((provider) => (
              <div
                key={provider.name}
                className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-16 w-full">
                  <Image
                    src={provider.logoPath}
                    alt={provider.name}
                    fill
                    className="object-contain"
                    sizes="150px"
                  />
                </div>
                <p className="mt-3 text-center text-xs font-medium text-gray-600">
                  {provider.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Verification CTA */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Need Insurance Verification?
          </h2>
          <p className="mt-4 text-gray-600">
            Our billing team is happy to help verify your insurance coverage and explain your
            benefits before your appointment. Contact us today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={siteConfig.phoneHref}
              className="flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-700"
            >
              <Phone className="h-4 w-4" />
              Call {siteConfig.phone}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Mail className="h-4 w-4" />
              Email Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

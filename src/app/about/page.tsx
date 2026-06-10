import type { Metadata } from 'next'
import { Heart, Award, Clock, Lightbulb } from 'lucide-react'
import { siteConfig } from '@/content/site'

export const metadata: Metadata = {
  title: 'About IYA Medical | Multi-Specialty Practice in Scottsdale',
  description:
    'IYA Medical is Scottsdale\'s leading multi-specialty practice with board-certified physicians in interventional radiology, neurology, internal medicine, and dermatology. Patient-centered care since day one.',
  openGraph: {
    title: 'About IYA Medical | Multi-Specialty Practice in Scottsdale',
    description:
      'Board-certified physicians in interventional radiology, neurology, internal medicine, and dermatology. Compassionate, patient-centered care in Scottsdale, AZ.',
    url: 'https://iyamedical.com/about',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'About IYA Medical' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About IYA Medical | Multi-Specialty Practice in Scottsdale',
    description:
      'Board-certified physicians in interventional radiology, neurology, internal medicine, and dermatology in Scottsdale, AZ.',
    images: ['/og-image.png'],
  },
}

const values = [
  {
    icon: Heart,
    title: 'Patient Care',
    description:
      'Every patient is treated like family. We take the time to listen, explain, and develop personalized treatment plans that prioritize your comfort and well-being.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description:
      'Our board-certified physicians maintain the highest standards of medical practice, earning recognition including the Phoenix Magazine Top Doc Award and ACR accreditation.',
  },
  {
    icon: Clock,
    title: 'Experience',
    description:
      'With decades of combined clinical experience, our team has successfully treated thousands of patients using state-of-the-art minimally invasive techniques.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'We continuously adopt the latest advancements in interventional radiology, from cutting-edge imaging technology to regenerative medicine and stem cell therapy.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="page-hero relative bg-gradient-to-br from-teal-600 to-teal-800 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            About IYA Medical
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-teal-100">
            {siteConfig.sections.about.description}
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Our Mission
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              At IYA Medical, our mission is to provide the highest quality medical care through
              minimally invasive, image-guided procedures that offer patients effective alternatives
              to traditional surgery. We are committed to improving lives through innovation,
              compassion, and clinical excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Practice History */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Our Story
            </h2>
            <div className="mt-6 space-y-4 text-gray-600">
              <p>
                IYA Medical was founded by Dr. Ayad K. M. Agha, a board-certified interventional
                radiologist, with a vision to bring state-of-the-art minimally invasive treatments
                to the Scottsdale community. What began as a single-physician practice has grown
                into a multi-specialty medical group with three convenient locations across
                Scottsdale, Arizona.
              </p>
              <p>
                Our Program of Vascular and Interventional Radiology uses advanced imaging guidance
                to perform complex procedures through tiny incisions, replacing conventional surgery
                with treatments that offer less pain, lower risk, and faster recovery times. From
                treating peripheral artery disease and liver cancer to managing chronic pain and
                uterine fibroids, our team delivers comprehensive care across a wide spectrum of
                conditions.
              </p>
              <p>
                Today, IYA Medical is recognized as one of the Valley&apos;s premier diagnostic and
                interventional radiology practices, serving thousands of families across Arizona.
                Our team of qualified physicians, including specialists in neurology, internal
                medicine, and dermatology, work together to provide truly integrated, patient-centered
                healthcare.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Our Values
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            The principles that guide everything we do at IYA Medical.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50">
                  <value.icon className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{value.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

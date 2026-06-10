import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Stethoscope, Pill, Activity, Shield, Thermometer, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Internal Medicine',
  description: 'Comprehensive internal medicine and primary care in Scottsdale, AZ. Dr. Ahmed K. Agha, MD provides preventive care, chronic disease management, and wellness visits. Call 480-771-0000.',
}

const services = [
  { icon: Stethoscope, title: 'Annual Physicals & Wellness Visits', description: 'Comprehensive health evaluations, preventive screenings, and personalized wellness plans.' },
  { icon: Heart, title: 'Cardiovascular Health', description: 'Blood pressure management, cholesterol screening, heart disease risk assessment, and ongoing cardiac monitoring.' },
  { icon: Pill, title: 'Diabetes Management', description: 'Type 1 and Type 2 diabetes care including medication management, A1C monitoring, and lifestyle coaching.' },
  { icon: Activity, title: 'Chronic Disease Management', description: 'Ongoing care for hypertension, thyroid disorders, asthma, COPD, and other chronic conditions.' },
  { icon: Shield, title: 'Preventive Screenings', description: 'Cancer screenings, immunizations, bone density testing, and age-appropriate health maintenance.' },
  { icon: Thermometer, title: 'Acute Illness Care', description: 'Treatment for infections, respiratory illness, flu, allergies, and other urgent medical concerns.' },
]

export default function InternalMedicinePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-200">Internal Medicine</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Comprehensive Primary Care
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-teal-100">
            Expert internal medicine care with Dr. Ahmed K. Agha, MD. From preventive wellness to chronic disease management.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a href="/patient-intake" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-teal-700 hover:bg-teal-50">
              Schedule a Visit <ArrowRight className="h-4 w-4" />
            </a>
            <a href="tel:+14807710000" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-8 py-3 font-semibold text-white hover:bg-white/10">
              Call 480-771-0000
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 md:flex-row md:gap-12">
            <Image src="/images/doctors/dr-ahmed-agha.png" alt="Dr. Ahmed K. Agha" width={192} height={192} className="h-48 w-48 rounded-2xl object-cover shadow-lg" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ahmed K. Agha, MD</h2>
              <p className="mt-1 text-teal-600 font-medium">Internal Medicine Physician</p>
              <p className="mt-4 max-w-2xl text-gray-600 leading-relaxed">
                Dr. Ahmed Agha provides comprehensive primary care and internal medicine services at IYA Medical.
                With a focus on building lasting patient relationships, he delivers preventive care, manages chronic
                conditions, and addresses acute medical needs with a patient-centered approach.
              </p>
              <Link href="/doctors/dr-ahmed-agha" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700">
                View Full Profile <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">Our Services</p>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">Internal Medicine Services</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.title} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                    <Icon className="h-5 w-5 text-teal-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{s.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{s.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-teal-700 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Schedule Your Visit</h2>
          <p className="mt-4 text-teal-100">Whether you need a routine checkup or help managing a chronic condition, we&apos;re here for you.</p>
          <div className="mt-8 flex flex-col gap-4 justify-center sm:flex-row">
            <a href="/patient-intake" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-teal-700 hover:bg-teal-50">
              Start Patient Intake <ArrowRight className="h-4 w-4" />
            </a>
            <a href="tel:+14807710000" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-3 font-semibold text-white hover:bg-white/10">
              Call 480-771-0000
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

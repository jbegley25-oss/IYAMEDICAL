import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Mail, CalendarCheck, GraduationCap, BadgeCheck } from 'lucide-react'
import { doctors } from '@/content/doctors'
import { procedures } from '@/content/procedures'
import { siteConfig } from '@/content/site'

export async function generateStaticParams() {
  return doctors.map((doctor) => ({
    slug: doctor.id,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const doctor = doctors.find((d) => d.id === slug)

  if (!doctor) {
    return { title: 'Doctor Not Found | IYA Medical' }
  }

  const title = `${doctor.name} - ${doctor.specialty}`
  const description = doctor.bio.length > 160 ? doctor.bio.slice(0, 157) + '...' : doctor.bio

  return {
    title,
    description,
    openGraph: {
      title: `${doctor.name} - ${doctor.specialty} | IYA Medical`,
      description,
      url: `${siteConfig.url}/doctors/${doctor.id}`,
      images: [{ url: doctor.image, alt: doctor.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${doctor.name} - ${doctor.specialty} | IYA Medical`,
      description,
      images: [doctor.image],
    },
  }
}

export default async function DoctorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const doctor = doctors.find((d) => d.id === slug)

  if (!doctor) {
    notFound()
  }

  const doctorProcedures = procedures.filter((p) => p.doctorId === doctor.id)

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 to-teal-800 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/doctors"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-teal-200 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All Doctors
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            {doctor.name}
          </h1>
          <p className="mt-2 text-lg text-teal-100">
            {doctor.title} &mdash; {doctor.specialty}
          </p>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Photo & Quick Info */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={400}
                    height={500}
                    className="h-auto w-full object-cover"
                  />
                </div>

                {doctor.email && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-teal-600" />
                    <a href={`mailto:${doctor.email}`} className="hover:text-teal-600">
                      {doctor.email}
                    </a>
                  </div>
                )}

                <Link
                  href="/patient-intake"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-700"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Book with {doctor.name.split(',')[0].split(' ').pop()}
                </Link>
              </div>
            </div>

            {/* Bio & Details */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900">About {doctor.name.split(',')[0]}</h2>
              <p className="mt-4 text-gray-600 leading-relaxed">{doctor.bio}</p>

              {/* Credentials */}
              <div className="mt-10">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <GraduationCap className="h-5 w-5 text-teal-600" />
                  Credentials &amp; Education
                </h3>
                <ul className="mt-4 space-y-3">
                  {doctor.credentials.map((credential) => (
                    <li key={credential} className="flex items-start gap-3">
                      <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                      <span className="text-gray-600">{credential}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specialties / Procedures */}
              {doctorProcedures.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg font-semibold text-gray-900">Specialties &amp; Procedures</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {doctorProcedures.map((procedure) => (
                      <Link
                        key={procedure.slug}
                        href={`/procedures/${procedure.slug}`}
                        className="rounded-lg border border-gray-100 p-4 transition-colors hover:border-teal-200 hover:bg-teal-50"
                      >
                        <p className="font-medium text-gray-900">{procedure.title}</p>
                        <p className="mt-1 text-xs text-gray-500">{procedure.category}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

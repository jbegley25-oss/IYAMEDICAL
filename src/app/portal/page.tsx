import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, Shield, FileText, Calendar, MessageSquare } from 'lucide-react'
import { siteConfig } from '@/content/site'

export const metadata: Metadata = {
  title: 'Patient Portal | IYA Medical',
  description:
    'Access your medical records, lab results, appointments, and secure messaging through the IYA Medical patient portal.',
  openGraph: {
    title: 'Patient Portal | IYA Medical',
    description: 'Secure access to your medical records, lab results, and appointments.',
    url: 'https://iyamedical.com/portal',
  },
}

const PORTAL_URL = process.env.OPENEMR_PORTAL_URL || 'https://emr.iyamedical.com/portal'

const features = [
  {
    icon: FileText,
    title: 'Medical Records',
    description: 'View your complete medical history, lab results, and imaging reports.',
  },
  {
    icon: Calendar,
    title: 'Appointments',
    description: 'Schedule, reschedule, or cancel appointments at any of our locations.',
  },
  {
    icon: MessageSquare,
    title: 'Secure Messaging',
    description: 'Send messages directly to your care team with end-to-end encryption.',
  },
  {
    icon: Shield,
    title: 'HIPAA Compliant',
    description: 'Your data is protected with enterprise-grade security and encryption.',
  },
]

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-600/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Patient Portal
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Access your medical records, lab results, appointments, and communicate
            securely with your care team at IYA Medical.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:shadow-xl hover:shadow-brand-600/30 hover:brightness-110"
            >
              <ExternalLink className="h-5 w-5" />
              Open Patient Portal
            </a>
            <Link
              href="/patient-intake"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-base font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              New Patient? Start Intake
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 pb-24">
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-gray-800/40 p-6 ring-1 ring-white/5 transition-colors hover:bg-gray-800/60"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/20 text-brand-400">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Help section */}
        <div className="mt-12 rounded-2xl bg-gray-800/30 p-8 text-center ring-1 ring-white/5">
          <h2 className="text-xl font-semibold text-white">Need Help?</h2>
          <p className="mt-2 text-gray-400">
            If you have trouble accessing the patient portal, call us at{' '}
            <a href={siteConfig.phoneHref} className="font-medium text-brand-400 hover:text-brand-300">
              {siteConfig.phone}
            </a>{' '}
            and our team will assist you.
          </p>
        </div>
      </section>
    </div>
  )
}

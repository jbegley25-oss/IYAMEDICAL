import type { Metadata } from 'next'
import ContactPage from './contact-form'

export const metadata: Metadata = {
  title: 'Contact Us | Schedule Your Appointment',
  description:
    'Contact IYA Medical to schedule an appointment or ask a question. Call 480-771-0000 or use our online form. Three Scottsdale, AZ locations open Monday-Saturday.',
  openGraph: {
    title: 'Contact Us | Schedule Your Appointment | IYA Medical',
    description:
      'Schedule an appointment or reach our care team. Call 480-771-0000 or use our online form. Three Scottsdale locations.',
    url: 'https://iyamedical.com/contact',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Contact IYA Medical' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Schedule Your Appointment | IYA Medical',
    description:
      'Schedule an appointment or reach our care team at IYA Medical. Call 480-771-0000.',
    images: ['/og-image.png'],
  },
}

export default function Page() {
  return <ContactPage />
}

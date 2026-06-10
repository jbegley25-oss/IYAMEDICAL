import type { Metadata } from 'next'
import TestimonialsContent from './testimonials-content'

export const metadata: Metadata = {
  title: 'Patient Testimonials | Real Stories, Real Results',
  description:
    'Read and watch real patient testimonials from IYA Medical. Hear how our board-certified specialists in interventional radiology and neurology changed lives in Scottsdale, AZ.',
  openGraph: {
    title: 'Patient Testimonials | Real Stories, Real Results | IYA Medical',
    description:
      'Real patient stories from IYA Medical. See how minimally invasive treatments changed lives in Scottsdale.',
    url: 'https://iyamedical.com/testimonials',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'IYA Medical Patient Testimonials' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Patient Testimonials | Real Stories, Real Results | IYA Medical',
    description:
      'Real patient stories from IYA Medical. Hear how our specialists changed lives.',
    images: ['/og-image.png'],
  },
}

export default function Page() {
  return <TestimonialsContent />
}

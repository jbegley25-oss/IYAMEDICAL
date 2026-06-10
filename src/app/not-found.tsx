import Link from 'next/link'
import { Stethoscope, Home, Phone, Layers } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-24">
      <div className="text-center">
        {/* Medical icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-teal-50">
          <Stethoscope className="h-10 w-10 text-teal-600" />
        </div>

        {/* 404 text */}
        <h1 className="mt-8 text-7xl font-extrabold tracking-tight text-gray-900">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Page Not Found
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-gray-600">
          The page you are looking for does not exist or has been moved.
          Let us help you find what you need.
        </p>

        {/* Navigation links */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 hover:shadow-md"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300"
          >
            <Layers className="h-4 w-4" />
            Our Services
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300"
          >
            <Phone className="h-4 w-4" />
            Contact Us
          </Link>
        </div>

        {/* Divider */}
        <div className="mx-auto mt-12 h-px w-48 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Help text */}
        <p className="mt-6 text-sm text-gray-500">
          Need immediate assistance? Call us at{' '}
          <a
            href="tel:+14807710000"
            className="font-medium text-teal-600 hover:text-teal-500"
          >
            480-771-0000
          </a>
        </p>
      </div>
    </main>
  )
}

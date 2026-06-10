import type { Metadata } from 'next'
import { siteConfig } from '@/content/site'

export const metadata: Metadata = {
  title: 'Privacy Policy | HIPAA Compliance',
  description:
    'IYA Medical privacy policy. Learn how we protect your personal health information in full compliance with HIPAA regulations and Arizona state law.',
  openGraph: {
    title: 'Privacy Policy | HIPAA Compliance | IYA Medical',
    description:
      'Learn how IYA Medical protects your personal health information in compliance with HIPAA regulations.',
    url: 'https://iyamedical.com/privacy-policy',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'IYA Medical Privacy Policy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | HIPAA Compliance | IYA Medical',
    description:
      'How IYA Medical protects your personal health information under HIPAA.',
    images: ['/og-image.png'],
  },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="page-hero relative bg-gradient-to-br from-teal-600 to-teal-800 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-teal-100">
            Your privacy and the protection of your health information is our priority.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed">
              Effective Date: January 1, 2024
            </p>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              Notice of Privacy Practices
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              This notice describes how medical information about you may be used and disclosed
              and how you can get access to this information. Please review it carefully.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              IYA Medical (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;the Practice&rdquo;) is
              committed to protecting the privacy of your personal health information (PHI) in
              accordance with the Health Insurance Portability and Accountability Act of 1996
              (HIPAA) and applicable state laws.
            </p>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              How We May Use and Disclose Your Health Information
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We may use and disclose your protected health information for the following purposes:
            </p>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>
                <strong>Treatment:</strong> We may use your health information to provide, coordinate,
                or manage your medical treatment and related services. This includes sharing information
                with other physicians, nurses, or healthcare providers involved in your care.
              </li>
              <li>
                <strong>Payment:</strong> We may use and disclose your health information to obtain
                payment for services we provide, including billing your insurance company and verifying
                coverage.
              </li>
              <li>
                <strong>Healthcare Operations:</strong> We may use and disclose your health information
                for our internal operations, such as quality assessment, staff training, compliance
                programs, and business planning.
              </li>
              <li>
                <strong>Appointment Reminders:</strong> We may contact you to provide appointment
                reminders or information about treatment alternatives or other health-related benefits
                and services.
              </li>
            </ul>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              Your Rights Regarding Your Health Information
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              You have the following rights regarding your protected health information:
            </p>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>
                <strong>Right to Inspect and Copy:</strong> You have the right to inspect and obtain
                a copy of your health information maintained by our practice.
              </li>
              <li>
                <strong>Right to Amend:</strong> You may request that we amend your health information
                if you believe it is incorrect or incomplete.
              </li>
              <li>
                <strong>Right to an Accounting of Disclosures:</strong> You have the right to request
                a list of certain disclosures we have made of your health information.
              </li>
              <li>
                <strong>Right to Request Restrictions:</strong> You may request restrictions on certain
                uses and disclosures of your health information.
              </li>
              <li>
                <strong>Right to Request Confidential Communications:</strong> You may request that
                we communicate with you about medical matters through a particular means or at a
                certain location.
              </li>
              <li>
                <strong>Right to a Paper Copy:</strong> You have the right to obtain a paper copy
                of this notice upon request.
              </li>
            </ul>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              Information We Collect Online
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              When you visit our website, we may collect information including your name, email
              address, phone number, and other details you voluntarily provide through our contact
              forms and patient intake system. We use this information solely to respond to your
              inquiries and provide medical services.
            </p>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              Cookies and Analytics
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Our website may use cookies and similar technologies to enhance your browsing
              experience and analyze website traffic. These technologies do not collect protected
              health information.
            </p>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              Data Security
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We implement appropriate physical, technical, and administrative safeguards to protect
              your health information from unauthorized access, use, or disclosure. Our electronic
              systems are secured with encryption, access controls, and regular security audits.
            </p>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              Changes to This Notice
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We reserve the right to change this notice at any time. Any changes will apply to
              health information we already have about you as well as any information we receive
              in the future. A current copy of this notice will be available at our office and
              on our website.
            </p>

            <h2 className="mt-10 text-xl font-bold text-gray-900">Contact Us</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              If you have questions about this privacy notice or wish to exercise any of your
              rights, please contact us:
            </p>
            <div className="mt-4 rounded-lg bg-gray-50 p-6 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">IYA Medical</p>
              <p className="mt-1">
                {siteConfig.mainAddress.street}
                <br />
                {siteConfig.mainAddress.city}, {siteConfig.mainAddress.state}{' '}
                {siteConfig.mainAddress.zip}
              </p>
              <p className="mt-1">Phone: {siteConfig.phone}</p>
              <p>Email: {siteConfig.email}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

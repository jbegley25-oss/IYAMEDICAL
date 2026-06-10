import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { siteConfig } from "@/content/site";
import { NewsletterForm } from "@/components/layout/newsletter-form";

const servicesLinks = [
  { label: "IR Services Overview", href: "/services" },
  { label: "Neurology", href: "/doctors/dr-yazan-al-hasan" },
  { label: "Internal Medicine", href: "/doctors/dr-ahmed-agha" },
  { label: "All Procedures", href: "/procedures" },
  { label: "PAD Treatment", href: "/procedures/peripheral-artery-disease-pad" },
  { label: "Uterine Fibroids", href: "/procedures/uterine-fibroids" },
];

const patientLinks = [
  { label: "Patient Forms", href: "/patient-forms" },
  { label: "Patient Intake", href: "/patient-intake" },
  { label: "Insurance", href: "/contact" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];


export function Footer() {
  const { mainAddress } = siteConfig;
  const fullAddress = `${mainAddress.street}, ${mainAddress.city}, ${mainAddress.state} ${mainAddress.zip}`;
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`;

  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand + Newsletter (takes 2 cols) */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/icon.png"
                alt={siteConfig.name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg"
              />
              <span className="text-base font-bold tracking-tight whitespace-nowrap" style={{
                background: 'linear-gradient(90deg, #5eead4, #22d3ee, #818cf8, #a78bfa, #f472b6, #fb923c, #4ade80, #5eead4)',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'logo-gradient 8s ease infinite',
              }}>
                IYA Medical
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-500">
              {siteConfig.description}
            </p>

            {/* Social */}
            {siteConfig.social.youtube && (
              <div className="mt-6 flex gap-3">
                <a
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-teal-600 hover:text-white"
                  aria-label="YouTube"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            )}

            {/* Newsletter */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-white">
                Stay Updated
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Health tips and practice news, delivered monthly.
              </p>
              <NewsletterForm />
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white">Services</h3>
            <ul className="mt-4 space-y-3">
              {servicesLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-teal-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Patient Support */}
          <div>
            <h3 className="text-sm font-semibold text-white">Patient Support</h3>
            <ul className="mt-4 space-y-3">
              {patientLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-teal-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <h3 className="text-sm font-semibold text-white">Get In Touch</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-gray-500 transition-colors hover:text-teal-400"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-teal-600" />
                  <span>
                    {mainAddress.street}
                    <br />
                    {mainAddress.city}, {mainAddress.state} {mainAddress.zip}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.phoneHref}
                  className="flex items-center gap-2 text-gray-500 transition-colors hover:text-teal-400"
                >
                  <Phone className="size-4 shrink-0 text-teal-600" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 text-gray-500 transition-colors hover:text-teal-400"
                >
                  <Mail className="size-4 shrink-0 text-teal-600" />
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-500">
                <Clock className="size-4 shrink-0 text-teal-600" />
                {siteConfig.hours.weekday}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-gray-500 sm:flex-row lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <p>Radiology &middot; Neurology &middot; Internal Medicine &middot; Scottsdale, AZ</p>
        </div>
      </div>
    </footer>
  );
}

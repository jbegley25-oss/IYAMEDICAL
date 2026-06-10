import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/layout/site-shell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://iyamedical.com'),
  title: {
    default: 'IYA Medical | Interventional Radiology Scottsdale, AZ',
    template: '%s | IYA Medical',
  },
  description:
    'IYA Medical is a multi-specialty interventional radiology practice in Scottsdale, Arizona. Our board-certified physicians offer minimally invasive procedures with exceptional patient care across three convenient locations.',
  keywords: [
    'interventional radiology',
    'scottsdale',
    'neurology',
    'internal medicine',
    'dermatology',
    'minimally invasive procedures',
    'vascular treatment',
    'scottsdale doctor',
    'arizona medical practice',
    'PAD treatment',
    'uterine fibroid embolization',
    'varicose veins',
    'board certified physician',
  ],
  authors: [{ name: 'IYA Medical' }],
  creator: 'IYA Medical',
  publisher: 'IYA Medical',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://iyamedical.com',
    siteName: 'IYA Medical',
    title: 'IYA Medical | Interventional Radiology Scottsdale, AZ',
    description:
      'Board-certified physicians offering minimally invasive interventional radiology, neurology, and internal medicine across three Scottsdale, AZ locations.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'IYA Medical - Interventional Radiology Scottsdale, AZ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IYA Medical | Interventional Radiology Scottsdale, AZ',
    description:
      'Board-certified physicians offering minimally invasive interventional radiology, neurology, and internal medicine across three Scottsdale, AZ locations.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {},
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "IYA Medical",
  url: "https://iyamedical.com",
  telephone: "+1-480-771-0000",
  email: "scheduling@iyamedical.com",
  image: "https://iyamedical.com/images/iya-medical-logo-blue.png",
  description:
    "IYA Medical is a multi-specialty interventional radiology practice in Scottsdale, Arizona offering minimally invasive procedures.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "9201 E. Mountain View Rd., Suite 130",
    addressLocality: "Scottsdale",
    addressRegion: "AZ",
    postalCode: "85258",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 33.5539,
    longitude: -111.9058,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "14:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    ratingCount: "150",
  },
  medicalSpecialty: [
    "Interventional Radiology",
    "Neurology",
    "Internal Medicine",
    "Dermatology",
  ],
  availableService: [
    { "@type": "MedicalProcedure", name: "Peripheral Artery Disease (PAD) Treatment" },
    { "@type": "MedicalProcedure", name: "Uterine Fibroid Embolization (UFE)" },
    { "@type": "MedicalProcedure", name: "Varicose Veins Treatment" },
    { "@type": "MedicalProcedure", name: "Deep Vein Thrombosis (DVT) Treatment" },
    { "@type": "MedicalProcedure", name: "Liver Cancer Treatment" },
    { "@type": "MedicalProcedure", name: "Prostate Artery Embolization (PAE)" },
    { "@type": "MedicalProcedure", name: "Genicular Artery Embolization for Knee Pain" },
    { "@type": "MedicalProcedure", name: "Stem Cell Therapy & Regenerative Medicine" },
    { "@type": "MedicalProcedure", name: "Compression Fracture (Kyphoplasty)" },
    { "@type": "MedicalProcedure", name: "IVC Filters" },
    { "@type": "MedicalProcedure", name: "Neurology Services" },
  ],
  employee: [
    {
      "@type": "Physician",
      name: "Ayad K. M. Agha, DO",
      jobTitle: "Medical Director",
      medicalSpecialty: "Interventional Radiology",
      url: "https://iyamedical.com/doctors/dr-ayad-agha",
    },
    {
      "@type": "Physician",
      name: "Yazan Al-Hasan, MD, PhD",
      jobTitle: "Neurologist",
      medicalSpecialty: "Neurology",
      url: "https://iyamedical.com/doctors/dr-yazan-al-hasan",
    },
    {
      "@type": "Physician",
      name: "Ahmed K. Agha, MD",
      jobTitle: "Internal Medicine Physician",
      medicalSpecialty: "Internal Medicine",
      url: "https://iyamedical.com/doctors/dr-ahmed-agha",
    },
    {
      "@type": "Physician",
      name: "Dr. Iya Agha, D.O.",
      jobTitle: "Dermatology Resident",
      medicalSpecialty: "Dermatology",
      url: "https://iyamedical.com/doctors/dr-iya-agha",
    },
    {
      "@type": "Physician",
      name: "Dr. Mustafa Ogali",
      jobTitle: "Interventional Radiology Resident",
      medicalSpecialty: "Interventional Radiology",
      url: "https://iyamedical.com/doctors/dr-mustafa-ogali",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-white font-sans text-gray-900" suppressHydrationWarning>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

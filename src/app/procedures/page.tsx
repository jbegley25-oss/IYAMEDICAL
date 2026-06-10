import Link from "next/link";
import { procedures } from "@/content/procedures";
import { ArrowRight, Stethoscope } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Procedures | 21+ Minimally Invasive Treatments',
  description:
    'Explore 21+ minimally invasive procedures: PAD treatment, uterine fibroid embolization, varicose veins, liver cancer treatment, and more. Same-day outpatient care in Scottsdale, AZ.',
  openGraph: {
    title: 'Procedures | 21+ Minimally Invasive Treatments | IYA Medical',
    description:
      'PAD treatment, uterine fibroid embolization, varicose veins, liver cancer, and more. Same-day outpatient procedures in Scottsdale.',
    url: 'https://iyamedical.com/procedures',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'IYA Medical Procedures' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Procedures | 21+ Minimally Invasive Treatments | IYA Medical',
    description:
      'Explore 21+ minimally invasive, same-day outpatient procedures at IYA Medical in Scottsdale, AZ.',
    images: ['/og-image.png'],
  },
};

const categories = [
  { name: "Interventional Radiology", filter: "IR" },
  { name: "Neurology", filter: "Neurology" },
  { name: "Internal Medicine", filter: "Internal Medicine" },
];

export default function ProceduresPage() {
  return (
    <div>
      {/* Hero */}
      <section className="page-hero relative bg-gradient-to-br from-teal-700 to-teal-900 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Our Procedures
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-teal-100">
            Minimally invasive, same-day outpatient procedures with faster
            recovery times and better outcomes than traditional surgery.
          </p>
        </div>
      </section>

      {/* Procedures by Category */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {categories.map((cat) => {
            const procs = procedures.filter((p) => p.category === cat.filter);
            if (procs.length === 0) return null;
            return (
              <div key={cat.name} className="mb-16 last:mb-0">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                    <Stethoscope className="h-5 w-5 text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {cat.name}
                  </h2>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
                    {procs.length} procedures
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {procs.map((proc) => (
                    <Link
                      key={proc.slug}
                      href={`/procedures/${proc.slug}`}
                      className="group flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-teal-700">
                          {proc.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                          {proc.shortDescription}
                        </p>
                      </div>
                      <ArrowRight className="ml-3 h-5 w-5 shrink-0 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-teal-500" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Not Sure Which Procedure Is Right for You?
          </h2>
          <p className="mt-3 text-gray-600">
            Our team will help determine the best treatment plan. Start with a
            consultation or contact us directly.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/patient-intake"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-teal-700"
            >
              Start Patient Intake
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+14807710000"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-teal-600 px-8 py-3.5 font-semibold text-teal-600 transition-colors hover:bg-teal-50"
            >
              Call 480-771-0000
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

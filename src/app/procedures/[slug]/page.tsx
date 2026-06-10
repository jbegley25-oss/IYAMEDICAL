import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarCheck, User, ChevronRight } from 'lucide-react'
import { procedures } from '@/content/procedures'
import { doctors } from '@/content/doctors'
import { siteConfig } from '@/content/site'

// Detailed medical content for top procedures
const detailedContent: Record<
  string,
  {
    whatItIs: string
    whoItsFor: string
    whatToExpect: string
    recovery: string
  }
> = {
  'peripheral-artery-disease-pad': {
    whatItIs:
      'Peripheral artery disease (PAD) occurs when plaque builds up in the arteries that carry blood to your legs, arms, and other areas of the body. At IYA Medical, we use minimally invasive endovascular techniques including angioplasty, stenting, and atherectomy to restore blood flow without the need for open surgery. Using real-time imaging guidance, our interventional radiologist navigates a catheter through the blocked artery to open the vessel and improve circulation.',
    whoItsFor:
      'PAD treatment is recommended for patients experiencing leg pain when walking (claudication), numbness or weakness in the legs, non-healing wounds on the feet or legs, or those at risk of limb loss due to critical limb ischemia. Patients with diabetes, high blood pressure, or a history of smoking are at higher risk for PAD.',
    whatToExpect:
      'The procedure is performed under local anesthesia with conscious sedation. A small catheter is inserted through a tiny puncture in the groin or wrist. Using X-ray guidance, the catheter is guided to the blockage where a balloon is inflated to open the artery. A stent may be placed to keep the artery open. The entire procedure typically takes 1-2 hours.',
    recovery:
      'Most patients go home the same day or the following morning. You can expect to resume normal activities within a few days and more strenuous activities within 1-2 weeks. Patients typically notice improved blood flow and reduced symptoms immediately after the procedure. Follow-up visits are scheduled to monitor progress and ensure optimal outcomes.',
  },
  'uterine-fibroids': {
    whatItIs:
      'Uterine fibroid embolization (UFE) is a minimally invasive procedure that shrinks fibroids by cutting off their blood supply. During the procedure, tiny particles are injected into the uterine arteries through a small catheter, blocking blood flow to the fibroids. Without blood supply, the fibroids shrink and symptoms improve significantly. UFE preserves the uterus and is an excellent alternative to hysterectomy.',
    whoItsFor:
      'UFE is ideal for women experiencing heavy menstrual bleeding, pelvic pain or pressure, frequent urination, or bloating caused by uterine fibroids. It is especially beneficial for women who wish to avoid surgery, preserve their uterus, or who are not candidates for surgical procedures. Women with multiple fibroids can be treated in a single procedure.',
    whatToExpect:
      'The procedure is performed under conscious sedation through a tiny puncture in the wrist or groin. Using fluoroscopic (X-ray) guidance, the interventional radiologist threads a catheter to the uterine arteries and injects microspheres that block blood flow to the fibroids. The procedure typically takes about one hour.',
    recovery:
      'Patients typically stay overnight for pain management and go home the next day. Most women return to work within 1-2 weeks, compared to 6-8 weeks for hysterectomy. Fibroids begin to shrink within weeks, and most patients experience significant symptom relief within 3 months. The average fibroid volume reduction is 40-60% at six months.',
  },
  'varicose-veins': {
    whatItIs:
      'Varicose vein treatment at IYA Medical includes endovenous laser therapy (EVLT), radiofrequency ablation, and sclerotherapy. These minimally invasive procedures close off damaged veins, rerouting blood through healthy vessels. EVLT uses laser energy delivered through a thin fiber to seal the vein, while sclerotherapy involves injecting a solution that causes the vein to collapse and fade.',
    whoItsFor:
      'Treatment is recommended for patients with visible varicose or spider veins, leg pain, swelling, heaviness, or cramping, skin discoloration near the ankles, or venous ulcers. Patients who have not responded to conservative treatments such as compression stockings and lifestyle changes are good candidates for these procedures.',
    whatToExpect:
      'Varicose vein treatments are performed in our office under local anesthesia. For EVLT, a thin laser fiber is inserted into the vein through a tiny needle puncture under ultrasound guidance. The laser energy heats and seals the vein. Sclerotherapy involves a series of small injections. Procedures typically take 30-60 minutes per leg.',
    recovery:
      'Patients walk out of the office and return to normal activities the same day. Compression stockings are worn for 1-2 weeks following treatment. Most patients see results within days for spider veins and within weeks for larger varicose veins. Multiple sessions may be needed for optimal cosmetic results.',
  },
  'liver-cancer': {
    whatItIs:
      'IYA Medical offers advanced interventional radiology treatments for liver cancer including transarterial chemoembolization (TACE), radioembolization (Y-90), and tumor ablation. TACE delivers chemotherapy drugs directly to the tumor through the hepatic artery while simultaneously blocking the tumor\'s blood supply. Radioembolization uses tiny radioactive beads to deliver targeted radiation. Ablation uses heat or cold to destroy tumor cells.',
    whoItsFor:
      'These treatments are appropriate for patients with hepatocellular carcinoma (HCC), liver metastases from other cancers, patients who are not candidates for surgical resection, or those who need tumor reduction before transplant (bridge therapy). Patients with multiple tumors or compromised liver function may particularly benefit from these targeted approaches.',
    whatToExpect:
      'Procedures are performed under conscious sedation. A catheter is inserted through a small puncture in the groin and guided to the hepatic artery using real-time X-ray imaging. For TACE, chemotherapy beads are delivered directly to the tumor. For Y-90, radioactive microspheres are injected. Ablation procedures use a needle probe guided by CT or ultrasound. Procedures typically take 1-3 hours.',
    recovery:
      'Most patients stay overnight for observation. Post-embolization syndrome (mild fever, nausea, pain) is common for a few days and is managed with medication. Most patients return to normal activities within 1-2 weeks. Follow-up imaging at 4-6 weeks evaluates treatment response. Multiple sessions may be scheduled depending on tumor response.',
  },
  'chronic-knee-pain': {
    whatItIs:
      'Genicular artery embolization (GAE) is an innovative, minimally invasive treatment for chronic knee pain associated with osteoarthritis. The procedure reduces abnormal blood vessel growth (neovascularization) around the knee joint, which is a source of inflammation and pain. By blocking these tiny abnormal vessels with microscopic particles, GAE can provide significant and lasting pain relief.',
    whoItsFor:
      'GAE is ideal for patients with mild to moderate knee osteoarthritis who have not responded to physical therapy, anti-inflammatory medications, or steroid injections. It is an excellent option for patients who want to delay or avoid knee replacement surgery. Patients should have pain that has persisted for at least 3 months despite conservative treatment.',
    whatToExpect:
      'The procedure is performed under local anesthesia with mild sedation. A tiny catheter is inserted through a small puncture in the upper thigh or wrist. Using advanced angiographic imaging, the interventional radiologist identifies the abnormal blood vessels around the knee and injects microscopic particles to block them. The procedure takes approximately 1-2 hours.',
    recovery:
      'Patients go home the same day. Most experience gradual pain relief over 2-4 weeks as inflammation subsides. There are no restrictions on weight-bearing, and patients can return to normal activities within a few days. Clinical studies show significant pain reduction in over 70% of patients, with benefits lasting 12 months or more.',
  },
}

export async function generateStaticParams() {
  return procedures.map((procedure) => ({
    slug: procedure.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const procedure = procedures.find((p) => p.slug === slug)

  if (!procedure) {
    return { title: 'Procedure Not Found | IYA Medical' }
  }

  return {
    title: `${procedure.title} Treatment | Scottsdale`,
    description: procedure.shortDescription,
    openGraph: {
      title: `${procedure.title} Treatment | IYA Medical Scottsdale`,
      description: procedure.shortDescription,
      url: `${siteConfig.url}/procedures/${procedure.slug}`,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${procedure.title} - IYA Medical` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${procedure.title} Treatment | IYA Medical Scottsdale`,
      description: procedure.shortDescription,
      images: ['/og-image.png'],
    },
  }
}

export default async function ProcedurePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const procedure = procedures.find((p) => p.slug === slug)

  if (!procedure) {
    notFound()
  }

  const doctor = doctors.find((d) => d.id === procedure.doctorId)
  const detailed = detailedContent[slug]
  const relatedProcedures = procedures
    .filter((p) => p.category === procedure.category && p.slug !== slug)
    .slice(0, 5)

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 to-teal-800 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-teal-200 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All Services
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            {procedure.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-teal-100">
            {procedure.shortDescription}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {detailed ? (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">What It Is</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed">{detailed.whatItIs}</p>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Who It&apos;s For</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed">{detailed.whoItsFor}</p>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">What to Expect</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed">{detailed.whatToExpect}</p>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Recovery</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed">{detailed.recovery}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">About This Procedure</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed">
                      {procedure.shortDescription}
                    </p>
                    <p className="mt-4 text-gray-600 leading-relaxed">
                      At IYA Medical, this procedure is performed using state-of-the-art imaging
                      guidance and minimally invasive techniques. Our approach means less pain,
                      lower risk, shorter recovery times, and excellent outcomes compared to
                      traditional surgical alternatives.
                    </p>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Why Choose IYA Medical</h2>
                    <ul className="mt-4 space-y-3 text-gray-600">
                      <li className="flex items-start gap-3">
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-teal-600" />
                        Board-certified interventional radiologist with extensive experience
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-teal-600" />
                        State-of-the-art ACR-accredited facility
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-teal-600" />
                        Minimally invasive approach with faster recovery
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-teal-600" />
                        Personalized treatment plans for every patient
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-teal-600" />
                        Three convenient locations in Scottsdale, AZ
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Doctor */}
              {doctor && (
                <div className="mt-10 rounded-xl border border-gray-100 bg-gray-50 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                      <User className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Performed by</p>
                      <Link
                        href={`/doctors/${doctor.id}`}
                        className="font-semibold text-gray-900 hover:text-teal-600"
                      >
                        {doctor.name}
                      </Link>
                      <p className="text-sm text-gray-500">{doctor.specialty}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA */}
                <div className="rounded-xl bg-teal-50 p-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Schedule a Consultation
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Find out if this treatment is right for you. Our team will review your case and
                    develop a personalized treatment plan.
                  </p>
                  <Link
                    href="/patient-intake"
                    className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-700"
                  >
                    <CalendarCheck className="h-4 w-4" />
                    Schedule Now
                  </Link>
                  <p className="mt-3 text-center text-sm text-gray-500">
                    or call{' '}
                    <a href={siteConfig.phoneHref} className="font-medium text-teal-600">
                      {siteConfig.phone}
                    </a>
                  </p>
                </div>

                {/* Related Procedures */}
                {relatedProcedures.length > 0 && (
                  <div className="rounded-xl border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900">Related Procedures</h3>
                    <ul className="mt-4 space-y-3">
                      {relatedProcedures.map((related) => (
                        <li key={related.slug}>
                          <Link
                            href={`/procedures/${related.slug}`}
                            className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-teal-600"
                          >
                            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                            {related.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { procedures } from '@/content/procedures'

const accordionItems = procedures.slice(0, 8).map((p) => ({
  id: p.slug,
  title: p.title,
  shortDescription: p.shortDescription,
  expandedText: getExpandedText(p.slug, p.shortDescription),
}))

function getExpandedText(slug: string, fallback: string): string {
  const details: Record<string, string> = {
    'peripheral-artery-disease-pad':
      'Peripheral artery disease occurs when plaque builds up in the arteries that carry blood to your legs. Our interventional radiologists perform angioplasty and stenting procedures using real-time imaging guidance to restore blood flow. These minimally invasive techniques require only a small puncture, avoiding the risks of open surgery. Most patients experience significant improvement in leg pain and walking ability, returning to normal activities within days rather than weeks.',
    'liver-cancer':
      'Our team specializes in targeted liver cancer treatments including transarterial chemoembolization (TACE) and yttrium-90 radioembolization. These catheter-based procedures deliver treatment directly to the tumor while sparing healthy liver tissue. Using advanced imaging guidance, we can treat tumors that may not be candidates for traditional surgery. Many patients experience tumor shrinkage and improved quality of life with minimal side effects compared to systemic chemotherapy.',
    'kidney-cancer':
      'For kidney tumors, we offer image-guided cryoablation and radiofrequency ablation as alternatives to partial or complete nephrectomy. A thin needle is guided directly into the tumor using CT or ultrasound imaging, then extreme cold or heat destroys the cancer cells while preserving surrounding kidney function. These outpatient procedures typically require only local anesthesia and conscious sedation, with patients returning home the same day.',
    'uterine-fibroids':
      'Uterine fibroid embolization (UFE) is a proven alternative to hysterectomy for women suffering from fibroid symptoms. Through a tiny puncture in the wrist or groin, our interventional radiologist threads a catheter to the uterine arteries and releases tiny particles that block blood flow to the fibroids. Without blood supply, fibroids shrink over time, relieving heavy bleeding, pelvic pressure, and pain. UFE preserves the uterus and requires significantly less recovery time than surgery.',
    'varicose-veins':
      'We offer state-of-the-art endovenous laser therapy (EVLT) and ultrasound-guided sclerotherapy for varicose and spider veins. These in-office procedures use targeted energy or medication to close damaged veins, rerouting blood to healthier vessels. Treatment takes about an hour with no general anesthesia. Most patients walk out of the office and return to work the next day. Results are both cosmetic and therapeutic, relieving leg heaviness, swelling, and discomfort.',
    'deep-vein-thrombosis-dvt':
      'Deep vein thrombosis is a serious condition where blood clots form in the deep veins of the legs. Our team performs catheter-directed thrombolysis, delivering clot-dissolving medication directly to the blockage through a thin catheter. For severe cases, mechanical thrombectomy devices can physically remove the clot. Early intervention helps prevent post-thrombotic syndrome and reduces the risk of life-threatening pulmonary embolism. We also place IVC filters when necessary to protect patients at high risk.',
    'prostate-artery-embolization':
      'Prostate artery embolization (PAE) is a breakthrough non-surgical option for men with benign prostatic hyperplasia (BPH). Through a tiny puncture in the wrist, microscopic particles are delivered to the prostate arteries, reducing blood flow and causing the prostate to shrink. Unlike traditional TURP surgery, PAE preserves sexual function and urinary continence. The outpatient procedure takes about two hours, and most men notice significant improvement in urinary symptoms within weeks.',
    'pelvic-congestion-syndrome':
      'Pelvic congestion syndrome affects millions of women, causing chronic pelvic pain from varicose veins around the uterus and ovaries. Our interventional radiologists perform ovarian vein embolization, a minimally invasive procedure that closes the dilated veins causing symptoms. Through a small catheter inserted in the neck or groin, tiny coils and a sclerosing agent are placed to seal the faulty veins. Most women experience significant pain relief within weeks and return to daily activities within days.',
  }
  return details[slug] ?? fallback
}

export function ProcedureAccordion() {
  const [openId, setOpenId] = useState<string | null>(accordionItems[0]?.id ?? null)

  const handleToggle = (id: string) => {
    setOpenId(prev => prev === id ? null : id)
  }

  return (
    <section suppressHydrationWarning className="bg-slate-950 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Our Procedures
          </p>
          <h2 className="mt-4 text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
            Explore your{' '}
            <span className="font-semibold">treatment options</span>
          </h2>
          <p className="mt-5 text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            Minimally invasive procedures that deliver maximum results with faster recovery times.
          </p>
        </div>

        {/* Accordion */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-slate-950/30">
          {accordionItems.map((item, index) => {
            const isOpen = openId === item.id

            return (
              <div key={item.id}>
                {/* Divider between items (not first) */}
                {index > 0 && <div className="mx-6 h-px bg-white/10" />}

                {/* Toggle button */}
                <button
                  onClick={() => handleToggle(item.id)}
                  className="group flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-300 hover:bg-cyan-300/10"
                  aria-expanded={isOpen}
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className={`text-base font-semibold transition-colors duration-200 ${isOpen ? 'text-cyan-200' : 'text-white group-hover:text-cyan-100'}`}>
                      {item.title}
                    </h3>
                    {!isOpen && (
                      <p className="mt-0.5 text-sm text-slate-500 truncate group-hover:text-slate-300">
                        {item.shortDescription}
                      </p>
                    )}
                  </div>

                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-950/50 transition-colors duration-300 group-hover:border-cyan-300/40 group-hover:bg-cyan-300/10">
                    {isOpen ? (
                      <Minus className="h-4 w-4 text-cyan-300" />
                    ) : (
                      <Plus className="h-4 w-4 text-slate-400 group-hover:text-cyan-300" />
                    )}
                  </div>
                </button>

                {/* Expandable body */}
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: isOpen ? '500px' : '0px',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="px-6 pb-5">
                    <p className="text-[15px] leading-relaxed text-slate-300">
                      {item.expandedText}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

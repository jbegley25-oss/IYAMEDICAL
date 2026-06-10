import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Brain, Activity, Zap, Heart, Eye, Moon, Stethoscope, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Neurology Services',
  description: 'Comprehensive neurology care in Scottsdale, AZ. Dr. Yazan Al-Hasan, MD, PhD specializes in epilepsy, migraines, seizures, stroke, movement disorders, and more. Call 480-771-0000.',
}

const conditions = [
  {
    icon: Zap,
    title: 'Epilepsy & Seizure Disorders',
    description: 'Comprehensive epilepsy management including diagnosis, medication optimization, EEG monitoring, and long-term seizure control. Dr. Al-Hasan is an epilepsy specialist with advanced training in seizure disorder management.',
  },
  {
    icon: Brain,
    title: 'Migraines & Headache Disorders',
    description: 'Expert diagnosis and treatment of chronic migraines, tension headaches, and cluster headaches. Treatment plans include preventive medications, Botox therapy, nerve blocks, and lifestyle modification strategies.',
  },
  {
    icon: Heart,
    title: 'Stroke Prevention & Recovery',
    description: 'Comprehensive stroke risk assessment, prevention strategies, and post-stroke rehabilitation. Includes carotid screening, blood thinner management, and recovery-focused neurological care.',
  },
  {
    icon: Activity,
    title: 'Movement Disorders',
    description: "Diagnosis and management of Parkinson's disease, essential tremor, dystonia, and other movement disorders. Treatment includes medication management, therapy referrals, and ongoing monitoring.",
  },
  {
    icon: Stethoscope,
    title: 'Cerebrovascular Disease',
    description: 'Evaluation and treatment of conditions affecting blood vessels in the brain, including TIA (mini-strokes), aneurysms, and vascular malformations. Close coordination with our interventional radiology team.',
  },
  {
    icon: Eye,
    title: 'Peripheral Neuropathy',
    description: 'Diagnosis and treatment of nerve damage causing numbness, tingling, and pain in the hands and feet. Includes nerve conduction studies (EMG/NCS), identifying underlying causes, and targeted treatment plans.',
  },
  {
    icon: Brain,
    title: 'Multiple Sclerosis',
    description: 'Comprehensive MS management including diagnosis, disease-modifying therapies, symptom management, and ongoing neurological monitoring to slow disease progression.',
  },
  {
    icon: Moon,
    title: 'Sleep Disorders',
    description: 'Evaluation of neurological sleep conditions including insomnia, restless leg syndrome, narcolepsy, and sleep apnea. Includes sleep study coordination and treatment planning.',
  },
  {
    icon: Brain,
    title: 'Memory & Cognitive Disorders',
    description: "Assessment and management of memory concerns, dementia, Alzheimer's disease, and age-related cognitive decline. Includes comprehensive cognitive testing and family counseling.",
  },
  {
    icon: Zap,
    title: 'Nerve & Muscle Disorders',
    description: 'Diagnosis and treatment of conditions like myasthenia gravis, ALS, muscular dystrophy, and carpal tunnel syndrome. Advanced EMG/NCS testing available on-site.',
  },
]

const diagnostics = [
  'Electroencephalogram (EEG)',
  'Electromyography (EMG)',
  'Nerve Conduction Studies (NCS)',
  'Cognitive & Memory Testing',
  'Balance & Vestibular Assessment',
  'Sleep Study Coordination',
  'MRI & CT Imaging (in-house)',
  'Carotid Ultrasound Screening',
]

export default function NeurologyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-200">Neurology</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Comprehensive Neurological Care
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-teal-100">
            Expert diagnosis and treatment for the full spectrum of neurological conditions.
            Led by Dr. Yazan Al-Hasan, MD, PhD — epilepsy specialist and board-certified neurologist.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a href="/patient-intake" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-teal-700 transition-colors hover:bg-teal-50">
              Schedule a Consultation <ArrowRight className="h-4 w-4" />
            </a>
            <a href="tel:+14807710000" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10">
              Call 480-771-0000
            </a>
          </div>
        </div>
      </section>

      {/* Lead Doctor */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 md:flex-row md:gap-12">
            <Image
              src="/images/doctors/yazan-al-hasan.png"
              alt="Dr. Yazan Al-Hasan"
              width={192}
              height={192}
              className="h-48 w-48 rounded-2xl object-cover shadow-lg"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Yazan Al-Hasan, MD, PhD</h2>
              <p className="mt-1 text-teal-600 font-medium">Board-Certified Neurologist &middot; Epilepsy Specialist</p>
              <p className="mt-4 max-w-2xl text-gray-600 leading-relaxed">
                Dr. Al-Hasan is a board-certified neurologist specializing in the diagnosis and treatment of neurological conditions.
                With advanced research training (PhD) and expertise in epilepsy and seizure disorders, he brings a comprehensive,
                evidence-based approach to patient care. He treats the full range of neurological conditions from migraines and
                movement disorders to stroke prevention and cognitive concerns.
              </p>
              <Link href="/doctors/dr-yazan-al-hasan" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700">
                View Full Profile <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Conditions We Treat */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">What We Treat</p>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Neurological Conditions & Services
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-500">
              From seizure disorders to stroke prevention, our neurology team provides expert care for the full spectrum of brain and nervous system conditions.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {conditions.map((condition) => {
              const Icon = condition.icon
              return (
                <div key={condition.title} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                    <Icon className="h-5 w-5 text-teal-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{condition.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{condition.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Diagnostic Services */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">Diagnostics</p>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Advanced Diagnostic Testing</h2>
              <p className="mt-4 text-gray-500 leading-relaxed">
                Accurate diagnosis is the foundation of effective treatment. Our neurology practice offers comprehensive
                diagnostic testing to identify the root cause of your symptoms and develop a targeted treatment plan.
              </p>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {diagnostics.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100">
                      <span className="h-2 w-2 rounded-full bg-teal-600" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <div className="inline-flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                <Brain className="h-16 w-16 text-teal-600" />
                <p className="text-lg font-semibold text-gray-900">IYA Medical Advantage</p>
                <p className="text-sm text-gray-500 max-w-sm">
                  Our neurology team works closely with IYA Medical&apos;s interventional radiology department,
                  providing seamless coordination for conditions that require both neurological evaluation
                  and image-guided treatment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-700 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Schedule Your Neurology Consultation</h2>
          <p className="mt-4 text-teal-100">
            Don&apos;t wait to address neurological symptoms. Early diagnosis leads to better outcomes.
            Contact us today to schedule an appointment with Dr. Al-Hasan.
          </p>
          <div className="mt-8 flex flex-col gap-4 justify-center sm:flex-row">
            <a href="/patient-intake" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-teal-700 hover:bg-teal-50">
              Start Patient Intake <ArrowRight className="h-4 w-4" />
            </a>
            <a href="tel:+14807710000" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-3 font-semibold text-white hover:bg-white/10">
              Call 480-771-0000
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

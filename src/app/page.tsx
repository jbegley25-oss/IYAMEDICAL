import { ImmersiveHero } from '@/components/home/immersive-hero'
import { SymptomExplorer } from '@/components/home/symptom-explorer'
import { TrustStats } from '@/components/home/trust-stats'
import { WhyChoose } from '@/components/home/why-choose'
import { ServicesPreview } from '@/components/home/services-preview'
import { DoctorCards } from '@/components/home/doctor-cards'
import { ProcedureAccordion } from '@/components/home/procedure-accordion'
import { InsuranceLogos } from '@/components/home/insurance-logos'
import { TestimonialsMasonry } from '@/components/home/testimonials-masonry'
import { LocationCards } from '@/components/home/location-cards'
import { CTASection } from '@/components/home/cta-section'
import ClickSpark from '@/components/ui/click-spark'

export default function Home() {
  return (
    <ClickSpark sparkColor="#ddd6fe" sparkSize={10} sparkRadius={16} sparkCount={8} duration={380}>
      <main className="bg-slate-950 text-white">
        <div className="relative isolate overflow-hidden bg-[#010712]">
          <div className="relative z-10">
            <ImmersiveHero />
            <SymptomExplorer />
          </div>
        </div>
        <TrustStats />
        <WhyChoose />
        <ServicesPreview />
        <DoctorCards />
        <ProcedureAccordion />
        <InsuranceLogos />
        <TestimonialsMasonry />
        <LocationCards />
        <CTASection />
      </main>
    </ClickSpark>
  )
}

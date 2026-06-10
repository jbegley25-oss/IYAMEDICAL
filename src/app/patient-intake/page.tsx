import type { Metadata } from "next";
import { IntakeChat } from "@/components/intake/chat-interface";

export const metadata: Metadata = {
  title: 'Online Patient Intake | AI-Powered Scheduling',
  description:
    'Complete your patient intake form with our AI-powered assistant. Quick, easy, and secure digital registration at IYA Medical, Scottsdale, AZ.',
  openGraph: {
    title: 'Online Patient Intake | AI-Powered Scheduling | IYA Medical',
    description:
      'Complete your patient intake online with our AI-powered assistant. Quick, easy, and HIPAA-secure.',
    url: 'https://iyamedical.com/patient-intake',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'IYA Medical Patient Intake' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Patient Intake | AI-Powered Scheduling | IYA Medical',
    description:
      'Complete your patient intake online with our AI-powered assistant. Quick, easy, and secure.',
    images: ['/og-image.png'],
  },
};

export default function PatientIntakePage() {
  return <IntakeChat />;
}

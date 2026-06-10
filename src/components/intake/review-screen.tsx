"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  Stethoscope,
  Shield,
  ArrowLeft,
  Send,
  Pencil,
  X,
  Loader2,
} from "lucide-react";

export type ExtractedData = {
  name: string;
  dob: string;
  phone: string;
  email: string;
  doctor: string;
  reason: string;
  symptoms: string;
  medical_history: string;
  medications: string;
  allergies: string;
  insurance: string;
};

type ReviewScreenProps = {
  data: ExtractedData;
  onSubmit: () => Promise<void>;
  onBack: () => void;
};

type SectionConfig = {
  title: string;
  icon: React.ReactNode;
  fields: { label: string; key: keyof ExtractedData }[];
};

const sections: SectionConfig[] = [
  {
    title: "Personal Information",
    icon: <User className="h-4 w-4" />,
    fields: [
      { label: "Full Name", key: "name" },
      { label: "Date of Birth", key: "dob" },
      { label: "Phone", key: "phone" },
      { label: "Email", key: "email" },
    ],
  },
  {
    title: "Appointment Details",
    icon: <Calendar className="h-4 w-4" />,
    fields: [
      { label: "Preferred Doctor", key: "doctor" },
      { label: "Reason for Visit", key: "reason" },
    ],
  },
  {
    title: "Medical Information",
    icon: <Stethoscope className="h-4 w-4" />,
    fields: [
      { label: "Current Symptoms", key: "symptoms" },
      { label: "Medical History", key: "medical_history" },
      { label: "Current Medications", key: "medications" },
      { label: "Known Allergies", key: "allergies" },
    ],
  },
  {
    title: "Insurance",
    icon: <Shield className="h-4 w-4" />,
    fields: [{ label: "Insurance Information", key: "insurance" }],
  },
];

export function ReviewScreen({ data, onSubmit, onBack }: ReviewScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div suppressHydrationWarning className="flex min-h-[calc(100vh-4rem)] flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="border-b border-white/5 bg-gray-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-white">
              Review Your Information
            </h1>
            <p className="text-xs text-gray-400">
              Please verify everything is correct before submitting
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="overflow-hidden rounded-xl bg-gray-800/40 ring-1 ring-white/5"
            >
              {/* Section Header */}
              <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600/20 text-brand-400">
                    {section.icon}
                  </div>
                  <h2 className="text-sm font-medium text-white">
                    {section.title}
                  </h2>
                </div>
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
              </div>

              {/* Fields */}
              <div className="divide-y divide-white/5 px-5">
                {section.fields.map((field) => (
                  <div
                    key={field.key}
                    className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:gap-4"
                  >
                    <span className="w-40 shrink-0 text-xs font-medium uppercase tracking-wider text-gray-500">
                      {field.label}
                    </span>
                    <span className="text-sm text-gray-200">
                      {data[field.key] || (
                        <span className="italic text-gray-600">
                          Not provided
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-white/5 bg-gray-950/90 px-4 py-5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <button
            onClick={() => setShowCancel(true)}
            className="rounded-lg px-4 py-2.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-600/20 transition-all hover:shadow-xl hover:shadow-brand-600/30 hover:brightness-110 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Intake
              </>
            )}
          </button>
        </div>
      </div>

      {/* Cancel Confirmation Overlay */}
      {showCancel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-4 w-full max-w-sm rounded-2xl bg-gray-800 p-6 ring-1 ring-white/10 shadow-2xl"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Cancel Intake?
                </h3>
                <p className="text-sm text-gray-400">
                  Your information will not be saved.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancel(false)}
                className="flex-1 rounded-lg bg-gray-700/50 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-700"
              >
                Keep Editing
              </button>
              <button
                onClick={() => {
                  window.location.href = "/";
                }}
                className="flex-1 rounded-lg bg-red-500/10 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
              >
                Yes, Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { CheckCircle, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function SuccessScreen() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md text-center"
      >
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
          className="mx-auto mb-8"
        >
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
            {/* Glow ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl"
            />
            {/* Outer ring */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 p-[2px]"
            >
              <div className="h-full w-full rounded-full bg-gray-950" />
            </motion.div>
            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.4,
              }}
            >
              <CheckCircle className="relative h-12 w-12 text-emerald-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <h1 className="text-2xl font-bold text-white">Intake Submitted!</h1>
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-gray-400">
            Thank you for completing your patient intake. Our scheduling team
            will contact you within{" "}
            <span className="font-medium text-gray-200">24-48 hours</span> to
            confirm your appointment.
          </p>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-6 rounded-xl bg-gray-800/40 p-4 ring-1 ring-white/5"
        >
          <p className="text-xs text-gray-500">
            Need immediate assistance? Call us at
          </p>
          <a
            href="tel:4807710000"
            className="mt-1 inline-block text-lg font-semibold text-brand-400 transition-colors hover:text-brand-300"
          >
            480-771-0000
          </a>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex flex-col gap-3"
        >
          <a
            href="https://healow.com/apps/practice/iya-medical-23655?v=2&t=1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-800/50 px-6 py-3 text-sm font-medium text-gray-200 ring-1 ring-white/10 transition-all hover:bg-gray-800 hover:text-white hover:ring-white/20"
          >
            <ExternalLink className="h-4 w-4" />
            Book on Healow Portal
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Return Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

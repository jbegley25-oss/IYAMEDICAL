"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-24">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>

        <h1 className="mt-8 text-3xl font-bold tracking-tight text-gray-900">
          Something Went Wrong
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-gray-600">
          We encountered an unexpected error. Please try again or contact our
          office if the problem persists.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 hover:shadow-md"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="mx-auto mt-12 h-px w-48 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <p className="mt-6 text-sm text-gray-500">
          Need immediate assistance? Call us at{" "}
          <a
            href="tel:+14807710000"
            className="font-medium text-teal-600 hover:text-teal-500"
          >
            480-771-0000
          </a>
        </p>
      </div>
    </main>
  );
}

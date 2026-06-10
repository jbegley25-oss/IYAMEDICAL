"use client";

import { useState, useEffect, useRef } from "react";
import { Lock, AlertCircle, Loader2 } from "lucide-react";

interface LoginProps {
  onAuthenticated: (token: string) => void;
}

export function AnalyticsLogin({ onAuthenticated }: LoginProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-login if valid token exists
  useEffect(() => {
    const stored = localStorage.getItem("iya_analytics_token");
    const expiry = localStorage.getItem("iya_analytics_expiry");
    if (stored && expiry && parseInt(expiry) > Date.now()) {
      onAuthenticated(stored);
    }
    setCheckingToken(false);
  }, [onAuthenticated]);

  useEffect(() => {
    if (!checkingToken) inputRef.current?.focus();
  }, [checkingToken]);

  async function handleSubmit(submittedCode?: string) {
    const toVerify = submittedCode || code;
    if (toVerify.length !== 6) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/analytics/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: toVerify }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("iya_analytics_token", data.token);
        localStorage.setItem("iya_analytics_expiry", data.expiry.toString());
        onAuthenticated(data.token);
      } else {
        setError(data.error || "Invalid code");
        setCode("");
        inputRef.current?.focus();
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(val);
    setError("");
    if (val.length === 6) handleSubmit(val);
  }

  if (checkingToken) {
    return (
      <div suppressHydrationWarning className="flex min-h-screen items-center justify-center bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 ring-1 ring-slate-700">
            <Lock className="h-8 w-8 text-teal-400" />
          </div>
          <h1 className="text-xl font-semibold text-white">IYA Medical Analytics</h1>
          <p className="mt-1 text-sm text-slate-400">Enter your 6-digit authentication code</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={handleChange}
              placeholder="000000"
              maxLength={6}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-4 text-center font-mono text-3xl tracking-[0.5em] text-white placeholder-slate-600 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={code.length !== 6 || loading}
            className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </span>
            ) : (
              "Verify & Access Dashboard"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Use your authenticator app to generate the code
        </p>
      </div>
    </div>
  );
}

import { z } from "zod";

// ── CORS ────────────────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = [
  "https://iyamedical.com",
  "https://www.iyamedical.com",
  process.env.NEXT_PUBLIC_SITE_URL,
  // Dev origins (stripped in production by the check below)
  ...(process.env.NODE_ENV !== "production"
    ? ["http://localhost:3000", "http://localhost:5173"]
    : []),
].filter(Boolean) as string[];

export function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin") || "";
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : "";

  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

export function corsPreflightResponse(request: Request): Response {
  return new Response(null, { headers: getCorsHeaders(request) });
}

// ── XSS Escaping ────────────────────────────────────────────────────────────

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => HTML_ESCAPE_MAP[c]);
}

// ── Input Validation Schemas ────────────────────────────────────────────────

export const intakeChatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(10_000),
      })
    )
    .max(60),
});

export const intakeExtractSchema = z.object({
  conversation: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(10_000),
      })
    )
    .max(60),
});

export const intakeSubmitSchema = z.object({
  conversation: z
    .array(
      z.object({
        role: z.string(),
        content: z.string().max(10_000),
      })
    )
    .max(60)
    .optional(),
  patientName: z.string().max(200).optional(),
  patientEmail: z.string().email().max(254).optional().or(z.literal("")),
  patientPhone: z.string().max(20).optional(),
  data: z
    .object({
      name: z.string().max(200).optional().default(""),
      dob: z.string().max(30).optional().default(""),
      phone: z.string().max(20).optional().default(""),
      email: z.string().max(254).optional().default(""),
      doctor: z.string().max(200).optional().default(""),
      reason: z.string().max(2000).optional().default(""),
      symptoms: z.string().max(5000).optional().default(""),
      medical_history: z.string().max(5000).optional().default(""),
      medications: z.string().max(2000).optional().default(""),
      allergies: z.string().max(2000).optional().default(""),
      insurance: z.string().max(500).optional().default(""),
    })
    .optional(),
});

export const copilotSchema = z.object({
  message: z.string().min(1).max(10_000),
  conversationId: z.string().max(100).optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().min(1).max(4096).optional(),
  promptType: z
    .enum([
      "general_assistant",
      "information_extraction",
      "code_assistant",
      "analysis",
      "creative",
    ])
    .optional(),
});

// ── Error Response ──────────────────────────────────────────────────────────

export function validationError(
  error: z.ZodError,
  corsHeaders: Record<string, string>
): Response {
  return Response.json(
    {
      error: "Validation failed",
      details: error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    },
    { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
  );
}

export function jsonError(
  message: string,
  status: number,
  corsHeaders: Record<string, string>
): Response {
  return Response.json(
    { error: message },
    { status, headers: { "Content-Type": "application/json", ...corsHeaders } }
  );
}

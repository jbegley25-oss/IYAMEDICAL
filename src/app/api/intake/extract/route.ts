import {
  getCorsHeaders,
  corsPreflightResponse,
  intakeExtractSchema,
  validationError,
  jsonError,
} from "@/lib/api-utils";

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function POST(request: Request) {
  const cors = getCorsHeaders(request);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400, cors);
  }

  const parsed = intakeExtractSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error, cors);

  const { conversation } = parsed.data;

  const extractionPrompt = `You are a data extraction assistant. Analyze the following patient intake conversation and extract structured data.

Return ONLY valid JSON with these exact fields (use empty string "" if not mentioned):
{
  "name": "",
  "dob": "",
  "phone": "",
  "email": "",
  "doctor": "",
  "reason": "",
  "symptoms": "",
  "medical_history": "",
  "medications": "",
  "allergies": "",
  "insurance": ""
}

For the "doctor" field, use the full name and title if mentioned (e.g., "Dr. Ayad Agha, DO - Interventional Radiology").
For "insurance", combine provider name and member ID if both are given.
Combine multiple items with commas where appropriate.`;

  const messages = [
    { role: "system" as const, content: extractionPrompt },
    {
      role: "user" as const,
      content: conversation
        .map(
          (msg) =>
            `${msg.role === "assistant" ? "Assistant" : "Patient"}: ${msg.content}`
        )
        .join("\n"),
    },
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  let response: globalThis.Response;
  try {
    const llmUrl =
      process.env.INTAKE_LLM_URL ||
      "https://elsewhere-thousand-shall-consolidated.trycloudflare.com/api/medical";
    const llmKey = process.env.INTAKE_LLM_KEY;
    if (!llmKey) {
      console.error("[intake/extract] INTAKE_LLM_KEY not configured");
      return jsonError("Extraction service not configured", 503, cors);
    }
    const model = process.env.INTAKE_MODEL || "medical-32b";
    response = await fetch(llmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": llmKey,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0,
        max_tokens: 800,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    const msg = err instanceof Error && err.name === "AbortError" ? "Request timeout" : "Extraction service unavailable";
    return jsonError(msg, 503, cors);
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    console.error(`[intake/extract] LLM error: ${response.status}`);
    return jsonError("Extraction service error", 502, cors);
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;

  try {
    const extracted = JSON.parse(content);
    return Response.json(extracted, { headers: cors });
  } catch {
    return jsonError("Failed to parse extraction result", 500, cors);
  }
}

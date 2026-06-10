import {
  getCorsHeaders,
  corsPreflightResponse,
  copilotSchema,
  validationError,
  jsonError,
} from "@/lib/api-utils";

const CHATBOT_BACKEND_URL = process.env.CHATBOT_BACKEND_URL;

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function POST(request: Request) {
  const cors = getCorsHeaders(request);

  // ── Require authentication ────────────────────────────────────
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return jsonError("Authentication required", 401, cors);
  }

  if (!CHATBOT_BACKEND_URL) {
    return jsonError("Copilot backend not configured", 503, cors);
  }

  // ── Validate input ────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400, cors);
  }

  const parsed = copilotSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error, cors);

  const data = parsed.data;

  // ── Forward to chatbot backend ────────────────────────────────
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  let backendResponse: globalThis.Response;
  try {
    backendResponse = await fetch(`${CHATBOT_BACKEND_URL}/api/v1/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        message: data.message,
        conversation_id: data.conversationId,
        stream: true,
        temperature: data.temperature ?? 0.7,
        max_tokens: data.maxTokens ?? 1024,
        prompt_type: data.promptType ?? "general_assistant",
      }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    const msg = err instanceof Error && err.name === "AbortError" ? "Backend timeout" : "Backend unavailable";
    return jsonError(msg, 503, cors);
  } finally {
    clearTimeout(timeout);
  }

  if (!backendResponse.ok) {
    // Never leak backend internals to client
    console.error(`[copilot] Backend error: ${backendResponse.status}`);
    return jsonError("Copilot service error", 502, cors);
  }

  return new Response(backendResponse.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-store",
      Connection: "keep-alive",
      ...cors,
    },
  });
}

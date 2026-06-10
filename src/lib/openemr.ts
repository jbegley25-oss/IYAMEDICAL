/**
 * OpenEMR API Client for iyamedical.com
 *
 * Handles OAuth2 authentication and patient/encounter creation via OpenEMR REST API.
 * Used by the intake submission flow to push patient data into the EMR.
 */

// ── Configuration (validated at module load) ────────────────────────────────

const OPENEMR_BASE_URL = process.env.OPENEMR_BASE_URL || "http://127.0.0.1:8300";
const OPENEMR_SITE = process.env.OPENEMR_SITE || "default";
const OPENEMR_CLIENT_ID = process.env.OPENEMR_CLIENT_ID || "";
const OPENEMR_CLIENT_SECRET = process.env.OPENEMR_CLIENT_SECRET || "";
const OPENEMR_USER = process.env.OPENEMR_USER || "";
const OPENEMR_PASS = process.env.OPENEMR_PASS || "";

const REQUEST_TIMEOUT_MS = 15_000;

function validateConfig(): void {
  const missing: string[] = [];
  if (!OPENEMR_CLIENT_ID) missing.push("OPENEMR_CLIENT_ID");
  if (!OPENEMR_USER) missing.push("OPENEMR_USER");
  if (!OPENEMR_PASS) missing.push("OPENEMR_PASS");
  if (missing.length > 0) {
    throw new Error(`OpenEMR config missing: ${missing.join(", ")}`);
  }
}

// ── Token management with mutex to prevent race conditions ──────────────────

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

let cachedToken: { token: string; expiresAt: number } | null = null;
let tokenRefreshPromise: Promise<string> | null = null;

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 30s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 30_000) {
    return cachedToken.token;
  }

  // If another request is already refreshing, wait for it
  if (tokenRefreshPromise) {
    return tokenRefreshPromise;
  }

  // Start a new refresh (acts as a mutex)
  tokenRefreshPromise = (async () => {
    try {
      const tokenUrl = `${OPENEMR_BASE_URL}/oauth2/${OPENEMR_SITE}/token`;

      const body = new URLSearchParams({
        grant_type: "password",
        username: OPENEMR_USER,
        password: OPENEMR_PASS,
        client_id: OPENEMR_CLIENT_ID,
        scope: "openid api:oemr api:fhir",
        user_role: "users",
      });

      if (OPENEMR_CLIENT_SECRET) {
        body.set("client_secret", OPENEMR_CLIENT_SECRET);
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      let res: Response;
      try {
        res = await fetch(tokenUrl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }

      if (!res.ok) {
        const errText = await res.text().catch(() => "unknown");
        throw new Error(`OpenEMR auth failed (${res.status}): ${errText}`);
      }

      const data: TokenResponse = await res.json();
      cachedToken = {
        token: data.access_token,
        expiresAt: Date.now() + data.expires_in * 1000,
      };
      return data.access_token;
    } finally {
      tokenRefreshPromise = null;
    }
  })();

  return tokenRefreshPromise;
}

// ── API request helper with timeouts and path validation ────────────────────

async function apiRequest(
  method: string,
  path: string,
  body?: Record<string, unknown>
): Promise<{ ok: boolean; status: number; data: Record<string, unknown> }> {
  // Path traversal prevention
  if (!path.startsWith("/") || path.includes("..")) {
    throw new Error(`Invalid API path: ${path}`);
  }

  const token = await getAccessToken();
  const url = `${OPENEMR_BASE_URL}/apis/${OPENEMR_SITE}/api${path}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(`OpenEMR request timeout: ${method} ${path}`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }

  // Handle 401 by clearing token cache (will retry on next call)
  if (res.status === 401) {
    cachedToken = null;
  }

  const data = await res.json().catch(() => {
    console.warn(`[openemr] Non-JSON response for ${method} ${path}: ${res.status}`);
    return {} as Record<string, unknown>;
  });

  return { ok: res.ok, status: res.status, data };
}

// ── Types ───────────────────────────────────────────────────────────────────

export type IntakeData = {
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

// ── Parsing helpers ─────────────────────────────────────────────────────────

function parseName(fullName: string): { fname: string; lname: string; mname: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { fname: parts[0], lname: "", mname: "" };
  if (parts.length === 2) return { fname: parts[0], lname: parts[1], mname: "" };
  return { fname: parts[0], mname: parts.slice(1, -1).join(" "), lname: parts[parts.length - 1] };
}

function parseDob(dob: string): string {
  const trimmed = dob.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const mdyMatch = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (mdyMatch) {
    return `${mdyMatch[3]}-${mdyMatch[1].padStart(2, "0")}-${mdyMatch[2].padStart(2, "0")}`;
  }

  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split("T")[0];
  }

  return trimmed;
}

// ── Patient operations ──────────────────────────────────────────────────────

export async function searchPatient(
  fname: string,
  lname: string,
  dob: string
): Promise<Record<string, unknown> | null> {
  const params = new URLSearchParams({ fname, lname, DOB: dob });
  const result = await apiRequest("GET", `/patient?${params.toString()}`);
  if (result.ok && Array.isArray(result.data)) {
    return (result.data as Record<string, unknown>[])[0] || null;
  }
  const dataArr = (result.data as Record<string, unknown>)?.data;
  if (Array.isArray(dataArr) && dataArr.length > 0) {
    return dataArr[0] as Record<string, unknown>;
  }
  return null;
}

export async function createPatient(intake: IntakeData): Promise<string> {
  validateConfig();

  const { fname, lname, mname } = parseName(intake.name);
  const dob = parseDob(intake.dob);

  // Deduplicate: check for existing patient first
  if (fname && lname && dob) {
    const existing = await searchPatient(fname, lname, dob);
    if (existing?.uuid) {
      return existing.uuid as string;
    }
  }

  const patientData: Record<string, unknown> = {
    fname,
    lname,
    mname,
    DOB: dob,
    sex: "Unknown",
    phone_cell: intake.phone,
    email: intake.email,
    street: "",
    city: "Scottsdale",
    state: "AZ",
    postal_code: "",
    country_code: "US",
  };

  const result = await apiRequest("POST", "/patient", patientData);
  if (!result.ok) {
    throw new Error(`Failed to create patient (${result.status})`);
  }

  const uuid = (result.data as Record<string, unknown>)?.uuid
    || ((result.data as Record<string, unknown>)?.data as Record<string, unknown>)?.uuid;

  if (!uuid) {
    throw new Error("Patient created but no UUID returned");
  }

  return uuid as string;
}

export async function createEncounter(
  patientUuid: string,
  reason: string,
): Promise<string> {
  const today = new Date().toISOString().split("T")[0];

  const encounterData = {
    date: today,
    reason: `Patient Intake - ${reason}`.slice(0, 255),
    facility_id: parseInt(process.env.OPENEMR_FACILITY_ID || "1", 10),
    pc_catid: 5,
    class_code: "AMB",
    onset_date: today,
  };

  const result = await apiRequest(
    "POST",
    `/patient/${patientUuid}/encounter`,
    encounterData
  );

  if (!result.ok) {
    throw new Error(`Failed to create encounter (${result.status})`);
  }

  const eid = (result.data as Record<string, unknown>)?.uuid
    || ((result.data as Record<string, unknown>)?.data as Record<string, unknown>)?.uuid;
  return (eid || "unknown") as string;
}

// ── Clinical data (non-critical — failures logged, not thrown) ───────────────

export async function addAllergies(patientUuid: string, text: string): Promise<void> {
  if (!text || text.toLowerCase() === "none" || text === "N/A") return;
  const items = text.split(/[,;]/).map((a) => a.trim()).filter(Boolean);

  for (const item of items) {
    await apiRequest("POST", `/patient/${patientUuid}/allergy`, {
      title: item.slice(0, 255),
      begdate: new Date().toISOString().split("T")[0],
      type: "allergy",
    }).catch(() => {
      console.warn(`[openemr] Failed to add allergy "${item}" for ${patientUuid}`);
    });
  }
}

export async function addMedicalProblems(patientUuid: string, text: string): Promise<void> {
  if (!text || text.toLowerCase() === "none" || text === "N/A") return;
  const items = text.split(/[,;]/).map((h) => h.trim()).filter(Boolean);

  for (const item of items) {
    await apiRequest("POST", `/patient/${patientUuid}/medical_problem`, {
      title: item.slice(0, 255),
      begdate: new Date().toISOString().split("T")[0],
      type: "medical_problem",
    }).catch(() => {
      console.warn(`[openemr] Failed to add problem "${item}" for ${patientUuid}`);
    });
  }
}

export async function addMedications(patientUuid: string, text: string): Promise<void> {
  if (!text || text.toLowerCase() === "none" || text === "N/A") return;
  const items = text.split(/[,;]/).map((m) => m.trim()).filter(Boolean);

  for (const item of items) {
    await apiRequest("POST", `/patient/${patientUuid}/medication`, {
      title: item.slice(0, 255),
      begdate: new Date().toISOString().split("T")[0],
      type: "medication",
    }).catch(() => {
      console.warn(`[openemr] Failed to add medication "${item}" for ${patientUuid}`);
    });
  }
}

// ── Full intake submission ──────────────────────────────────────────────────

export async function submitIntakeToOpenEMR(intake: IntakeData): Promise<{
  patientUuid: string;
  encounterUuid: string;
}> {
  const patientUuid = await createPatient(intake);

  const encounterUuid = await createEncounter(
    patientUuid,
    intake.reason,
  );

  // Clinical data in parallel (non-blocking for speed)
  await Promise.allSettled([
    addAllergies(patientUuid, intake.allergies),
    addMedicalProblems(patientUuid, intake.medical_history),
    addMedications(patientUuid, intake.medications),
  ]);

  return { patientUuid, encounterUuid };
}

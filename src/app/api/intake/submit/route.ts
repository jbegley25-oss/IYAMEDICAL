import { submitIntakeToOpenEMR, type IntakeData } from "@/lib/openemr";
import {
  getCorsHeaders,
  corsPreflightResponse,
  intakeSubmitSchema,
  validationError,
  jsonError,
  escapeHtml,
} from "@/lib/api-utils";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

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

  const parsed = intakeSubmitSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error, cors);

  const { conversation, patientName, patientEmail, patientPhone, data } = parsed.data;

  const intake: IntakeData = {
    name: data?.name || patientName || "",
    dob: data?.dob || "",
    phone: data?.phone || patientPhone || "",
    email: data?.email || patientEmail || "",
    doctor: data?.doctor || "",
    reason: data?.reason || "",
    symptoms: data?.symptoms || "",
    medical_history: data?.medical_history || "",
    medications: data?.medications || "",
    allergies: data?.allergies || "",
    insurance: data?.insurance || "",
  };

  // ── Push to OpenEMR ─────────────────────────────────────────────
  let emrResult: { patientUuid: string; encounterUuid: string } | null = null;
  let emrError: string | null = null;

  if (process.env.OPENEMR_BASE_URL && process.env.OPENEMR_USER) {
    try {
      emrResult = await submitIntakeToOpenEMR(intake);
    } catch (err) {
      emrError = err instanceof Error ? err.message : String(err);
      console.error("[intake/submit] OpenEMR submission failed:", emrError);
    }
  }

  // ── Build notification emails (all values HTML-escaped) ─────────
  const e = {
    name: escapeHtml(intake.name || "N/A"),
    dob: escapeHtml(intake.dob || "N/A"),
    phone: escapeHtml(intake.phone || "N/A"),
    email: escapeHtml(intake.email || "N/A"),
    doctor: escapeHtml(intake.doctor || "N/A"),
    reason: escapeHtml(intake.reason || "N/A"),
    symptoms: escapeHtml(intake.symptoms || "N/A"),
    medical_history: escapeHtml(intake.medical_history || "N/A"),
    medications: escapeHtml(intake.medications || "N/A"),
    allergies: escapeHtml(intake.allergies || "N/A"),
    insurance: escapeHtml(intake.insurance || "N/A"),
  };

  const internalEmailHtml = `
    <h2>New Patient Intake Submission</h2>
    ${emrResult ? `<p style="color:green;font-weight:bold;">Patient created in OpenEMR (ID: ${escapeHtml(emrResult.patientUuid)})</p>` : ""}
    ${emrError ? `<p style="color:orange;font-weight:bold;">OpenEMR sync failed &mdash; manual entry required</p>` : ""}
    ${!process.env.OPENEMR_BASE_URL ? `<p style="color:gray;">OpenEMR integration not configured</p>` : ""}
    <hr/>
    <h3>Patient Information</h3>
    <table style="border-collapse:collapse;width:100%;">
      <tr><td style="padding:6px;font-weight:bold;width:180px;">Name:</td><td style="padding:6px;">${e.name}</td></tr>
      <tr><td style="padding:6px;font-weight:bold;">Date of Birth:</td><td style="padding:6px;">${e.dob}</td></tr>
      <tr><td style="padding:6px;font-weight:bold;">Phone:</td><td style="padding:6px;">${e.phone}</td></tr>
      <tr><td style="padding:6px;font-weight:bold;">Email:</td><td style="padding:6px;">${e.email}</td></tr>
    </table>
    <h3>Appointment Details</h3>
    <table style="border-collapse:collapse;width:100%;">
      <tr><td style="padding:6px;font-weight:bold;width:180px;">Preferred Doctor:</td><td style="padding:6px;">${e.doctor}</td></tr>
      <tr><td style="padding:6px;font-weight:bold;">Reason for Visit:</td><td style="padding:6px;">${e.reason}</td></tr>
      <tr><td style="padding:6px;font-weight:bold;">Symptoms:</td><td style="padding:6px;">${e.symptoms}</td></tr>
    </table>
    <h3>Medical Information</h3>
    <table style="border-collapse:collapse;width:100%;">
      <tr><td style="padding:6px;font-weight:bold;width:180px;">Medical History:</td><td style="padding:6px;">${e.medical_history}</td></tr>
      <tr><td style="padding:6px;font-weight:bold;">Medications:</td><td style="padding:6px;">${e.medications}</td></tr>
      <tr><td style="padding:6px;font-weight:bold;">Allergies:</td><td style="padding:6px;">${e.allergies}</td></tr>
      <tr><td style="padding:6px;font-weight:bold;">Insurance:</td><td style="padding:6px;">${e.insurance}</td></tr>
    </table>
    <h3>Full Conversation</h3>
    <div style="background:#f5f5f5;padding:16px;border-radius:8px;font-size:13px;">
      ${
        conversation
          ?.map(
            (msg) =>
              `<p><strong>${msg.role === "assistant" ? "IYA Assistant" : "Patient"}:</strong> ${escapeHtml(msg.content)}</p>`
          )
          .join("") || "No conversation recorded"
      }
    </div>
  `;

  // HIPAA-minimal patient confirmation (no medical details)
  const patientEmailHtml = `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;">
      <h2 style="color:#0891b2;">IYA Medical - Intake Received</h2>
      <p>Hi ${e.name},</p>
      <p>Thank you for completing your patient intake form. Here's a summary:</p>
      <table style="border-collapse:collapse;width:100%;">
        <tr><td style="padding:6px;font-weight:bold;">Name:</td><td style="padding:6px;">${e.name}</td></tr>
        <tr><td style="padding:6px;font-weight:bold;">Phone:</td><td style="padding:6px;">${e.phone}</td></tr>
        <tr><td style="padding:6px;font-weight:bold;">Reason:</td><td style="padding:6px;">${e.reason}</td></tr>
      </table>
      <p>Our scheduling team will contact you within <strong>24-48 hours</strong> to confirm your appointment.</p>
      ${emrResult ? `<p>Your patient record has been securely created in our system.</p>` : ""}
      <p>If you need immediate assistance, call us at <strong>480-771-0000</strong>.</p>
      <br/>
      <p style="color:#666;font-size:12px;">IYA Medical<br/>9201 E. Mountain View Rd., Suite 130<br/>Scottsdale, AZ 85258</p>
    </div>
  `;

  // ── Send emails via AWS SES ─────────────────────────────────────
  const fromEmail = process.env.SES_FROM_EMAIL || "scheduling@iyamedical.com";
  let emailSent = false;

  if (process.env.AWS_ACCESS_KEY_ID || process.env.SES_ACCESS_KEY_ID) {
    const ses = new SESClient({
      region: process.env.AWS_REGION || "us-west-2",
      ...(process.env.SES_ACCESS_KEY_ID && {
        credentials: {
          accessKeyId: process.env.SES_ACCESS_KEY_ID,
          secretAccessKey: process.env.SES_SECRET_ACCESS_KEY || "",
        },
      }),
    });

    try {
      // Internal notification to scheduling team
      await ses.send(new SendEmailCommand({
        Source: fromEmail,
        Destination: { ToAddresses: [fromEmail] },
        Message: {
          Subject: { Data: `New Patient Intake: ${intake.name || "Unknown"}` },
          Body: { Html: { Data: internalEmailHtml } },
        },
      }));

      // Patient confirmation (only if email provided)
      if (intake.email) {
        await ses.send(new SendEmailCommand({
          Source: fromEmail,
          Destination: { ToAddresses: [intake.email] },
          Message: {
            Subject: { Data: "IYA Medical - Intake Received" },
            Body: { Html: { Data: patientEmailHtml } },
          },
        }));
      }

      emailSent = true;
    } catch (err) {
      console.error("[intake/submit] SES email error:", err instanceof Error ? err.message : err);
    }
  } else {
    console.log("[intake/submit] SES not configured — logging emails to console");
    console.log(`Internal email for: ${intake.name}`);
    if (intake.email) console.log(`Patient confirmation to: ${intake.email}`);
  }

  return Response.json(
    {
      success: true,
      openemr: emrResult
        ? { synced: true, patientId: emrResult.patientUuid }
        : { synced: false, error: emrError || "Not configured" },
      email: { sent: emailSent },
    },
    { headers: cors }
  );
}

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { tokenStore } from "@/lib/analytics-auth";

// ── TOTP secret (read at runtime, validated in handler) ──────────────────
function getTotpSecret(): string {
  const secret = process.env.ANALYTICS_TOTP_SECRET || "";
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("ANALYTICS_TOTP_SECRET environment variable is required in production");
  }
  return secret;
}

// ── Base32 decode ──────────────────────────────────────────────────────────
function base32Decode(encoded: string): Buffer {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const stripped = encoded.replace(/=+$/, "").toUpperCase();
  let bits = "";
  for (const char of stripped) {
    const val = alphabet.indexOf(char);
    if (val === -1) throw new Error("Invalid base32 character");
    bits += val.toString(2).padStart(5, "0");
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

// ── TOTP generation ────────────────────────────────────────────────────────
function generateTOTP(secret: string, timeStep: number = 30, digits: number = 6): string {
  const key = base32Decode(secret);
  const epoch = Math.floor(Date.now() / 1000);
  const counter = Math.floor(epoch / timeStep);

  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeUInt32BE(0, 0);
  counterBuffer.writeUInt32BE(counter, 4);

  const hmac = crypto.createHmac("sha1", key).update(counterBuffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = binary % Math.pow(10, digits);
  return otp.toString().padStart(digits, "0");
}

// ── Verify TOTP with +-1 window ────────────────────────────────────────────
function verifyTOTP(code: string, secret: string): boolean {
  const timeStep = 30;
  const epoch = Math.floor(Date.now() / 1000);

  for (let i = -1; i <= 1; i++) {
    const counter = Math.floor(epoch / timeStep) + i;
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeUInt32BE(0, 0);
    counterBuffer.writeUInt32BE(counter, 4);

    const key = base32Decode(secret);
    const hmac = crypto.createHmac("sha1", key).update(counterBuffer).digest();
    const offset = hmac[hmac.length - 1] & 0x0f;
    const binary =
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff);

    const otp = (binary % 1000000).toString().padStart(6, "0");
    if (otp === code) return true;
  }
  return false;
}

// ── POST handler ───────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== "string" || code.length !== 6) {
      return NextResponse.json({ success: false, error: "Invalid code format" }, { status: 400 });
    }

    if (!verifyTOTP(code, getTotpSecret())) {
      return NextResponse.json({ success: false, error: "Invalid code" }, { status: 401 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 86400 * 1000; // 24 hours
    tokenStore.set(token, expiry);

    // Clean expired tokens
    for (const [t, exp] of tokenStore.entries()) {
      if (exp < Date.now()) tokenStore.delete(t);
    }

    return NextResponse.json({ success: true, token, expiry });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

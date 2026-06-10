import type { NextConfig } from "next";

// Hidden staff-only gateway to the DGX-hosted OpenEMR.
// Rotate-friendly: set EMR_URL at deploy time to swap without a code change.
// Default falls back to the current dev cloudflared tunnel.
const EMR_URL =
  process.env.EMR_URL ??
  "https://retain-universities-pay-entrance.trycloudflare.com";

const nextConfig: NextConfig = {
  output: "standalone",
  images: { unoptimized: true },

  redirects: async () => [
    // /emr and /emr/<anything> bounce to the on-prem OpenEMR.
    // 307 keeps the method intact and stays un-cached so we can move the
    // target at any time. basePath:false allows an off-site destination.
    {
      source: "/emr",
      destination: EMR_URL,
      permanent: false,
      basePath: false,
    },
    {
      source: "/emr/:path*",
      destination: `${EMR_URL}/:path*`,
      permanent: false,
      basePath: false,
    },
  ],

  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "geolocation=(), microphone=(), camera=(), payment=()",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self' https://api.openai.com https://*.iyamedical.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join("; "),
        },
      ],
    },
  ],
};

export default nextConfig;

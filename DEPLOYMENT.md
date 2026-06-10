# IYA Medical - OpenEMR Integration Deployment

This branch adds full OpenEMR integration to iyamedical.com. When a patient completes the AI intake chatbot, their data automatically creates a patient record, encounter, allergies, medications, and medical problems in OpenEMR.

## What Changed

### New Files
| File | Purpose |
|------|---------|
| `src/lib/openemr.ts` | OpenEMR REST API client (OAuth2, patient CRUD, encounters, clinical data) |
| `src/lib/api-utils.ts` | Shared CORS whitelist, XSS escaping, Zod validation schemas |
| `src/app/api/copilot/route.ts` | AI copilot bridge to chatbot backend |
| `src/app/portal/page.tsx` | Patient portal page linking to OpenEMR |
| `src/app/error.tsx` | Global error boundary |
| `src/app/loading.tsx` | Loading skeleton |
| `src/app/sitemap.ts` | SEO sitemap (41 URLs) |
| `src/app/robots.ts` | Search engine directives |
| `src/middleware.ts` | Rate limiting, path blocking, security headers |
| `Dockerfile` | Multi-stage Node 22 Alpine production build |
| `.dockerignore` | Docker build exclusions |
| `.env.example` | All required environment variables |

### Modified Files
| File | Change |
|------|--------|
| `next.config.ts` | Added CSP, HSTS, X-Frame-Options, Permissions-Policy headers |
| `src/content/site.ts` | Added Patients nav dropdown (Forms, Intake, Portal) |
| `src/app/api/intake/submit/route.ts` | Now pushes to OpenEMR + sends AWS SES emails |
| `src/app/api/intake/chat/route.ts` | Uses local LLM (Qwen 32B via Ollama) instead of OpenAI |
| `src/app/api/intake/extract/route.ts` | Uses local LLM for data extraction |
| `src/app/api/analytics/auth/route.ts` | TOTP secret moved from hardcoded to env var |
| `src/app/api/analytics/track/route.ts` | Fixed wildcard CORS |
| `package.json` | Added `@aws-sdk/client-ses` for email |

### Security Fixes
- All API routes: wildcard CORS (`*`) replaced with domain whitelist
- All user input in email HTML templates: XSS-escaped with `escapeHtml()`
- Zod input validation on all API routes
- Rate limiting via middleware (per-IP, per-route)
- Sensitive path blocking (`.env`, `.git`, `.sql`)
- TOTP secret: env var only, fails in production if missing
- OpenEMR client: token refresh mutex, 15s timeouts, path traversal prevention

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# Required
OPENAI_API_KEY=ollama                           # or sk-... for OpenAI
OPENAI_BASE_URL=http://localhost:11434/v1       # Ollama endpoint
INTAKE_MODEL=qwen2.5:32b-instruct              # Local LLM model

# OpenEMR (required for intake -> EMR sync)
OPENEMR_BASE_URL=http://localhost:8300
OPENEMR_CLIENT_ID=<from OpenEMR admin>
OPENEMR_USER=admin
OPENEMR_PASS=<your password>

# AWS SES (required for email notifications)
SES_ACCESS_KEY_ID=AKIA...
SES_SECRET_ACCESS_KEY=...
AWS_REGION=us-west-2

# Analytics
ANALYTICS_TOTP_SECRET=<base32 secret>
```

## Running Locally

```bash
npm install
npm run dev
```

## Docker (Production)

See `docker-compose.unified.yml` in the parent `AutomationProject/` directory. This runs the full stack: iyamedical.com + OpenEMR + AI Chatbot + Nginx.

```bash
docker compose -f docker-compose.unified.yml up -d
```

## Full deployment guide

See `DEPLOYMENT_EMAIL_FOR_SAIF.md` in the parent directory for the complete 11-step EC2 deployment guide.

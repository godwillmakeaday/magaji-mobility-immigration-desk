# Magaji Law — Mobility & Immigration Desk

A premium, compliance-conscious Next.js landing page for **Magaji Law Mobility &
Immigration Desk**: a Nigerian legal, documentation, mobility-risk and licensed-
partner desk. The page reviews visa promises, foreign job offers, travel and
study documents, and diaspora legal needs — it does **not** sell or guarantee
visas.

## Stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS
- Self-hosted fonts via `@fontsource` (Cinzel, Libre Franklin) — never `next/font/google`
- No database, no auth, no payment integration
- Fully static — deploys cleanly to Vercel

## Design system

| Token        | Value      | Role                                  |
| ------------ | ---------- | ------------------------------------- |
| `paper`      | `#FBFAF7`  | Off-white background                  |
| `ink`        | `#14213D`  | Deep navy — display + primary text    |
| `charcoal`   | `#23262B`  | Body text / dark sections             |
| `brass`      | `#B08D57`  | Brass/gold accent (Magaji Law mark)   |
| `forest`     | `#2F5D4F`  | Muted green — verification/compliance |
| `clay`       | `#7A2E2A`  | Restrained warning red (red flags)    |

Display face **Cinzel** (Magaji Law identity), body **Libre Franklin**. The
signature element is the **Mobility Review Ledger** in the hero and the recurring
**ML seal**.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build / preview:

```bash
npm run build
npm start
```

## Project structure

```
app/
  layout.tsx        # fonts + metadata
  page.tsx          # composes all sections
  globals.css       # Tailwind layers + base styles
components/
  SiteHeader.tsx
  Hero.tsx
  ProblemSection.tsx
  ServicesSection.tsx
  ComplianceSection.tsx
  PackagesSection.tsx
  ProcessSection.tsx
  DestinationDesks.tsx
  RedFlagsSection.tsx
  CTASection.tsx
  Footer.tsx
  Button.tsx        # reusable CTA
  icons.tsx         # inline SVG icons + ML seal (no icon deps)
tailwind.config.ts
```

## Deploy to Vercel

1. Push this folder to a GitHub repo (Termux → GitHub → Vercel flow works as
   usual; the build runs on Vercel, not locally).
2. Import the repo in Vercel. Framework preset auto-detects **Next.js** — no
   config needed.
3. Build command `next build`, output handled automatically. Deploy.

No environment variables are required.

## Conversion layer (intake, risk checker, WhatsApp flow)

Front-end only — no database, auth, payment, or real upload. Visitors can:

1. **Request a Mobility Review** — the grouped intake form at `#contact`
   (`MobilityIntakeForm`). On submit it opens WhatsApp with a structured,
   pre-filled message. Requires name, phone, and the compliance acknowledgment.
2. **Check the Risk Before You Pay** — the interactive checklist at
   `#risk-checker` (`RiskChecker`). Ticking red flags computes a live risk tier
   (Low / Moderate / High / Severe) and builds a WhatsApp message summarising the
   result. Includes destination and main-concern fields.
3. **Contact via WhatsApp** — every action routes through one `wa.me` deep link
   with the details arranged for the recipient.

New components: `MobilityIntakeForm`, `RiskChecker`, `RiskResultCard`,
`WhatsAppButton`, `ComplianceNotice`, `FormField`, plus `lib/whatsapp.ts`.

### Replace the WhatsApp number (one place)

Open **`lib/whatsapp.ts`** and change:

```ts
export const WHATSAPP_NUMBER = "234XXXXXXXXXX";
```

to the real number in international format — digits only, no `+`, no spaces.
Example for Nigeria `0803 000 0000` → `"2348030000000"`. Every button and both
message flows read from this constant, so nothing else needs editing.

> Note: while the placeholder still contains `X`s, the generated links resolve to
> `wa.me/234` (the letters are stripped). This is expected — it becomes a complete
> link the moment you insert the real digits.

## Full-stack backend (v2): database, admin console, matter tracking

This version adds Prisma + PostgreSQL (Neon), API routes, and a password-gated
`/admin` operations console. Submissions from the intake form and the risk
checker are now persisted and manageable.

### Stack additions
- **Prisma 7** with the **Neon driver adapter** (`@prisma/adapter-neon` +
  `@neondatabase/serverless`). This is the Rust-engine-free client, which is the
  recommended setup for Neon on Vercel serverless — no native query-engine
  binary to bundle. Prisma 7 keeps the connection URL out of `schema.prisma`; it
  lives in `prisma.config.ts` (for the migrate CLI) and is passed to the client
  through the adapter at runtime (`lib/prisma.ts`).
- Models: `MobilityReview`, `RiskCheck`, `DocumentRecord` (future-ready; a
  document may attach to either a review or a risk check).

### Environment variables

Copy `.env.example` to `.env` and fill in:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
AUTH_SECRET="generate-a-long-random-secret"     # e.g. openssl rand -base64 32
ADMIN_SEED_EMAIL="owner@yourfirm.com"
ADMIN_SEED_PASSWORD="change-this-strong-password"
ADMIN_SEED_NAME="Owner Name"
NEXT_PUBLIC_WHATSAPP_NUMBER="234XXXXXXXXXX"
```

- `DATABASE_URL` — Neon **pooled** connection string.
- `AUTH_SECRET` — signs admin session cookies; use a long random value.
- `ADMIN_SEED_*` — used once by `npm run db:seed` to create the first owner.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — international format, digits only.

(Optional: `RESEND_*` for email, `BLOB_READ_WRITE_TOKEN` for uploads — see below.)

### Connect to Neon PostgreSQL
1. Create a project at neon.tech and copy the **pooled** connection string
   (it ends with `?sslmode=require`).
2. Put it in `.env` as `DATABASE_URL`.

### Document upload (admin matter file)
Staff can attach documents to a matter from the admin detail pages, backed by
**Vercel Blob**. Set `BLOB_READ_WRITE_TOKEN` (see `.env.example`); on Vercel this
is added automatically when you create a Blob store (Storage → Blob).

How it works and why it's safe:
- Files upload **directly from the browser to Blob storage** using a short-lived
  token that the server issues only to an authenticated admin, with a content-type
  allow-list (PDF, common images, Word) and a 15 MB cap. Large files never pass
  through the serverless function.
- The `DocumentRecord` is written by an explicit admin-authenticated API call
  after the upload resolves; that endpoint rejects any `storageUrl` that isn't in
  our own Blob store.
- The public intake form intentionally does **not** accept uploads — it keeps the
  "we'll confirm the sharing channel first" message, matching the compliance
  posture. Only staff attach files, after the client is verified.
- Deleting a document removes both the record and the underlying blob.
- If `BLOB_READ_WRITE_TOKEN` is unset, the upload button returns a clear
  "not configured" message and the rest of the app is unaffected.

Security limitation to note: Blob URLs are unguessable but **public** (not
individually access-controlled). For highly sensitive documents, treat this as an
interim store and plan a follow-up with private/authenticated access (signed,
short-lived URLs behind the admin session). The data model already supports it.

### Email notifications (optional)
New submissions send an alert email to your team via [Resend](https://resend.com).
Set these (see `.env.example`):

```
RESEND_API_KEY="re_..."
NOTIFY_EMAIL_TO="ops@yourfirm.com"
NOTIFY_EMAIL_FROM="Magaji Law <alerts@yourdomain.com>"
```

Behaviour:
- Every new mobility review and risk check emails `NOTIFY_EMAIL_TO` with the key
  details and a deep link into the admin console.
- Compliance-queue matters (severe/high risk, agent disputes, and job offers
  with payment exposure) are subject-prefixed `[URGENT]`.
- **Fail-safe:** if the keys are unset or Resend is unreachable, the email is
  skipped silently and the submission still saves and returns success. Sends are
  time-limited so a slow provider can't hang the request. `NOTIFY_EMAIL_FROM`
  must be a Resend-verified sender for reliable delivery (the default sandbox
  sender works for initial testing only).

### Prisma migrations
The client is generated automatically on `npm install` and `npm run build`
(`postinstall` / `build` both run `prisma generate`). To create the tables:

```bash
# First migration (creates prisma/migrations and applies to your DB)
npx prisma migrate dev --name init

# On a server / CI / Vercel (applies existing migrations, no prompts)
npx prisma migrate deploy
```

Inspect data any time with `npx prisma studio`.

### Run locally
```bash
npm install
cp .env.example .env      # then edit values
npx prisma migrate dev --name init
npm run dev               # http://localhost:3000
```

### First owner + migrations
The schema now includes admin users, an audit log, and a client reference code.
After setting `DATABASE_URL`, `AUTH_SECRET`, and the `ADMIN_SEED_*` vars:

```bash
npx prisma migrate dev --name add-users-audit-reference
npm run db:seed      # creates the first OWNER from ADMIN_SEED_* (re-runnable)
```

(Existing reviews created before this migration have no reference code and
simply aren't lookup-able; new submissions get one automatically.)

### Admin console
- Visit `/admin` and sign in with your **email and password** (per-user, not a
  shared password).
- Dashboard cards, tabs (**Mobility Reviews**, **Risk Checks**, **Compliance
  Queue**, **Closed Matters**), and per-matter status + internal note editing —
  every status/note change is recorded in the audit log with the actor.
- **Documents** attach to each matter (see below).

### Admin users, roles & audit log
- Two roles: **OWNER** and **STAFF**. Both manage matters; only OWNER can manage
  users and view the audit log (links appear in the header for owners).
- **Users** (`/admin/users`): add users with a temporary password, change roles,
  and disable/enable access. Guards prevent changing your own account and
  removing the last active owner. Disabling a user takes effect immediately
  (enforced on every request), so it doubles as "revoke session".
- **Audit log** (`/admin/audit`): the 100 most recent actions — sign-ins
  (including failures), status/note changes, document upload/delete, and user
  administration — each with actor, target, and detail.

### Client status lookup
- Public page `/status`: a client enters their **reference code + the phone
  number they used** and sees only the current status and its meaning — no other
  personal data. The reference is shown on the submission success screen and can
  be re-checked any time.
- Anti-enumeration: the two-factor requirement (code **and** phone), a generic
  "no match" message that never reveals which field was wrong, and a best-effort
  rate limit (10/min per IP). See the security note below on the limiter.

### Deploy to Vercel
1. Push to GitHub, import the repo in Vercel (Next.js preset auto-detected).
2. Add environment variables in **Project → Settings → Environment Variables**.
   `DATABASE_URL`, `AUTH_SECRET`, and `ADMIN_SEED_PASSWORD` should be encrypted
   (default); `NEXT_PUBLIC_WHATSAPP_NUMBER` is public.
3. The build runs `prisma generate && next build` automatically. Run
   `npx prisma migrate deploy` then `npm run db:seed` against the production
   database once (locally with the production `DATABASE_URL`).

### Admin security posture & remaining limitations
Real per-user auth: individual accounts, scrypt-hashed passwords, roles, and an
audit trail. Sessions are signed (HMAC via `AUTH_SECRET`) httpOnly cookies,
`sameSite=lax`, `secure` in production, 8-hour expiry, and are re-validated
against the database on every request so a disabled account loses access at once.
Still worth planning before heavy sensitive use:
- **No self-service password reset / change yet.** Owners set a temporary
  password; a "change my password" flow and email-based reset are the natural
  next step.
- **Rate limiting is best-effort (in-memory, per-instance).** Serverless runs
  multiple instances, so for a hard global limit use a shared store (Upstash /
  Vercel KV). The reference+phone requirement is the primary anti-enumeration
  control.
- **Blob URLs are public** (unguessable but not access-controlled) — see the
  document-upload note.
- No login lockout/throttle after repeated failures (failures *are* audited);
  add IP/account throttling for production hardening.

### Build notes / issues resolved
- **Prisma engine download is network-restricted in some build sandboxes.**
  Solved architecturally by using Prisma 7's Neon **driver adapter** (Rust-free
  client — no query-engine binary). On Vercel/Neon with open network this is a
  non-issue; `prisma generate` runs normally.
- **Prisma 7 removed `url` from the datasource block.** The connection URL moved
  to `prisma.config.ts` (migrate) and the runtime adapter (client), per Prisma 7.
- All database-backed routes (`/admin/**`, `/api/**`) are `force-dynamic` on the
  Node runtime, so `next build` never touches the database; only the static
  marketing page is prerendered.

---


## Compliance note

Copy is deliberately restrained: no visa guarantees, no "pay and fly" language.
The compliance section and footer disclaimer state that immigration outcomes are
determined by government authorities and that regulated advice is referred to
licensed professionals. Keep this posture in any future edits.

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
ADMIN_PASSWORD="change-this-password"
NEXT_PUBLIC_WHATSAPP_NUMBER="234XXXXXXXXXX"
```

- `DATABASE_URL` — Neon **pooled** connection string.
- `ADMIN_PASSWORD` — password for `/admin`.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — international format, digits only.

### Connect to Neon PostgreSQL
1. Create a project at neon.tech and copy the **pooled** connection string
   (it ends with `?sslmode=require`).
2. Put it in `.env` as `DATABASE_URL`.

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

### Admin console
- Visit `/admin` and sign in with `ADMIN_PASSWORD`.
- Dashboard cards: total / new mobility reviews, total / severe / high risk
  checks, open matters.
- Tabs: **Mobility Reviews**, **Risk Checks**, **Compliance Queue**,
  **Closed Matters**.
- The **Compliance Queue** auto-surfaces every severe- and high-risk check,
  every agent-dispute/refund matter, and every job-offer matter where money is
  partial/full/about-to-be-paid.
- Open any row via **View Details** to see all fields, update the status, and
  save an internal note.

### Deploy to Vercel
1. Push to GitHub, import the repo in Vercel (Next.js preset auto-detected).
2. Add the three environment variables in **Project → Settings → Environment
   Variables**. `DATABASE_URL` and `ADMIN_PASSWORD` should be encrypted
   (default); `NEXT_PUBLIC_WHATSAPP_NUMBER` is public.
3. The build runs `prisma generate && next build` automatically. Run
   `npx prisma migrate deploy` against the production database once (locally
   with the production `DATABASE_URL`, or as a Vercel build/deploy step).

### Security limitations of the temporary admin approach
This is a **single shared password**, not real user authentication. The cookie
holds an HMAC keyed by `ADMIN_PASSWORD` (the password itself is never stored in
the cookie), is `httpOnly`, `sameSite=lax`, `secure` in production, and expires
after 8 hours. Limitations to be aware of before this handles sensitive client
data at scale:
- No individual accounts, roles, audit log, rate limiting, or lockout.
- A leaked password grants full access until it is rotated (rotating
  `ADMIN_PASSWORD` instantly invalidates all existing cookies).
- Suitable for a small trusted team as an interim tool. Before wider use, move
  to real auth (e.g. Auth.js / Clerk), per-user roles, and an audit trail — the
  intake/risk data model already supports that expansion.

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

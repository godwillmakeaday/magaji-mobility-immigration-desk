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

## Wiring up contact

All CTAs currently point to `#contact` or `https://wa.me/` (no number invented).
To go live:

- Replace `https://wa.me/` in `CTASection.tsx` with `https://wa.me/2348XXXXXXXXX`.
- Optionally swap the `#contact` anchors for a real intake form or the Magaji Law
  Client Room route.

## Compliance note

Copy is deliberately restrained: no visa guarantees, no "pay and fly" language.
The compliance section and footer disclaimer state that immigration outcomes are
determined by government authorities and that regulated advice is referred to
licensed professionals. Keep this posture in any future edits.

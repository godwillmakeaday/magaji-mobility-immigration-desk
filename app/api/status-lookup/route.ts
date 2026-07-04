import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normaliseReference } from "@/lib/reference";
import { rateLimit } from "@/lib/ratelimit";
import {
  REVIEW_STATUS_LABEL,
  REVIEW_STATUS_MEANING,
  MATTER_TYPE_LABEL,
} from "@/lib/enums";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function digits(s: string): string {
  return s.replace(/\D/g, "");
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`status:${ip}`, 10, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  let body: { reference?: string; phone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const reference = normaliseReference(body.reference ?? "");
  const phone = digits(body.phone ?? "");

  if (!body.reference?.trim() || phone.length < 7) {
    return NextResponse.json(
      { error: "Enter your reference code and the phone number you used." },
      { status: 400 }
    );
  }

  const rec = await prisma.mobilityReview.findUnique({
    where: { reference },
    select: {
      phone: true,
      status: true,
      updatedAt: true,
      destinationCountry: true,
      matterType: true,
    },
  });

  const stored = rec ? digits(rec.phone) : "";
  const phoneMatches =
    !!rec && (stored.endsWith(phone) || phone.endsWith(stored));

  // Generic message either way — never reveal which field was wrong.
  if (!rec || !phoneMatches) {
    return NextResponse.json(
      {
        error:
          "No matching request found. Check your reference code and phone number.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: rec.status,
    statusLabel: REVIEW_STATUS_LABEL[rec.status] ?? rec.status,
    statusMeaning: REVIEW_STATUS_MEANING[rec.status] ?? "",
    destinationCountry: rec.destinationCountry,
    matterType: MATTER_TYPE_LABEL[rec.matterType] ?? rec.matterType,
    updatedAt: rec.updatedAt.toISOString(),
  });
}

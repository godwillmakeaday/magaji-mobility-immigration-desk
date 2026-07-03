import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  MATTER_TYPE_TO_ENUM,
  PAYMENT_STATUS_TO_ENUM,
  CONTACT_METHOD_TO_ENUM,
} from "@/lib/enums";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const fullName = str(body.fullName);
  const phone = str(body.phone);
  const email = str(body.email);
  const destinationCountry = str(body.destinationCountry);
  const matterTypeLabel = str(body.matterType);
  const mainConcern = str(body.mainConcern);
  const complianceAcknowledged = body.complianceAcknowledged === true;

  // ---- Validation ----------------------------------------------------------
  const errors: Record<string, string> = {};
  if (!fullName) errors.fullName = "Full name is required.";
  if (!phone) errors.phone = "Phone / WhatsApp number is required.";
  if (!destinationCountry)
    errors.destinationCountry = "Destination country is required.";
  if (!matterTypeLabel) errors.matterType = "Type of matter is required.";
  if (!mainConcern) errors.mainConcern = "Main concern is required.";
  if (!complianceAcknowledged)
    errors.complianceAcknowledged = "Compliance acknowledgment is required.";
  if (email && !EMAIL_RE.test(email))
    errors.email = "Please enter a valid email address.";

  const matterType = MATTER_TYPE_TO_ENUM[matterTypeLabel];
  if (matterTypeLabel && !matterType)
    errors.matterType = "Unrecognised matter type.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const paymentStatusLabel = str(body.paymentStatus);
  const contactLabel = str(body.preferredContactMethod);

  try {
    const review = await prisma.mobilityReview.create({
      data: {
        fullName,
        phone,
        email: email || null,
        currentLocation: str(body.currentLocation) || null,
        destinationCountry,
        matterType: matterType as never,
        paymentStatus: (paymentStatusLabel
          ? PAYMENT_STATUS_TO_ENUM[paymentStatusLabel] ?? null
          : null) as never,
        amountPaidOrRequested: str(body.amountPaidOrRequested) || null,
        agentCompanyEmployer: str(body.agentCompanyEmployer) || null,
        promiseMade: str(body.promiseMade) || null,
        documentsAvailable: str(body.documentsAvailable) || null,
        mainConcern,
        preferredContactMethod: (contactLabel
          ? CONTACT_METHOD_TO_ENUM[contactLabel] ?? null
          : null) as never,
        complianceAcknowledged,
      },
      select: { id: true },
    });

    return NextResponse.json({ id: review.id }, { status: 201 });
  } catch (err) {
    console.error("Failed to create mobility review:", err);
    return NextResponse.json(
      { error: "Could not save your request. Please try again." },
      { status: 500 }
    );
  }
}

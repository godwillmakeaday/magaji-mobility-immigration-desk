import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  MATTER_TYPE_TO_ENUM,
  PAYMENT_STATUS_TO_ENUM,
  CONTACT_METHOD_TO_ENUM,
} from "@/lib/enums";
import { notifyNewReview } from "@/lib/notify";
import { generateReference } from "@/lib/reference";

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
  const paymentStatusEnum = paymentStatusLabel
    ? PAYMENT_STATUS_TO_ENUM[paymentStatusLabel] ?? null
    : null;
  const contactEnum = contactLabel
    ? CONTACT_METHOD_TO_ENUM[contactLabel] ?? null
    : null;

  try {
    let review: { id: string; reference: string | null } | null = null;
    // Retry a few times in the astronomically unlikely event of a code clash.
    for (let attempt = 0; attempt < 5 && !review; attempt++) {
      const reference = generateReference();
      try {
        review = await prisma.mobilityReview.create({
          data: {
            reference,
            fullName,
            phone,
            email: email || null,
            currentLocation: str(body.currentLocation) || null,
            destinationCountry,
            matterType: matterType as never,
            paymentStatus: paymentStatusEnum as never,
            amountPaidOrRequested: str(body.amountPaidOrRequested) || null,
            agentCompanyEmployer: str(body.agentCompanyEmployer) || null,
            promiseMade: str(body.promiseMade) || null,
            documentsAvailable: str(body.documentsAvailable) || null,
            mainConcern,
            preferredContactMethod: contactEnum as never,
            complianceAcknowledged,
          },
          select: { id: true, reference: true },
        });
      } catch (e: unknown) {
        // Unique constraint on reference — regenerate and retry.
        const code = (e as { code?: string })?.code;
        if (code === "P2002") continue;
        throw e;
      }
    }

    if (!review) {
      return NextResponse.json(
        { error: "Could not save your request. Please try again." },
        { status: 500 }
      );
    }

    // Fire the notification (never throws; no-op if email is not configured).
    await notifyNewReview(
      {
        id: review.id,
        fullName,
        phone,
        destinationCountry,
        matterType,
        paymentStatus: paymentStatusEnum,
        mainConcern,
      },
      new URL(request.url).origin
    );

    return NextResponse.json(
      { id: review.id, reference: review.reference },
      { status: 201 }
    );
  } catch (err) {
    console.error("Failed to create mobility review:", err);
    return NextResponse.json(
      { error: "Could not save your request. Please try again." },
      { status: 500 }
    );
  }
}

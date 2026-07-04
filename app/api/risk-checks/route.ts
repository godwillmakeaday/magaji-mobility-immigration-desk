import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RED_FLAGS, riskFromCount } from "@/lib/risk";
import { notifyNewRiskCheck } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const destinationCountry = str(body.destinationCountry);
  const mainConcern = str(body.mainConcern);

  const errors: Record<string, string> = {};
  if (!destinationCountry)
    errors.destinationCountry = "Destination country is required.";
  if (!mainConcern) errors.mainConcern = "Main concern is required.";
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  // Only accept flags that are part of the known list, then score server-side
  // so the stored risk level cannot be tampered with from the client.
  const incoming = Array.isArray(body.selectedFlags)
    ? (body.selectedFlags as unknown[]).map(String)
    : [];
  const selectedFlags = incoming.filter((f) =>
    (RED_FLAGS as readonly string[]).includes(f)
  );
  const redFlagCount = selectedFlags.length;
  const { key: riskLevel } = riskFromCount(redFlagCount);

  try {
    const check = await prisma.riskCheck.create({
      data: {
        destinationCountry,
        mainConcern,
        selectedFlags,
        redFlagCount,
        riskLevel: riskLevel as never,
        optionalName: str(body.optionalName) || null,
        optionalPhone: str(body.optionalPhone) || null,
        optionalEmail: str(body.optionalEmail) || null,
      },
      select: { id: true, riskLevel: true, redFlagCount: true },
    });

    await notifyNewRiskCheck(
      {
        id: check.id,
        destinationCountry,
        mainConcern,
        redFlagCount,
        riskLevel,
      },
      new URL(request.url).origin
    );

    return NextResponse.json(check, { status: 201 });
  } catch (err) {
    console.error("Failed to create risk check:", err);
    return NextResponse.json(
      { error: "Could not save the risk check. Please try again." },
      { status: 500 }
    );
  }
}

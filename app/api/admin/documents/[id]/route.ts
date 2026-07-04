import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const doc = await prisma.documentRecord.findUnique({
      where: { id: params.id },
    });
    if (!doc) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    // Best-effort removal of the underlying blob; never let it block the
    // record deletion.
    if (doc.storageUrl && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        await del(doc.storageUrl);
      } catch (e) {
        console.error("Failed to delete blob (continuing):", e);
      }
    }

    await prisma.documentRecord.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to delete document:", err);
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
}

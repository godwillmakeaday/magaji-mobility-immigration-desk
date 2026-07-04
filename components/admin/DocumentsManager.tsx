"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { IconUpload, IconDocCheck, IconCross } from "@/components/icons";
import { formatBytes, formatDate, type DocRow } from "@/lib/admin-types";

const MAX_BYTES = 15 * 1024 * 1024;
const ACCEPT =
  ".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif,.doc,.docx,application/pdf,image/*";

export default function DocumentsManager({
  documents,
  reviewId,
  riskCheckId,
}: {
  documents: DocRow[];
  reviewId?: string;
  riskCheckId?: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError("");
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        if (file.size > MAX_BYTES) {
          throw new Error(`"${file.name}" is larger than 15 MB.`);
        }
        // 1) Direct-to-storage upload via an admin-issued token.
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/admin/blob-upload",
        });
        // 2) Persist the record against this matter.
        const res = await fetch("/api/admin/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reviewId,
            riskCheckId,
            fileName: file.name,
            fileType: file.type || null,
            fileSize: file.size,
            storageUrl: blob.url,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Could not save the document.");
        }
      }
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setError("");
    try {
      const res = await fetch(`/api/admin/documents/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Delete failed.");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  return (
    <div className="rounded-lg border border-hairline bg-white p-6 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-eyebrow text-charcoal/55">
          <IconDocCheck className="h-4 w-4" /> Documents
        </h3>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-sm border border-ink bg-ink px-4 py-2 text-[13px] font-semibold text-paper transition-colors hover:bg-charcoal disabled:opacity-50"
        >
          <IconUpload className="h-4 w-4" />
          {busy ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>

      {error && <p className="mt-3 text-[13px] text-clay">{error}</p>}

      {documents.length === 0 ? (
        <p className="mt-4 text-[14px] leading-relaxed text-charcoal/60">
          No documents attached yet. Upload files the client has authorised
          through the confirmed sharing channel (PDF, image, or Word · up to
          15&nbsp;MB).
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-hairline">
          {documents.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <a
                  href={d.storageUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-[14px] font-medium text-ink underline-offset-4 hover:underline"
                >
                  {d.fileName}
                </a>
                <p className="mt-0.5 text-[12px] text-charcoal/55">
                  {formatBytes(d.fileSize)} · {formatDate(d.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(d.id)}
                aria-label={`Delete ${d.fileName}`}
                className="flex-none rounded-sm border border-hairline p-1.5 text-charcoal/50 transition-colors hover:border-clay/40 hover:text-clay"
              >
                <IconCross className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 border-t border-hairline pt-3 text-[11px] leading-relaxed text-charcoal/45">
        Store only what the client has authorised. Do not upload forged or
        misleading documents. Links are unguessable but not individually
        access-controlled in this version.
      </p>
    </div>
  );
}

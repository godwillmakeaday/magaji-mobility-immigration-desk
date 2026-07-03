import { IconUpload } from "@/components/icons";

export default function DocumentsPanel() {
  return (
    <div className="rounded-lg border border-dashed border-hairline bg-white p-6">
      <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-eyebrow text-charcoal/55">
        <IconUpload className="h-4 w-4" /> Documents
      </h3>
      <p className="mt-3 text-[14px] leading-relaxed text-charcoal/65">
        No document upload is enabled in this version. Future document records
        will appear here.
      </p>
    </div>
  );
}

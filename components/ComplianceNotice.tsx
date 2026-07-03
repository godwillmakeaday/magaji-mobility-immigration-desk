import type { ReactNode } from "react";
import { IconShield, IconAlert } from "./icons";

export default function ComplianceNotice({
  tone = "notice",
  title,
  children,
}: {
  tone?: "notice" | "caution";
  title: string;
  children: ReactNode;
}) {
  const isCaution = tone === "caution";
  const Icon = isCaution ? IconAlert : IconShield;

  return (
    <div
      className={[
        "flex gap-3 rounded-md border px-5 py-4",
        isCaution
          ? "border-clay/25 bg-clay/[0.05]"
          : "border-forest/25 bg-forest/[0.05]",
      ].join(" ")}
    >
      <Icon
        className={[
          "mt-0.5 h-5 w-5 flex-none",
          isCaution ? "text-clay" : "text-forest",
        ].join(" ")}
      />
      <p className="text-[13px] leading-relaxed text-charcoal/80">
        <span className="font-semibold text-charcoal">{title}</span>{" "}
        {children}
      </p>
    </div>
  );
}

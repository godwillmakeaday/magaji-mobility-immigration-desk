import { IconAlert, IconShield } from "./icons";
import { RISK_GUIDANCE, type RiskLevelLabel } from "@/lib/risk";

const TIER: Record<
  RiskLevelLabel,
  { ring: string; chip: string; bar: string; fill: number; caution: boolean }
> = {
  "Low Visible Risk": {
    ring: "border-forest/30",
    chip: "bg-forest/10 text-forest border-forest/30",
    bar: "bg-forest",
    fill: 20,
    caution: false,
  },
  "Moderate Risk": {
    ring: "border-brass/40",
    chip: "bg-brass/10 text-brass-deep border-brass/40",
    bar: "bg-brass",
    fill: 50,
    caution: false,
  },
  "High Risk": {
    ring: "border-clay/40",
    chip: "bg-clay/10 text-clay border-clay/40",
    bar: "bg-clay",
    fill: 78,
    caution: true,
  },
  "Severe Risk": {
    ring: "border-clay",
    chip: "bg-clay text-white border-clay",
    bar: "bg-clay",
    fill: 100,
    caution: true,
  },
};

export default function RiskResultCard({
  level,
  count,
}: {
  level: RiskLevelLabel;
  count: number;
}) {
  const t = TIER[level];
  const Icon = t.caution ? IconAlert : IconShield;

  return (
    <div className={`rounded-lg border bg-white p-6 shadow-card ${t.ring}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-eyebrow text-charcoal/55">
          Assessed level
        </span>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${t.chip}`}
        >
          <Icon className="h-4 w-4" />
          {level}
        </span>
      </div>

      <p className="mt-4 font-display text-3xl text-ink">
        {count}
        <span className="ml-2 align-middle text-sm font-sans font-medium text-charcoal/55">
          red flag{count === 1 ? "" : "s"} selected
        </span>
      </p>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-hairline">
        <div
          className={`h-full rounded-full transition-all duration-500 ${t.bar}`}
          style={{ width: `${t.fill}%` }}
        />
      </div>

      <p className="mt-5 text-[15px] leading-relaxed text-charcoal/80">
        {RISK_GUIDANCE[level]}
      </p>
    </div>
  );
}

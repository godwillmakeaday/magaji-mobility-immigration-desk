export default function DetailField({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-charcoal/50">
        {label}
      </dt>
      <dd className="mt-1 text-[15px] leading-relaxed text-ink">
        {value === null || value === undefined || value === "" ? (
          <span className="text-charcoal/40">—</span>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

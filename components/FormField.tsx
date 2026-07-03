import type { ChangeEvent } from "react";

type Common = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
};

type FieldProps =
  | (Common & { as?: "input"; type?: "text" | "email" | "tel" | "number" })
  | (Common & { as: "textarea"; rows?: number })
  | (Common & { as: "select"; options: string[] });

const fieldBase =
  "mt-2 w-full rounded-sm border border-hairline bg-paper px-3.5 py-2.5 text-[15px] text-ink placeholder:text-charcoal/40 transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";

export default function FormField(props: FieldProps) {
  const { label, name, value, onChange, required, placeholder, className } =
    props;

  const handle = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => onChange(e.target.value);

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="text-[13px] font-semibold text-charcoal/80"
      >
        {label}
        {required && <span className="ml-1 text-clay">*</span>}
      </label>

      {props.as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={handle}
          required={required}
          placeholder={placeholder}
          rows={props.rows ?? 3}
          className={`${fieldBase} resize-y`}
        />
      ) : props.as === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={handle}
          required={required}
          className={`${fieldBase} appearance-none bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pr-9`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2323262B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          }}
        >
          <option value="" disabled>
            Select…
          </option>
          {props.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={props.type ?? "text"}
          value={value}
          onChange={handle}
          required={required}
          placeholder={placeholder}
          className={fieldBase}
        />
      )}
    </div>
  );
}

import type { ReactNode } from "react";
import { IconArrow } from "./icons";

// Inline WhatsApp glyph (kept local so we add no icon dependency).
function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.02A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.16 0 4.19.84 5.72 2.37a8.06 8.06 0 0 1 2.37 5.74c0 4.48-3.65 8.12-8.13 8.12a8.2 8.2 0 0 1-4.16-1.14l-.3-.18-3.11.82.83-3.03-.2-.31a8.06 8.06 0 0 1-1.26-4.32c0-4.48 3.65-8.12 8.13-8.12Zm-3.07 4.3c-.14 0-.38.05-.58.27-.2.22-.76.75-.76 1.82 0 1.08.78 2.12.89 2.26.11.14 1.53 2.34 3.72 3.28.52.22.93.36 1.24.46.52.17.99.14 1.37.09.42-.06 1.28-.52 1.46-1.03.18-.5.18-.94.13-1.03-.05-.09-.2-.14-.42-.25-.22-.11-1.28-.63-1.48-.7-.2-.07-.34-.11-.49.11-.14.22-.56.7-.68.85-.13.14-.25.16-.47.05-.22-.11-.92-.34-1.75-1.08-.65-.58-1.08-1.29-1.21-1.51-.13-.22-.01-.34.1-.45.1-.1.22-.25.33-.38.11-.13.14-.22.22-.36.07-.14.04-.27-.02-.38-.05-.11-.48-1.2-.68-1.63-.17-.4-.35-.35-.48-.36l-.4-.01Z" />
    </svg>
  );
}

type Variant = "primary" | "green" | "secondary" | "ghost";

const styles: Record<Variant, string> = {
  primary: "bg-ink text-paper border border-ink hover:bg-charcoal",
  green:
    "bg-[#128C7E] text-white border border-[#128C7E] hover:bg-[#0e6f64] hover:border-[#0e6f64]",
  secondary:
    "bg-transparent text-ink border border-ink/30 hover:border-brass hover:text-brass-deep",
  ghost:
    "bg-brass text-ink border border-brass hover:bg-brass-deep hover:text-paper hover:border-brass-deep",
};

export default function WhatsAppButton({
  href,
  onClick,
  variant = "green",
  children,
  showGlyph = true,
  withArrow = false,
  disabled = false,
  className = "",
  ariaLabel,
}: {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  children: ReactNode;
  showGlyph?: boolean;
  withArrow?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const cls = [
    "group inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-200",
    styles[variant],
    disabled ? "pointer-events-none opacity-45" : "",
    className,
  ].join(" ");

  const inner = (
    <>
      {showGlyph && <IconWhatsApp className="h-4 w-4" />}
      {children}
      {withArrow && (
        <IconArrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cls}
      >
        {inner}
      </button>
    );
  }

  return (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel}
      className={cls}
    >
      {inner}
    </a>
  );
}

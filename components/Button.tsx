import type { ReactNode } from "react";
import { IconArrow } from "./icons";

type Variant = "primary" | "secondary" | "ghost" | "quiet";

const styles: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:bg-charcoal border border-ink",
  secondary:
    "bg-transparent text-ink border border-ink/30 hover:border-brass hover:text-brass-deep",
  ghost:
    "bg-brass text-ink border border-brass hover:bg-brass-deep hover:text-paper hover:border-brass-deep",
  quiet:
    "bg-transparent text-forest border border-forest/30 hover:border-forest hover:bg-forest/5",
};

export default function Button({
  href = "#contact",
  variant = "primary",
  children,
  withArrow = false,
  className = "",
}: {
  href?: string;
  variant?: Variant;
  children: ReactNode;
  withArrow?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={[
        "group inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-200",
        styles[variant],
        className,
      ].join(" ")}
    >
      {children}
      {withArrow && (
        <IconArrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </a>
  );
}

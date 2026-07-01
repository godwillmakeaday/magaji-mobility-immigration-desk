import { Seal } from "./icons";
import Button from "./Button";

const nav = [
  { label: "What We Do", href: "#services" },
  { label: "Compliance", href: "#compliance" },
  { label: "Packages", href: "#packages" },
  { label: "Process", href: "#process" },
  { label: "Desks", href: "#desks" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-paper/90 backdrop-blur-sm">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-3">
          <Seal className="h-9 w-9 text-brass-deep" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[15px] font-bold tracking-wide text-ink">
              MAGAJI LAW
            </span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-eyebrow text-charcoal/60">
              Mobility &amp; Immigration Desk
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-charcoal/75 transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden sm:block">
          <Button href="#contact" variant="ghost" withArrow>
            Request a Review
          </Button>
        </div>
      </div>
    </header>
  );
}

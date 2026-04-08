import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  /** When section is inverse (dark) */
  inverse?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  inverse = false,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "mb-12 md:mb-16 max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "font-mono-label mb-3",
            inverse ? "text-content-inverse-muted" : undefined
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <div
        className={cn(
          "flex items-center gap-4 mb-4",
          align === "center" && "justify-center"
        )}
      >
        <h2
          className={cn(
            "text-3xl md:text-4xl font-semibold tracking-tight",
            inverse ? "text-content-inverse" : "text-content-primary"
          )}
        >
          {title}
        </h2>
        <span
          className="hidden sm:block h-px flex-1 max-w-[120px] bg-gradient-to-r from-accent-cyan/50 to-transparent"
          aria-hidden
        />
      </div>
      {description ? (
        <p
          className={cn(
            "text-base md:text-lg leading-relaxed",
            inverse ? "text-content-inverse-muted" : "text-content-secondary"
          )}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}

import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  /** Light page background vs subtle vs dark inverse */
  variant?: "default" | "subtle" | "inverse";
  /** Use section-padding utility */
  padded?: boolean;
};

const variants = {
  default: "bg-surface-page",
  subtle: "bg-surface-subtle",
  inverse: "bg-surface-inverse text-content-inverse [&_p]:text-content-inverse-muted",
};

export function Section({
  id,
  children,
  className,
  variant = "default",
  padded = true,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        variants[variant],
        padded && "section-padding",
        className
      )}
    >
      {children}
    </section>
  );
}

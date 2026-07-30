import { cn } from "@/lib/utils";
import { JudgmentLine } from "../motion/JudgmentLine";
import { Container } from "./Container";

type SectionProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  /**
   * Surface tint WITHIN the single page theme. Both values stay in the same
   * theme family, in both light and dark.
   *
   * `inverse` is DEPRECATED and now resolves to `subtle`. It used to flip to a
   * hardcoded dark surface mid-page, which broke the page theme lock: scrolling
   * About -> Experience -> Contact felt like crossing into a different website
   * and back. It also forced a `border-white/10 bg-white/[0.04]` glass
   * vocabulary that existed in exactly one section.
   *
   * Since the palette became mode-aware it is worse than that: `surface-inverse`
   * is the inverted-vs-page fill, so in dark mode the variant would paint a
   * PAPER-coloured island into a dark page. Removed once the last call site is
   * gone; do not add new ones.
   */
  variant?: "default" | "subtle" | "inverse";
  /** Use section-padding utility */
  padded?: boolean;
  /**
   * Opens the section with the judgment line. On by default; pass false for the
   * hero, which has no preceding section to be separated from.
   */
  judgment?: boolean;
};

const variants = {
  default: "bg-surface-page",
  subtle: "bg-surface-subtle",
  inverse: "bg-surface-subtle",
};

export function Section({
  id,
  children,
  className,
  variant = "default",
  padded = true,
  judgment = true,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(variants[variant], padded && "section-padding", className)}
    >
      {judgment ? (
        /*
         * Inside the container so the line spans the content column and lands
         * flush with the lane rails, rather than bleeding edge to edge.
         */
        <Container>
          <JudgmentLine className="mb-[calc(var(--rhythm)*10)]" />
        </Container>
      ) : null}
      {children}
    </section>
  );
}

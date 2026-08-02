import { cn } from "@/lib/utils";
import { JudgmentLine } from "../motion/JudgmentLine";
import FieldAnchor from "../shared/FieldAnchor";
import { Container } from "./Container";
import type { PigmentName, TreatmentName } from "@/lib/field/types";

type SectionProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  /**
   * Surface tint WITHIN the single page theme. Both values stay in the same
   * theme family, in both light and dark.
   *
   * These are now translucent rather than opaque, because the site's field is
   * one fixed canvas behind the whole page: an opaque section surface would
   * simply hide it. `default` is fully transparent and shows the body colour;
   * `subtle` is a wash, so the field reads through it at reduced strength. That
   * difference is deliberate and gives the page rhythm, alternating sections
   * where the composition is full strength with sections where it recedes.
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
   * Opens the section with its transition hairline. On by default; pass false
   * for the hero, which has no preceding section to be separated from.
   */
  judgment?: boolean;
  /**
   * The composition drawn behind this section, and the field pigment it draws
   * in. Omit both and the section simply carries no field.
   *
   * One pigment per section is the whole colour scheme for the field layer. UI
   * chrome stays ink plus vermilion everywhere and is untouched by this.
   */
  field?: TreatmentName;
  pigment?: PigmentName;
};

const variants = {
  default: "",
  subtle: "bg-surface-subtle/55",
  inverse: "bg-surface-subtle/55",
};

export function Section({
  id,
  children,
  className,
  variant = "default",
  padded = true,
  judgment = true,
  field,
  pigment = "shu",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(variants[variant], padded && "section-padding", className)}
      {...(field ? { "data-field": "" } : {})}
    >
      {field ? <FieldAnchor treatment={field} pigment={pigment} /> : null}
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

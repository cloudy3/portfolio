import { cn } from "@/lib/utils";

/**
 * A section's opening. Headline, then optionally one paragraph beneath it.
 *
 * Four things were removed, all of them tells:
 *
 * - The `eyebrow` prop. Every section had one ("Selected work", "About",
 *   "Capabilities", "Trajectory", "Contact"): six mono uppercase micro-labels on
 *   a six-section page against a budget of two, and the single most recognisable
 *   generated-template rhythm there is. A section's place on the page already
 *   says what it is. There is no replacement prop, deliberately.
 *
 * - The decorative `from-accent-cyan/50 to-transparent` hairline that trailed
 *   every headline. It organised nothing. The judgment line on Section is the
 *   one piece of accent geometry a section gets.
 *
 * - `align="center"`. Headers sit on the lane grid, left-aligned, like
 *   everything else. Centred section headers were the generic default.
 *
 * - `inverse`. There is one page theme now, so there is nothing to invert for.
 *
 * The description stays stacked directly beneath the headline and capped at
 * 60ch, never floated into a right-hand column: a big headline on the left with
 * a small explainer paragraph adrift on the right is its own tell.
 *
 * Type scale comes from the h2 rule in globals.css. No local font-size or weight
 * utilities here, so every section headline is identical by construction.
 */
type SectionHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn("mb-[calc(var(--rhythm)*10)]", className)}>
      <h2 className="max-w-[24ch] text-content-primary">{title}</h2>
      {description ? (
        <p className="mt-[calc(var(--rhythm)*5)] max-w-[60ch] text-content-secondary">
          {description}
        </p>
      ) : null}
    </header>
  );
}

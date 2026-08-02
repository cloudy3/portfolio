import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
  keepOut = false,
}: {
  className?: string;
  children: React.ReactNode;
  /**
   * Marks this column as the block the field must not draw over.
   *
   * Set it on the container holding a section's actual content. It is a prop
   * rather than something Container always emits because a `Section` renders
   * two of these: one for the section pulse and one for the content. The field
   * finds the first `[data-keepout]` in the section, so tagging every container
   * would hand it the hairline instead of the copy.
   */
  keepOut?: boolean;
}) {
  return (
    <div
      className={cn("container-custom", className)}
      {...(keepOut ? { "data-keepout": "box" } : {})}
    >
      {children}
    </div>
  );
}

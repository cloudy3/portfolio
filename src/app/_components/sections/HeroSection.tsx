import FieldAnchor from "../shared/FieldAnchor";
import { JING_FENG_PROFILE } from "@/lib/data/professional-profile";
import { cn } from "@/lib/utils";
import { HeroActions } from "./HeroActions";

/**
 * Lead line of the profile summary.
 *
 * The hero used to print the name, the title AND the entire summary, which
 * rendered as "Jing Feng - full-stack software engineer. Full-stack software
 * engineer with 3+ years..." (the title duplicated verbatim by the summary's own
 * opening) across six lines. Hero subtext is capped at 20 words and 4 lines, so
 * only the first sentence appears here; the full summary still runs in About.
 * Derived from the data rather than rewritten, so the two cannot drift.
 */
const LEAD_SENTENCE = JING_FENG_PROFILE.summary.split(". ")[0];
const SHORT_NAME = JING_FENG_PROFILE.name.split(" ").slice(-2).join(" ");

interface HeroSectionProps {
  className?: string;
}

/**
 * The hero.
 *
 * This is now a Server Component. It has no canvas of its own, no scrim and no
 * lane rails: the site-wide field draws behind it and composes around the copy.
 * Only the buttons need JavaScript, and they are isolated in HeroActions.
 *
 * What went, and why:
 *
 *   The three.js canvas was mounted here and nowhere else, which made the whole
 *   WebGL stack an above-the-fold cost for one decorative element. It is
 *   replaced by the shared 2D field.
 *
 *   The horizontal scrim existed only to keep the canvas off the copy. The
 *   field is clipped to everything outside `[data-keepout]` instead, so there is
 *   nothing to protect the text from. Composing around the type rather than
 *   veiling it is what the reference does, and it means the field can run at
 *   full strength where it is visible.
 *
 *   The static lane rails were eight motionless hairlines drawn over a moving
 *   field. The `bars` composition is that idea actually moving, so keeping both
 *   would be saying the same thing twice.
 */
export default function HeroSection({ className = "" }: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[100dvh] items-center overflow-hidden -mt-16 pt-16",
        className
      )}
      id="hero"
      data-field
    >
      {/*
       * The polychrome line field. `pigment` is the dominant hue rather than
       * the only one: `lines` is the single composition licensed to use all
       * four lane pigments, which is the exception the colour lock in
       * globals.css has always carried for the hero.
       */}
      <FieldAnchor treatment="lines" pigment="shu" />

      <div className="container-custom relative w-full">
        {/*
         * The hero entrance is CSS (`.lane-enter` in globals.css), not Motion,
         * and that is a measured performance decision.
         *
         * Motion applies its `initial` state during server rendering, so this
         * copy used to ship as `style="opacity:0"` and stayed invisible until
         * framer-motion hydrated, behind the three.js chunk. Chrome will not
         * take an LCP candidate while an element is fully transparent, so the
         * largest text on the page reported ~6s while actually painting at
         * ~0.9s. A CSS animation starts at first paint with no JS involved.
         *
         * Everything below the fold still uses Motion via FadeIn, where waiting
         * for hydration costs nothing. Reduced motion is handled in the
         * stylesheet, so no JS branch is needed here either.
         */}
        <div className="lane-grid">
          {/*
           * data-keepout marks the block the field must not draw over. It is
           * the copy column rather than the whole container, which is what
           * leaves the right-hand lanes free for the composition.
           *
           * Box mode, not column. Column was right for vertical bars, which
           * terminated in mid-air when clipped to a box. Long diagonals are the
           * opposite case: passing around a rectangular hole is a composition
           * the reference uses directly (frames 350, 380, 1130), while
           * confining them to two narrow side strips wastes their length, which
           * is the whole point of the primitive.
           */}
          <div
            className="md:col-span-6 md:pr-[var(--lane-inset)]"
            data-keepout="box"
          >
            {/*
             * Weight contrast carries the headline: 900 against 300, one
             * family. The old version greyed the second clause out, which is
             * the standard two-tone headline trick and also gave away contrast.
             * Both clauses are full-strength ink now.
             */}
            <h1
              className="lane-enter text-content-primary"
              style={{ "--enter-index": 0 } as React.CSSProperties}
            >
              <span className="block">Calm systems,</span>
              <span className="block font-light">shipped with care.</span>
            </h1>

            <p
              className="lane-enter mt-[calc(var(--rhythm)*6)] max-w-[44ch] text-content-secondary"
              style={{ "--enter-index": 1 } as React.CSSProperties}
            >
              {SHORT_NAME}. {LEAD_SENTENCE}.
            </p>

            <HeroActions />
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Skill } from "@/types";
import { SKILLS_DATA } from "@/lib/data/skills";
import { cn } from "@/lib/utils";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";
import { FadeIn } from "../motion/FadeIn";

function categoryLabel(category: Skill["category"]): string {
  const labels: Partial<Record<Skill["category"], string>> = {
    frontend: "Frontend",
    backend: "Backend",
    mobile: "Mobile",
    devops: "DevOps",
    design: "Design",
    database: "Data",
    cloud: "Cloud",
    systems: "Systems",
    methodology: "Practice",
    other: "Other",
  };
  return labels[category] ?? String(category);
}

const FILTER_CATEGORIES: (Skill["category"] | "all")[] = [
  "all",
  "frontend",
  "backend",
  "mobile",
  "cloud",
  "database",
  "devops",
  "design",
  "systems",
  "methodology",
];

function filterButtonLabel(category: Skill["category"] | "all"): string {
  if (category === "all") return "All";
  return categoryLabel(category);
}

/**
 * One domain, drawn as a lane.
 *
 * This is where the rhythm-chart idea stops being decoration and becomes the
 * information design: each domain is a lane, each skill is a note strung along
 * it, and the hairline is the lane itself. Notes carry the section background so
 * they break the rule they sit on.
 *
 * What this replaces: one bordered panel wrapping a `divide-y` list with a
 * `border-t` on every one of 33 rows, an emoji glyph per row, and a mono
 * two-letter code per group ("FE", "BE", "MB"). A long list with a hairline under
 * every item is the laziest layout available, and the codes told the reader
 * nothing the label beside them did not.
 *
 * The track scrolls rather than wraps. At no more than five skills per domain it
 * never needs to on desktop, and holding each lane to a single row is what lets
 * one centred hairline read as a continuous lane.
 */
function DomainLane({
  category,
  skills,
}: {
  category: Skill["category"];
  skills: Skill[];
}) {
  const label = categoryLabel(category);

  return (
    <div className="lane-grid md:items-center">
      <div className="flex items-baseline gap-3 md:col-span-2 md:pr-[var(--lane-inset)]">
        <span className="text-sm font-medium text-content-primary">
          {label}
        </span>
        <span className="num text-xs text-content-muted">{skills.length}</span>
      </div>

      <div className="relative md:col-span-6">
        <span
          className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border-subtle"
          aria-hidden
        />
        <ul
          aria-label={`${label} skills`}
          className="relative flex snap-x snap-proximity list-none gap-x-6 overflow-x-auto py-2"
        >
          {skills.map((skill) => (
            <li
              key={`${category}-${skill.name}`}
              className="shrink-0 snap-start"
            >
              <span className="bg-surface-page px-2 text-sm text-content-primary">
                {skill.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<
    Skill["category"] | "all"
  >("all");

  const grouped = useMemo(() => {
    const order = Array.from(
      new Set(SKILLS_DATA.map((s) => s.category as Skill["category"]))
    );
    const byCat = (cat: Skill["category"]) =>
      SKILLS_DATA.filter((s) => s.category === cat).sort((a, b) =>
        a.name.localeCompare(b.name)
      );

    if (activeCategory !== "all") {
      return [{ category: activeCategory, skills: byCat(activeCategory) }];
    }
    return order
      .map((category) => ({ category, skills: byCat(category) }))
      .filter((g) => g.skills.length > 0);
  }, [activeCategory]);

  const stats = useMemo(() => {
    const domains = new Set(SKILLS_DATA.map((s) => s.category)).size;
    return {
      total: SKILLS_DATA.length,
      domains,
    };
  }, []);

  return (
    <Section
      id="skills"
      variant="default"
      className="scroll-mt-20"
      field="lattice"
      pigment="kihada"
    >
      <Container keepOut>
        <FadeIn>
          <SectionHeader
            title="Tools I ship with"
            description="From React and Next.js on the web to Flutter on mobile and GCP behind the scenes, grouped by domain. Filter to zoom in for a role or a conversation."
          />
        </FadeIn>

        {/*
         * Counters, in the one place mono belongs. These were two bordered,
         * shadowed tiles, which is dashboard furniture on a portfolio; the
         * numbers carry themselves at display size instead.
         */}
        <FadeIn beat={1}>
          <div className="flex items-end gap-10">
            <div className="flex items-baseline gap-2">
              <span className="num text-3xl text-content-primary">
                {stats.total}
              </span>
              <span className="text-xs text-content-muted">Total</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="num text-3xl text-content-primary">
                {stats.domains}
              </span>
              <span className="text-xs text-content-muted">Areas</span>
            </div>
          </div>
        </FadeIn>

        <FadeIn beat={2}>
          {/* No role="toolbar": that contract requires arrow-key roving
              tabindex. These are plain toggle buttons; aria-pressed already
              conveys state, and Tab reaches each one. */}
          <div
            className="mt-[calc(var(--rhythm)*10)] flex flex-wrap gap-2"
            aria-label="Filter skills by domain"
          >
            {FILTER_CATEGORIES.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "rounded-control px-3 py-1.5 text-xs font-medium transition-colors active:translate-y-px",
                    active
                      ? "bg-surface-inverse text-content-inverse"
                      : "border border-border-subtle text-content-secondary hover:border-accent hover:text-content-primary"
                  )}
                >
                  {filterButtonLabel(category)}
                </button>
              );
            })}
          </div>
        </FadeIn>

        {/*
         * Lanes sit close together on purpose. At a 3.5rem gap they read as
         * isolated rows; a chart's lanes are parallel and adjacent, and the
         * tight pitch is what makes the whole block scan as one instrument
         * rather than nine separate lists.
         */}
        <div className="mt-[calc(var(--rhythm)*10)] space-y-[calc(var(--rhythm)*2)]">
          {grouped.map(({ category, skills }, i) => (
            <FadeIn key={category} beat={i}>
              <DomainLane category={category} skills={skills} />
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <p className="mt-[calc(var(--rhythm)*10)] max-w-[60ch] text-sm text-content-muted">
            Current learning focus: mobile performance, cloud economics, and how
            teams ship reliable products end to end, from UI in React or Next.js
            through APIs and infrastructure.
          </p>
        </FadeIn>
      </Container>
    </Section>
  );
}

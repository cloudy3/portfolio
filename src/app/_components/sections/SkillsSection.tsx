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

/** One domain in the editorial index. No track, chips or horizontal scrolling. */
function SkillGroup({
  category,
  skills,
  featured = false,
}: {
  category: Skill["category"];
  skills: Skill[];
  featured?: boolean;
}) {
  const label = categoryLabel(category);

  return (
    <section
      className={cn(
        "grid gap-5 pt-[calc(var(--rhythm)*5)]",
        featured && "md:grid-cols-8 md:gap-0"
      )}
    >
      <div
        className={cn(
          "flex items-baseline justify-between gap-4",
          featured && "md:col-span-2 md:block md:pr-[var(--lane-inset)]"
        )}
      >
        <h3 className={cn("font-medium", featured ? "text-xl" : "text-base")}>
          {label}
        </h3>
        <span className="num text-xs text-content-muted">{skills.length}</span>
      </div>

      <ul
        aria-label={`${label} skills`}
        className={cn(
          "flex list-none flex-wrap content-start gap-x-5 gap-y-2 text-sm text-content-secondary",
          featured && "md:col-span-6 md:pt-1"
        )}
      >
        {skills.map((skill) => (
          <li key={`${category}-${skill.name}`}>{skill.name}</li>
        ))}
      </ul>
    </section>
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
            description="Web, mobile, cloud and delivery tools, grouped for a quick read or a focused conversation."
          />
        </FadeIn>

        <FadeIn beat={1}>
          {/* No role="toolbar": that contract requires arrow-key roving
              tabindex. These are plain toggle buttons; aria-pressed already
              conveys state, and Tab reaches each one. */}
          <nav
            className="flex flex-wrap gap-x-6 gap-y-2 border-b border-border-subtle"
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
                    "border-b-2 px-0.5 py-3 text-sm font-medium transition-colors active:translate-y-px",
                    active
                      ? "border-accent text-content-primary"
                      : "border-transparent text-content-muted hover:text-content-primary"
                  )}
                >
                  {filterButtonLabel(category)}
                </button>
              );
            })}
          </nav>
        </FadeIn>

        <p className="sr-only" aria-live="polite">
          {activeCategory === "all"
            ? "Showing all skill groups"
            : `Showing ${categoryLabel(activeCategory)} skills`}
        </p>

        <div
          className={cn(
            "mt-[calc(var(--rhythm)*10)] grid gap-x-[calc(var(--lane-inset)*2)] gap-y-[calc(var(--rhythm)*9)] border-t border-border-subtle",
            activeCategory === "all" ? "md:grid-cols-2" : "grid-cols-1"
          )}
        >
          {grouped.map(({ category, skills }, i) => (
            <FadeIn key={category} beat={i}>
              <SkillGroup
                category={category}
                skills={skills}
                featured={activeCategory !== "all"}
              />
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

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

function categoryCode(category: Skill["category"]): string {
  const codes: Partial<Record<Skill["category"], string>> = {
    frontend: "FE",
    backend: "BE",
    mobile: "MB",
    devops: "DO",
    design: "UX",
    database: "DB",
    cloud: "CL",
    systems: "SY",
    methodology: "AG",
    other: "•",
  };
  return codes[category] ?? "•";
}

const FILTER_CATEGORIES: (Skill["category"] | "all")[] = [
  "all",
  "frontend",
  "backend",
  "mobile",
  "devops",
  "design",
];

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
    <Section id="skills" variant="default" className="scroll-mt-20">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="Capabilities"
            title="Stack at a glance"
            description="Grouped by domain. Use the filters to focus the list for a role or conversation."
          />
        </FadeIn>

        <FadeIn delay={0.04}>
          <div className="mb-8 flex flex-wrap gap-3 sm:gap-4 md:mb-10">
            {(
              [
                ["Total", stats.total, "technologies listed"],
                ["Areas", stats.domains, "domains"],
              ] as const
            ).map(([label, value, hint]) => (
              <div
                key={label}
                className="flex min-w-[5.5rem] items-baseline gap-2 rounded-md border border-border-subtle bg-surface-elevated px-3 py-2 shadow-sm"
              >
                <span className="font-mono text-lg font-semibold tabular-nums text-content-primary">
                  {value}
                </span>
                <span className="text-[0.65rem] font-mono uppercase tracking-wider text-content-muted">
                  {label}
                  <span className="sr-only"> — {hint}</span>
                </span>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.06}>
          <div
            className="mb-6 flex flex-wrap gap-1.5"
            role="toolbar"
            aria-label="Filter skills by domain"
          >
            {FILTER_CATEGORIES.map((category) => {
              const active = activeCategory === category;
              const label =
                category === "all"
                  ? "All"
                  : category === "devops"
                    ? "DevOps"
                    : category.charAt(0).toUpperCase() + category.slice(1);
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    active
                      ? "bg-surface-inverse text-content-inverse"
                      : "bg-surface-subtle/80 text-content-secondary hover:bg-surface-subtle hover:text-content-primary"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="overflow-hidden rounded-lg border border-border-subtle bg-surface-elevated shadow-sm">
            <div className="divide-y divide-border-subtle">
              {grouped.map(({ category, skills }) => (
                <div key={category}>
                  <div className="flex items-center gap-3 bg-surface-subtle/30 px-4 py-2.5 sm:px-5">
                    <span className="w-7 shrink-0 font-mono text-[0.7rem] text-accent-cyan">
                      {categoryCode(category)}
                    </span>
                    <span className="text-xs font-semibold tracking-tight text-content-primary">
                      {categoryLabel(category)}
                    </span>
                    <span className="h-px min-w-[2rem] flex-1 bg-gradient-to-r from-border-strong to-transparent" />
                    <span className="font-mono text-[0.65rem] tabular-nums text-content-muted">
                      {skills.length}
                    </span>
                  </div>
                  <ul className="list-none" aria-label={`${categoryLabel(category)} skills`}>
                    {skills.map((skill) => (
                      <li
                        key={`${category}-${skill.name}`}
                        className="border-t border-border-subtle first:border-t-0"
                      >
                        <div className="px-4 py-2.5 transition-colors sm:px-5 hover:bg-surface-subtle/40">
                          <span className="text-sm text-content-primary">
                            {skill.name}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="mt-6 text-center text-xs text-content-muted sm:text-left">
            Learning focus: mobile performance, cloud economics, and how teams
            ship reliable products.
          </p>
        </FadeIn>
      </Container>
    </Section>
  );
}

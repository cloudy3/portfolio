"use client";

import { useState } from "react";
import { Experience, Education, Certification } from "@/types";
import {
  EXPERIENCE_DATA,
  EDUCATION_DATA,
  CERTIFICATIONS_DATA,
  getCurrentExperience,
  getPastExperiences,
  getTotalExperienceYears,
  getExperienceDuration,
} from "@/lib/data/experience";
import { cn } from "@/lib/utils";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";
import { FadeIn } from "../motion/FadeIn";

/** `2024.02` — the same stamp format the Work section uses. */
function stamp(date: Date): string {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function range(start: Date, end?: Date): string {
  return `${stamp(start)} - ${end ? stamp(end) : "now"}`;
}

/**
 * A single lane, running the length of the section.
 *
 * Every entry hangs off one continuous rule with a tick where it starts. That
 * replaces a stack of `border-white/10 bg-white/[0.04]` glass cards, each with
 * its own inner gradient rail and its own two-letter monogram box ("DM", "ED",
 * "CR" — the last two were not even initials, just type codes).
 *
 * The tick is structural, not decorative: it marks where an entry begins on the
 * timeline. Only the current role's tick takes the accent, which is real state
 * rather than a coloured dot on every row.
 */
function RailEntry({
  children,
  meta,
  current = false,
}: {
  children: React.ReactNode;
  meta: React.ReactNode;
  current?: boolean;
}) {
  return (
    <div className="lane-grid">
      <div className="md:col-span-2 md:pr-[var(--lane-inset)] md:text-right">
        {meta}
      </div>
      <div className="relative border-l border-border-subtle pb-[calc(var(--rhythm)*10)] pl-8 md:col-span-6">
        <span
          className={cn(
            "absolute -left-[3px] top-[0.55rem] h-[5px] w-[5px]",
            current ? "bg-accent" : "bg-border-strong"
          )}
          aria-hidden
        />
        {children}
      </div>
    </div>
  );
}

/** Stack and highlight lists: plain text separated by space, no chips, no dots. */
function Terms({ items, className }: { items: string[]; className?: string }) {
  return (
    <p
      className={cn(
        "flex flex-wrap gap-x-4 gap-y-1 text-xs text-content-muted",
        className
      )}
    >
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </p>
  );
}

function ExperienceEntry({
  experience,
  isExpanded,
  onToggle,
  current = false,
}: {
  experience: Experience;
  isExpanded: boolean;
  onToggle: () => void;
  current?: boolean;
}) {
  return (
    <RailEntry
      current={current}
      meta={
        <>
          <p className="num text-xs text-content-muted">
            {range(experience.startDate, experience.endDate)}
          </p>
          <p className="mt-1 text-xs text-content-muted">
            {getExperienceDuration(experience)}
          </p>
          {current ? (
            <p className="mt-2 text-xs font-medium text-accent-ink">Current</p>
          ) : null}
        </>
      }
    >
      <h3 className="text-lg text-content-primary">{experience.position}</h3>
      <p className="mt-1 text-sm font-medium text-content-secondary">
        {experience.company}
      </p>
      <p className="mt-[calc(var(--rhythm)*4)] max-w-[62ch] text-sm text-content-secondary">
        {experience.description}
      </p>
      <Terms
        items={experience.technologies}
        className="mt-[calc(var(--rhythm)*5)]"
      />

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="mt-[calc(var(--rhythm)*5)] rounded-control border border-border-subtle px-4 py-1.5 text-xs font-medium text-content-primary transition-colors hover:border-accent active:translate-y-px"
      >
        {isExpanded ? "Hide highlights" : "Highlights"}
      </button>

      {isExpanded ? (
        <div className="mt-[calc(var(--rhythm)*7)] space-y-[calc(var(--rhythm)*6)]">
          {experience.achievements.map((achievement, index) => (
            <div key={index} className="max-w-[62ch]">
              <p className="text-sm text-content-primary">
                {achievement.description}
              </p>
              {achievement.impact ? (
                <p className="mt-1 text-xs text-content-muted">
                  {achievement.impact}
                </p>
              ) : null}
              {achievement.metrics ? (
                <p className="num mt-1 text-xs text-accent-ink">
                  {achievement.metrics}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </RailEntry>
  );
}

function EducationEntry({ education }: { education: Education }) {
  return (
    <RailEntry
      meta={
        <p className="num text-xs text-content-muted">
          {range(education.startDate, education.endDate)}
        </p>
      }
    >
      <h3 className="text-lg text-content-primary">{education.degree}</h3>
      <p className="mt-1 text-sm font-medium text-content-secondary">
        {education.institution}
      </p>
      <p className="mt-[calc(var(--rhythm)*4)] max-w-[62ch] text-sm text-content-secondary">
        {education.description}
      </p>
      {education.achievements ? (
        <div className="mt-[calc(var(--rhythm)*4)] space-y-1">
          {education.achievements.slice(0, 2).map((achievement) => (
            <p key={achievement} className="text-xs text-content-muted">
              {achievement}
            </p>
          ))}
        </div>
      ) : null}
    </RailEntry>
  );
}

function CertificationEntry({
  certification,
}: {
  certification: Certification;
}) {
  return (
    <RailEntry
      meta={
        <p className="num text-xs text-content-muted">
          {certification.credentialId}
        </p>
      }
    >
      <h3 className="text-base text-content-primary">{certification.name}</h3>
      <p className="mt-1 text-sm text-content-secondary">
        {certification.issuer}
      </p>
    </RailEntry>
  );
}

const TABS = [
  { key: "experience", label: "Work" },
  { key: "education", label: "Education" },
  { key: "certifications", label: "Credentials" },
] as const;

const ExperienceSection = () => {
  const [expandedExperience, setExpandedExperience] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]["key"]>("experience");

  const handleToggleExpanded = (experienceId: string) => {
    setExpandedExperience(
      expandedExperience === experienceId ? null : experienceId
    );
  };

  const currentExp = getCurrentExperience();
  const pastExps = getPastExperiences();
  const totalYears = getTotalExperienceYears();

  const counters: [string, string][] = [
    [`${totalYears}+`, "Years"],
    [String(EXPERIENCE_DATA.length), "Roles"],
    [String(CERTIFICATIONS_DATA.length), "Certifications"],
  ];

  return (
    /*
     * `variant="default"` and no dark inversion. This section used to be the one
     * dark island in an otherwise light page, so scrolling About -> Experience ->
     * Contact crossed a theme boundary twice. It also meant a whole
     * glass-on-dark vocabulary existed for exactly one section.
     */
    <Section
      id="experience"
      variant="default"
      className="scroll-mt-20"
      field="diagonal"
      pigment="ai"
    >
      <Container keepOut>
        <FadeIn>
          <SectionHeader
            title="Experience and credentials"
            description="Roles shipped in production, formal training, and certifications that back the work."
          />
        </FadeIn>

        {/* Counters, left-aligned on the lane grid rather than centred. */}
        <FadeIn beat={1}>
          <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
            {counters.map(([value, label]) => (
              <div key={label} className="flex items-baseline gap-2">
                <span className="num text-3xl text-content-primary">
                  {value}
                </span>
                <span className="text-xs text-content-muted">{label}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn beat={2}>
          <div className="mt-[calc(var(--rhythm)*10)] flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                aria-pressed={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "rounded-control px-4 py-1.5 text-xs font-medium transition-colors active:translate-y-px",
                  activeTab === tab.key
                    ? "bg-surface-inverse text-content-inverse"
                    : "border border-border-subtle text-content-secondary hover:border-accent hover:text-content-primary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </FadeIn>

        <div className="mt-[calc(var(--rhythm)*10)]">
          {activeTab === "experience" ? (
            <div>
              {currentExp ? (
                <FadeIn>
                  <ExperienceEntry
                    experience={currentExp}
                    current
                    isExpanded={expandedExperience === currentExp.id}
                    onToggle={() => handleToggleExpanded(currentExp.id)}
                  />
                </FadeIn>
              ) : null}
              {pastExps.map((exp, index) => (
                <FadeIn key={exp.id} beat={index}>
                  <ExperienceEntry
                    experience={exp}
                    isExpanded={expandedExperience === exp.id}
                    onToggle={() => handleToggleExpanded(exp.id)}
                  />
                </FadeIn>
              ))}
            </div>
          ) : null}

          {activeTab === "education" ? (
            <div>
              {EDUCATION_DATA.map((edu, index) => (
                <FadeIn key={edu.id} beat={index}>
                  <EducationEntry education={edu} />
                </FadeIn>
              ))}
            </div>
          ) : null}

          {activeTab === "certifications" ? (
            <div>
              {CERTIFICATIONS_DATA.map((cert, index) => (
                <FadeIn key={cert.id} beat={index}>
                  <CertificationEntry certification={cert} />
                </FadeIn>
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
};

export default ExperienceSection;

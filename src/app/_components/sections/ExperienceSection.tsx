"use client";

import { useState } from "react";
import { Experience, Education, Certification } from "@/types";
import {
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
 * One entry in the editorial archive. Dates form a quiet metadata column while
 * the content holds a stable reading edge. Only the current role receives an
 * accent rule, because it communicates real state.
 */
function ArchiveEntry({
  children,
  meta,
  current = false,
}: {
  children: React.ReactNode;
  meta: React.ReactNode;
  current?: boolean;
}) {
  return (
    <article className="lane-grid">
      <div className="md:col-span-2 md:pr-[var(--lane-inset)] md:text-right">
        {meta}
      </div>
      <div
        className={cn(
          "pb-[calc(var(--rhythm)*10)] md:col-span-6",
          current && "-ml-6 border-l-2 border-accent pl-[22px]"
        )}
      >
        {children}
      </div>
    </article>
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
    <ArchiveEntry
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
        className="mt-[calc(var(--rhythm)*5)] text-xs font-medium text-accent-ink underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current active:translate-y-px"
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
    </ArchiveEntry>
  );
}

function EducationEntry({ education }: { education: Education }) {
  return (
    <ArchiveEntry
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
    </ArchiveEntry>
  );
}

function CertificationEntry({
  certification,
}: {
  certification: Certification;
}) {
  return (
    <ArchiveEntry
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
    </ArchiveEntry>
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

        <FadeIn beat={1}>
          <p className="text-sm text-content-muted">
            <span className="num text-content-primary">{totalYears}+</span>{" "}
            years building and supporting production systems.
          </p>
        </FadeIn>

        <FadeIn beat={2}>
          <nav
            className="mt-[calc(var(--rhythm)*8)] flex flex-wrap gap-x-7 gap-y-2 border-b border-border-subtle"
            aria-label="Experience view"
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                aria-pressed={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "border-b-2 px-0.5 py-3 text-sm font-medium transition-colors active:translate-y-px",
                  activeTab === tab.key
                    ? "border-accent text-content-primary"
                    : "border-transparent text-content-muted hover:text-content-primary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </FadeIn>

        <div className="mt-[calc(var(--rhythm)*10)]">
          {activeTab === "experience" ? (
            <div className="space-y-[calc(var(--rhythm)*3)]">
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

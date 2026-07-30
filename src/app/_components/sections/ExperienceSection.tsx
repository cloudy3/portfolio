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
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";
import { FadeIn } from "../motion/FadeIn";

interface ExperienceCardProps {
  experience: Experience;
  isExpanded: boolean;
  onToggle: () => void;
  index?: number;
}

const ExperienceCard = ({
  experience,
  isExpanded,
  onToggle,
  index = 0,
}: ExperienceCardProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getDuration = () => getExperienceDuration(experience);

  return (
    <FadeIn
      beat={index}
      className="relative rounded-lg border border-border-subtle bg-surface-elevated backdrop-blur-sm overflow-hidden"
    >
      <div className="absolute left-6 top-0 w-px h-full bg-border-strong" />
      <div className="absolute left-[1.15rem] top-8 h-2.5 w-2.5 rounded-full bg-accent border-2 border-surface-page" />

      <div className="pl-14 pr-6 py-7 md:pl-16 md:pr-8 md:py-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
          <div className="flex items-start mb-0">
            <div className="w-11 h-11 rounded-md border border-border-strong bg-surface-page flex items-center justify-center font-mono text-xs text-content-secondary mr-4 flex-shrink-0">
              {experience.company.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-content-primary tracking-tight">
                {experience.position}
              </h3>
              <h4 className="text-sm font-medium text-accent-ink mt-0.5">
                {experience.company}
              </h4>
              <div className="flex flex-col sm:flex-row sm:items-center text-sm text-content-secondary gap-2 mt-2">
                <span>
                  {formatDate(experience.startDate)} —{" "}
                  {experience.endDate
                    ? formatDate(experience.endDate)
                    : "Present"}
                </span>
                <span className="hidden sm:inline opacity-40">·</span>
                <span className="font-medium">{getDuration()}</span>
                {!experience.endDate && (
                  <>
                    <span className="hidden sm:inline opacity-40">·</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[0.65rem] font-mono uppercase tracking-wider bg-accent/10 text-accent-ink">
                      Current
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggle}
            className="flex-shrink-0 px-4 py-2 rounded-md border border-border-strong text-content-primary text-sm font-medium hover:border-accent transition-colors"
          >
            {isExpanded ? "Less" : "More"}
          </button>
        </div>

        <p className="text-content-secondary mb-4 leading-relaxed text-sm md:text-base">
          {experience.description}
        </p>

        <div className="mb-2">
          <h5 className="font-mono-label mb-2 text-content-secondary">
            Stack
          </h5>
          <div className="flex flex-wrap gap-2">
            {experience.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-sm bg-surface-page text-content-secondary text-xs font-mono border border-border-subtle"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-border-subtle">
            <h5 className="font-mono-label mb-3 text-content-secondary">
              Highlights
            </h5>
            <ul className="space-y-3">
              {experience.achievements.map((achievement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  <div className="text-content-secondary text-sm leading-relaxed">
                    <div className="text-content-primary font-medium mb-1">
                      {achievement.description}
                    </div>
                    {achievement.impact && (
                      <div className="text-xs opacity-80 mb-1">
                        Impact: {achievement.impact}
                      </div>
                    )}
                    {achievement.metrics && (
                      <div className="text-xs text-accent-ink font-medium">
                        {achievement.metrics}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </FadeIn>
  );
};

const EducationCard = ({
  education,
  index = 0,
}: {
  education: Education;
  index?: number;
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <FadeIn
      beat={index}
      className="rounded-lg border border-border-subtle bg-surface-elevated p-6"
    >
      <div className="flex items-start mb-4">
        <div className="w-11 h-11 rounded-md border border-border-strong bg-surface-page flex items-center justify-center font-mono text-xs text-content-secondary mr-4">
          ED
        </div>
        <div>
          <h3 className="text-lg font-semibold text-content-primary mb-1 tracking-tight">
            {education.degree}
          </h3>
          <h4 className="text-sm font-medium text-accent-ink mb-2">
            {education.institution}
          </h4>
          <div className="text-sm text-content-secondary">
            {formatDate(education.startDate)} — {formatDate(education.endDate)}
          </div>
        </div>
      </div>

      <p className="text-content-secondary mb-4 text-sm leading-relaxed">
        {education.description}
      </p>

      {education.achievements && (
        <div>
          <h5 className="font-mono-label mb-2 text-content-secondary">
            Highlights
          </h5>
          <ul className="space-y-1">
            {education.achievements.slice(0, 2).map((achievement, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                <span className="text-content-secondary text-xs leading-relaxed">
                  {achievement}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </FadeIn>
  );
};

const CertificationCard = ({
  certification,
  index = 0,
}: {
  certification: Certification;
  index?: number;
}) => {
  return (
    <FadeIn
      beat={index}
      className="rounded-lg border border-border-subtle bg-surface-elevated p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-md border border-border-strong bg-surface-page flex items-center justify-center font-mono text-[0.65rem] text-content-secondary">
            CR
          </div>
          <div>
            <h3 className="text-base font-semibold text-content-primary mb-1">
              {certification.name}
            </h3>
            <h4 className="text-sm text-accent-ink font-medium">
              {certification.issuer}
            </h4>
          </div>
        </div>
      </div>

      <div className="font-mono text-[0.65rem] text-content-secondary">
        ID: {certification.credentialId}
      </div>
    </FadeIn>
  );
};

const ExperienceSection = () => {
  const [expandedExperience, setExpandedExperience] = useState<string | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<
    "experience" | "education" | "certifications"
  >("experience");

  const handleToggleExpanded = (experienceId: string) => {
    setExpandedExperience(
      expandedExperience === experienceId ? null : experienceId,
    );
  };

  const currentExp = getCurrentExperience();
  const pastExps = getPastExperiences();
  const totalYears = getTotalExperienceYears();

  return (
    <Section
      id="experience"
      variant="inverse"
      className="scroll-mt-20 border-t border-border-subtle"
    >
      <Container>
        <FadeIn>
          <SectionHeader
            title="Experience and credentials"
            description="Roles shipped in production, formal training, and certifications that back the work."
          />
        </FadeIn>

        <FadeIn
          className="flex flex-wrap justify-center gap-10 mb-12"
        >
          <div className="text-center">
            <div className="text-3xl font-semibold text-content-primary tabular-nums mb-1">
              {totalYears}+
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-content-secondary">
              Years
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-semibold text-content-primary tabular-nums mb-1">
              {EXPERIENCE_DATA.length}
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-content-secondary">
              Roles
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-semibold text-content-primary tabular-nums mb-1">
              {CERTIFICATIONS_DATA.length}
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-content-secondary">
              Certifications
            </div>
          </div>
        </FadeIn>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {(
            [
              { key: "experience", label: "Work" },
              { key: "education", label: "Education" },
              { key: "certifications", label: "Credentials" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                activeTab === tab.key
                  ? "bg-surface-inverse text-content-inverse border-surface-inverse"
                  : "border-border-strong text-content-secondary hover:border-accent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          {activeTab === "experience" && (
            <div className="space-y-8">
              {currentExp && (
                <div>
                  <h3 className="font-mono-label mb-4 text-accent-ink">
                    Current
                  </h3>
                  <ExperienceCard
                    experience={currentExp}
                    isExpanded={expandedExperience === currentExp.id}
                    onToggle={() => handleToggleExpanded(currentExp.id)}
                    index={0}
                  />
                </div>
              )}

              {pastExps.length > 0 && (
                <div>
                  <h3 className="font-mono-label mb-4 mt-10 text-content-secondary">
                    Earlier
                  </h3>
                  <div className="space-y-6">
                    {pastExps.map((exp, index) => (
                      <ExperienceCard
                        key={exp.id}
                        experience={exp}
                        isExpanded={expandedExperience === exp.id}
                        onToggle={() => handleToggleExpanded(exp.id)}
                        index={index + 1}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "education" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {EDUCATION_DATA.map((edu, index) => (
                <EducationCard key={edu.id} education={edu} index={index} />
              ))}
            </div>
          )}

          {activeTab === "certifications" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CERTIFICATIONS_DATA.map((cert, index) => (
                <CertificationCard
                  key={cert.id}
                  certification={cert}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
};

export default ExperienceSection;

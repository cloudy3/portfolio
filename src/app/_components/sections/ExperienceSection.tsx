"use client";

import { useEffect, useRef, useState } from "react";
import { Experience, Education, Certification } from "@/types";
import {
  EXPERIENCE_DATA,
  EDUCATION_DATA,
  CERTIFICATIONS_DATA,
  getCurrentExperience,
  getPastExperiences,
  getTotalExperienceYears,
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getDuration = () => {
    const start = experience.startDate;
    const end = experience.endDate || new Date();

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));

    if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths > 1 ? "s" : ""}`;
    }

    const years = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;

    if (remainingMonths === 0) {
      return `${years} year${years > 1 ? "s" : ""}`;
    }

    return `${years} year${years > 1 ? "s" : ""} ${remainingMonths} month${
      remainingMonths > 1 ? "s" : ""
    }`;
  };

  return (
    <div
      ref={cardRef}
      className={`relative rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-all duration-700 overflow-hidden ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      <div className="absolute left-6 top-0 w-px h-full bg-gradient-to-b from-accent-cyan/50 to-accent-blue/20" />
      <div className="absolute left-[1.15rem] top-8 h-2.5 w-2.5 rounded-full bg-accent-cyan border-2 border-surface-inverse" />

      <div className="pl-14 pr-6 py-7 md:pl-16 md:pr-8 md:py-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
          <div className="flex items-start mb-0">
            <div className="w-11 h-11 rounded-md border border-white/15 bg-white/5 flex items-center justify-center font-mono text-xs text-content-inverse-muted mr-4 flex-shrink-0">
              {experience.company.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-content-inverse tracking-tight">
                {experience.position}
              </h3>
              <h4 className="text-sm font-medium text-accent-cyan/90 mt-0.5">
                {experience.company}
              </h4>
              <div className="flex flex-col sm:flex-row sm:items-center text-sm text-content-inverse-muted gap-2 mt-2">
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
                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[0.65rem] font-mono uppercase tracking-wider bg-accent-lime/15 text-accent-lime">
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
            className="flex-shrink-0 px-4 py-2 rounded-md border border-white/15 text-content-inverse text-sm font-medium hover:border-accent-cyan/40 transition-colors"
          >
            {isExpanded ? "Less" : "More"}
          </button>
        </div>

        <p className="text-content-inverse-muted mb-4 leading-relaxed text-sm md:text-base">
          {experience.description}
        </p>

        <div className="mb-2">
          <h5 className="font-mono-label mb-2 text-content-inverse-muted">
            Stack
          </h5>
          <div className="flex flex-wrap gap-2">
            {experience.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-sm bg-white/5 text-content-inverse-muted text-xs font-mono border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <h5 className="font-mono-label mb-3 text-content-inverse-muted">
              Highlights
            </h5>
            <ul className="space-y-3">
              {experience.achievements.map((achievement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-cyan" />
                  <div className="text-content-inverse-muted text-sm leading-relaxed">
                    <div className="text-content-inverse/90 font-medium mb-1">
                      {achievement.description}
                    </div>
                    {achievement.impact && (
                      <div className="text-xs opacity-80 mb-1">
                        Impact: {achievement.impact}
                      </div>
                    )}
                    {achievement.metrics && (
                      <div className="text-xs text-accent-cyan/90 font-medium">
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
    </div>
  );
};

const EducationCard = ({
  education,
  index = 0,
}: {
  education: Education;
  index?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      ref={cardRef}
      className={`rounded-lg border border-white/10 bg-white/[0.04] p-6 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="flex items-start mb-4">
        <div className="w-11 h-11 rounded-md border border-white/15 bg-white/5 flex items-center justify-center font-mono text-xs text-content-inverse-muted mr-4">
          ED
        </div>
        <div>
          <h3 className="text-lg font-semibold text-content-inverse mb-1 tracking-tight">
            {education.degree}
          </h3>
          <h4 className="text-sm font-medium text-accent-lime/90 mb-2">
            {education.institution}
          </h4>
          <div className="text-sm text-content-inverse-muted">
            {formatDate(education.startDate)} — {formatDate(education.endDate)}
          </div>
        </div>
      </div>

      <p className="text-content-inverse-muted mb-4 text-sm leading-relaxed">
        {education.description}
      </p>

      {education.achievements && (
        <div>
          <h5 className="font-mono-label mb-2 text-content-inverse-muted">
            Highlights
          </h5>
          <ul className="space-y-1">
            {education.achievements.slice(0, 2).map((achievement, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-lime/80" />
                <span className="text-content-inverse-muted text-xs leading-relaxed">
                  {achievement}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const CertificationCard = ({
  certification,
  index = 0,
}: {
  certification: Certification;
  index?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`rounded-lg border border-white/10 bg-white/[0.04] p-6 transition-all duration-700 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-md border border-white/15 bg-white/5 flex items-center justify-center font-mono text-[0.65rem] text-content-inverse-muted">
            CR
          </div>
          <div>
            <h3 className="text-base font-semibold text-content-inverse mb-1">
              {certification.name}
            </h3>
            <h4 className="text-sm text-accent-violet/90 font-medium">
              {certification.issuer}
            </h4>
          </div>
        </div>
      </div>

      <div className="font-mono text-[0.65rem] text-content-inverse-muted">
        ID: {certification.credentialId}
      </div>
    </div>
  );
};

const ExperienceSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [expandedExperience, setExpandedExperience] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<
    "experience" | "education" | "certifications"
  >("experience");
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeaderVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleToggleExpanded = (experienceId: string) => {
    setExpandedExperience(
      expandedExperience === experienceId ? null : experienceId
    );
  };

  const currentExp = getCurrentExperience();
  const pastExps = getPastExperiences();
  const totalYears = getTotalExperienceYears();

  return (
    <Section
      id="experience"
      variant="inverse"
      className="scroll-mt-20 border-t border-white/5"
    >
      <div ref={sectionRef}>
        <Container>
          <FadeIn>
            <SectionHeader
              inverse
              align="center"
              eyebrow="Trajectory"
              title="Experience and credentials"
              description="Roles shipped in production, formal training, and certifications that back the work."
            />
          </FadeIn>

          <div
            className={`flex flex-wrap justify-center gap-10 mb-12 transition-all duration-700 ${
              isHeaderVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="text-center">
              <div className="text-3xl font-semibold text-content-inverse tabular-nums mb-1">
                {totalYears}+
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-content-inverse-muted">
                Years
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-content-inverse tabular-nums mb-1">
                {EXPERIENCE_DATA.length}
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-content-inverse-muted">
                Roles
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-content-inverse tabular-nums mb-1">
                {CERTIFICATIONS_DATA.length}
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-content-inverse-muted">
                Certifications
              </div>
            </div>
          </div>

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
                    ? "bg-surface-elevated text-content-primary border-surface-elevated"
                    : "border-white/15 text-content-inverse-muted hover:border-accent-cyan/40"
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
                    <h3 className="font-mono-label mb-4 text-accent-lime">
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
                    <h3 className="font-mono-label mb-4 mt-10 text-content-inverse-muted">
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
      </div>
    </Section>
  );
};

export default ExperienceSection;

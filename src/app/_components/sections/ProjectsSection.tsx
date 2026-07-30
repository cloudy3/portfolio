"use client";

import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types";
import {
  getFeaturedProjects,
  sampleProjects,
  sortProjectsByDate,
} from "@/lib/projectData";
import { cn } from "@/lib/utils";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";
import { FadeIn } from "../motion/FadeIn";

interface ProjectsSectionProps {
  projects?: Project[];
  /** Max featured items on the homepage */
  limit?: number;
}

/** `2024.02` reads as a chart timestamp and keeps mono to numbers. */
function stamp(date: Date): string {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Technologies as plain text separated by space alone.
 *
 * These used to be mono chips, which broke the mono-is-for-numbers rule and put
 * five tiny boxes under every card. Separation by whitespace is the ma version
 * of the same list, and it needs no dots, borders or pills.
 */
function TechLine({
  technologies,
  limit = 4,
  className,
}: {
  technologies: string[];
  limit?: number;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex flex-wrap gap-x-4 gap-y-1 text-xs text-content-muted",
        className
      )}
    >
      {technologies.slice(0, limit).map((tech) => (
        <span key={tech}>{tech}</span>
      ))}
    </p>
  );
}

/**
 * Shared image frame. Sharp corners, hairline border, no shadow, no overlay.
 *
 * The old card stamped a "FEATURED" badge onto the artwork. Every project shown
 * in this section is featured, so the badge labelled nothing, and a tag floating
 * on a screenshot is its own tell.
 */
function Frame({
  project,
  ratio,
  sizes,
  priority = false,
}: {
  project: Project;
  ratio: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-border-subtle bg-surface-page",
        ratio
      )}
    >
      {project.images[0] ? (
        <Image
          src={project.images[0]}
          alt={project.title}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.015]"
        />
      ) : null}
    </div>
  );
}

/**
 * The accessible card-link pattern: only the title is a link, and an absolutely
 * positioned span stretches its hit area across the whole row. Wrapping the
 * entire row in an anchor instead would make its accessible name the
 * concatenation of every string inside it.
 */
function TitleLink({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="text-content-primary transition-colors group-hover:text-accent-ink"
    >
      {project.title}
      <span className="absolute inset-0" aria-hidden />
    </Link>
  );
}

/**
 * Lead item: text on the left three lanes, artwork on the right five.
 *
 * items-start, not items-center: centring the 3-lane text block against a tall
 * 5-lane image floated the title far below the section header and read as an
 * accidental gap rather than as composed space.
 */
function FeatureBand({ project }: { project: Project }) {
  return (
    <article className="group lane-grid relative items-start">
      <div className="md:col-span-3 md:pr-[var(--lane-inset)]">
        <p className="num text-xs text-content-muted">
          {stamp(new Date(project.completedAt))}
        </p>
        <h3 className="mt-[calc(var(--rhythm)*3)] text-2xl md:text-[1.75rem]">
          <TitleLink project={project} />
        </h3>
        <p className="mt-[calc(var(--rhythm)*4)] text-sm text-content-secondary">
          {project.description}
        </p>
        <TechLine
          technologies={project.technologies}
          className="mt-[calc(var(--rhythm)*5)]"
        />
      </div>
      <div className="md:col-span-5">
        <Frame
          project={project}
          ratio="aspect-[16/10]"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />
      </div>
    </article>
  );
}

/** Trailing items: artwork above text. */
function ProjectTile({ project }: { project: Project }) {
  return (
    <article className="group relative">
      <Frame
        project={project}
        ratio="aspect-[16/10]"
        sizes="(max-width: 768px) 100vw, 40vw"
      />
      <p className="num mt-[calc(var(--rhythm)*4)] text-xs text-content-muted">
        {stamp(new Date(project.completedAt))}
      </p>
      <h3 className="mt-[calc(var(--rhythm)*2)] text-lg">
        <TitleLink project={project} />
      </h3>
      <p className="mt-[calc(var(--rhythm)*3)] line-clamp-2 text-sm text-content-secondary">
        {project.description}
      </p>
      <TechLine
        technologies={project.technologies}
        limit={3}
        className="mt-[calc(var(--rhythm)*4)]"
      />
    </article>
  );
}

export function ProjectsSection({
  projects = sampleProjects,
  limit = 3,
}: ProjectsSectionProps) {
  const featured = sortProjectsByDate(getFeaturedProjects(projects)).slice(
    0,
    limit
  );

  const [lead, ...rest] = featured;

  return (
    <Section id="work" variant="subtle" className="scroll-mt-20">
      <Container>
        <FadeIn>
          <SectionHeader
            title="Systems that hold up in production"
            description="A few recent builds across mobile, APIs and real-time data, with clear ownership from design through deployment."
          />
        </FadeIn>

        {/*
         * One lead band plus the remainder, replacing three identical columns.
         * Cell count always matches item count: with two featured projects this
         * renders a band and one full-width tile, never a grid with a hole in it.
         */}
        {lead ? (
          <FadeIn>
            <FeatureBand project={lead} />
          </FadeIn>
        ) : null}

        {rest.length > 0 ? (
          <div
            className={cn(
              "mt-[calc(var(--rhythm)*20)] grid gap-x-[var(--lane-inset)] gap-y-[calc(var(--rhythm)*16)]",
              rest.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"
            )}
          >
            {rest.map((project, i) => (
              <FadeIn key={project.id} beat={i + 1}>
                <ProjectTile project={project} />
              </FadeIn>
            ))}
          </div>
        ) : null}

        <FadeIn>
          <div className="mt-[calc(var(--rhythm)*24)] flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border-subtle pt-[calc(var(--rhythm)*8)]">
            <Link
              href="/projects"
              className="inline-flex items-center rounded-control bg-surface-inverse px-6 py-3 text-sm font-medium text-content-inverse transition-opacity hover:opacity-90 active:translate-y-px"
            >
              View all projects
            </Link>
            {/* Moved out of the hero, which had four competing actions. */}
            <Link
              href="/keyboard-story"
              className="text-sm font-medium text-accent-ink underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current"
            >
              Keyboard story
            </Link>
            <p className="max-w-[40ch] text-sm text-content-muted">
              Each build has a full case study with context, stack and outcomes.
            </p>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}

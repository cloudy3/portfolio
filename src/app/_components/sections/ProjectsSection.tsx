"use client";

import Link from "next/link";
import { Project } from "@/types";
import {
  getFeaturedProjects,
  sampleProjects,
  sortProjectsByDate,
} from "@/lib/projectData";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";
import { FadeIn } from "../motion/FadeIn";
import { ProjectListCard } from "../projects/ProjectListCard";

interface ProjectsSectionProps {
  projects?: Project[];
  /** Max featured items on the homepage */
  limit?: number;
}

export function ProjectsSection({
  projects = sampleProjects,
  limit = 3,
}: ProjectsSectionProps) {
  const featured = sortProjectsByDate(getFeaturedProjects(projects)).slice(
    0,
    limit
  );

  return (
    <Section id="work" variant="subtle" className="scroll-mt-20">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="Selected work"
            title="Systems that hold up in production"
            description="A few recent builds—mobile, APIs, and real-time data—with clear ownership from design through deployment."
          />
        </FadeIn>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {featured.map((project, i) => (
            <FadeIn key={project.id} delay={i * 0.05}>
              <ProjectListCard project={project} />
            </FadeIn>
          ))}
        </div>
        <FadeIn>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center px-5 py-3 rounded-md bg-surface-inverse text-content-inverse text-sm font-medium hover:opacity-90 transition-opacity"
            >
              View all projects
            </Link>
            <p className="text-sm text-content-muted max-w-md">
              Full case studies with context, stack, and outcomes—shareable
              URLs for each build.
            </p>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "../_components/ui/Container";
import { Section } from "../_components/ui/Section";
import { SectionHeader } from "../_components/ui/SectionHeader";
import { sampleProjects, sortProjectsByFeatured } from "@/lib/projectData";
import { ProjectsCatalog } from "./ProjectsCatalog";

export const metadata: Metadata = {
  title: "Selected work | Jing Feng",
  description:
    "Engineering projects across mobile, cloud, and full-stack systems.",
};

export default function ProjectsPage() {
  const ordered = sortProjectsByFeatured([...sampleProjects]);

  return (
    <Section variant="default">
      <Container>
        <nav className="text-sm text-content-muted mb-8">
          <Link
            href="/"
            className="hover:text-accent-cyan transition-colors"
          >
            Home
          </Link>
          <span className="mx-2 text-border-strong">/</span>
          <span className="text-content-primary">Work</span>
        </nav>
        <SectionHeader
          eyebrow="Portfolio"
          title="Selected work"
          description="Product-minded engineering across Flutter, Python, and Google Cloud—shipping systems that hold up in the field."
        />
        <ProjectsCatalog projects={ordered} />
      </Container>
    </Section>
  );
}

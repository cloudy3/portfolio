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
    <Section variant="default" judgment={false} field="bars" pigment="shu">
      <Container keepOut>
        <nav className="mb-[calc(var(--rhythm)*10)] text-sm text-content-muted">
          <Link href="/" className="transition-colors hover:text-accent-ink">
            Home
          </Link>
          <span className="mx-2 text-border-strong">/</span>
          <span className="text-content-primary">Work</span>
        </nav>
        <SectionHeader
          title="Selected work"
          description="Product-minded engineering across Flutter, Python and Google Cloud, shipping systems that hold up in the field."
        />
        <ProjectsCatalog projects={ordered} />
      </Container>
    </Section>
  );
}

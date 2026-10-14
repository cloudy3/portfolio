import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "../_components/ui/Container";
import { Section } from "../_components/ui/Section";
import { SectionHeader } from "../_components/ui/SectionHeader";
import { sampleProjects, sortProjectsByFeatured } from "@/lib/projectData";
import { SHARED_OPEN_GRAPH } from "@/lib/site";
import { ProjectsCatalog } from "./ProjectsCatalog";

const title = "Selected work";
const description =
  "Engineering projects across mobile, cloud, and full-stack systems.";

export const metadata: Metadata = {
  // The root layout's title template appends " | Jing Feng".
  title,
  description,
  alternates: { canonical: "/projects" },
  openGraph: { ...SHARED_OPEN_GRAPH, title, description, url: "/projects" },
};

export default function ProjectsPage() {
  const ordered = sortProjectsByFeatured([...sampleProjects]);

  return (
    <Section variant="default" judgment={false} field="bars" pigment="shu">
      <Container keepOut>
        <nav
          aria-label="Breadcrumb"
          className="mb-[calc(var(--rhythm)*10)] text-sm text-content-muted"
        >
          <Link href="/" className="transition-colors hover:text-accent-ink">
            Home
          </Link>
          <span className="mx-2 text-border-strong" aria-hidden>
            /
          </span>
          <span className="text-content-primary" aria-current="page">
            Work
          </span>
        </nav>
        <SectionHeader
          as="h1"
          title="Selected work"
          description="Product-minded engineering across Flutter, Python and Google Cloud, shipping systems that hold up in the field."
        />
        <ProjectsCatalog projects={ordered} />
      </Container>
    </Section>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/app/_components/ui/Container";
import { Section } from "@/app/_components/ui/Section";
import {
  getAllProjectSlugs,
  getProjectBySlug,
  sampleProjects,
} from "@/lib/projectData";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project" };
  return {
    title: `${project.title} | Jing Feng`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article>
      <Section variant="default" className="pb-8 md:pb-12">
        <Container>
          <nav className="text-sm text-content-muted mb-8">
            <Link
              href="/"
              className="hover:text-accent-cyan transition-colors"
            >
              Home
            </Link>
            <span className="mx-2 text-border-strong">/</span>
            <Link
              href="/projects"
              className="hover:text-accent-cyan transition-colors"
            >
              Work
            </Link>
            <span className="mx-2 text-border-strong">/</span>
            <span className="text-content-primary line-clamp-1">
              {project.title}
            </span>
          </nav>

          <header className="max-w-3xl">
            <p className="font-mono-label mb-3">
              {project.category} ·{" "}
              {new Date(project.completedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-content-primary mb-6">
              {project.title}
            </h1>
            <p className="text-lg text-content-secondary leading-relaxed">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-surface-inverse text-content-inverse text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Live
                </a>
              ) : null}
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-md border border-border-strong text-content-primary text-sm font-medium hover:border-accent-cyan/50 transition-colors"
                >
                  Source
                </a>
              ) : null}
            </div>
          </header>
        </Container>
      </Section>

      {project.images.length > 0 ? (
        <Section variant="subtle" padded className="pt-0">
          <Container>
            <div className="grid gap-6 md:grid-cols-2">
              {project.images.map((src, i) => (
                <div
                  key={src}
                  className="relative aspect-video rounded-lg overflow-hidden border border-border-subtle bg-surface-elevated shadow-sm"
                >
                  <Image
                    src={src}
                    alt={`${project.title} preview ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section variant="default">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 max-w-5xl">
            <div className="lg:col-span-7 space-y-10">
              {project.role ? (
                <div>
                  <h2 className="font-mono-label mb-3">Role</h2>
                  <p className="text-content-secondary leading-relaxed">
                    {project.role}
                  </p>
                </div>
              ) : null}
              {project.problem ? (
                <div>
                  <h2 className="font-mono-label mb-3">Context</h2>
                  <p className="text-content-secondary leading-relaxed">
                    {project.problem}
                  </p>
                </div>
              ) : null}
              {project.solution ? (
                <div>
                  <h2 className="font-mono-label mb-3">Approach</h2>
                  <p className="text-content-secondary leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              ) : null}
              {project.outcomes && project.outcomes.length > 0 ? (
                <div>
                  <h2 className="font-mono-label mb-3">Outcomes</h2>
                  <ul className="space-y-2 text-content-secondary">
                    {project.outcomes.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan"
                          aria-hidden
                        />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {project.longDescription ? (
                <div>
                  <h2 className="font-mono-label mb-3">Details</h2>
                  <p className="text-content-secondary leading-relaxed whitespace-pre-line">
                    {project.longDescription}
                  </p>
                </div>
              ) : null}
            </div>
            <aside className="lg:col-span-5 lg:pl-8">
              <div className="sticky top-24 rounded-lg border border-border-subtle bg-surface-elevated p-6">
                <h2 className="font-mono-label mb-4">Stack</h2>
                <ul className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="text-xs px-2.5 py-1 rounded-sm bg-surface-subtle text-content-secondary font-mono"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-border-subtle">
                  <h2 className="font-mono-label mb-3">More work</h2>
                  <ul className="space-y-2 text-sm">
                    {sampleProjects
                      .filter((p) => p.id !== project.id)
                      .slice(0, 4)
                      .map((p) => (
                        <li key={p.id}>
                          <Link
                            href={`/projects/${p.id}`}
                            className="text-content-secondary hover:text-accent-cyan transition-colors"
                          >
                            {p.title}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </article>
  );
}

import type { Metadata } from "next";
import { preload } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatMonthStamp } from "@/lib/utils";
import { Container } from "@/app/_components/ui/Container";
import { Section } from "@/app/_components/ui/Section";
import {
  getAllProjectSlugs,
  getProjectBySlug,
  sampleProjects,
} from "@/lib/projectData";
import { SHARED_OPEN_GRAPH } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${slug}` },
    // The image comes from the colocated opengraph-image.tsx.
    openGraph: {
      ...SHARED_OPEN_GRAPH,
      type: "article",
      title: project.title,
      description: project.description,
      url: `/projects/${slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  if (project.video) {
    preload(project.video.poster, { as: "image", fetchPriority: "high" });
  }

  return (
    <article>
      <Section
        variant="default"
        judgment={false}
        className="pb-8 md:pb-12"
        field="rail"
        pigment="ai"
      >
        <Container keepOut>
          <nav aria-label="Breadcrumb" className="text-sm text-content-muted mb-8">
            <Link
              href="/"
              className="transition-colors hover:text-accent-ink"
            >
              Home
            </Link>
            <span className="mx-2 text-border-strong" aria-hidden>
              /
            </span>
            <Link
              href="/projects"
              className="transition-colors hover:text-accent-ink"
            >
              Work
            </Link>
            <span className="mx-2 text-border-strong" aria-hidden>
              /
            </span>
            <span
              className="text-content-primary line-clamp-1"
              aria-current="page"
            >
              {project.title}
            </span>
          </nav>

          <header className="max-w-3xl">
            {/* Mono on the date only, and no middle dot as a default separator. */}
            <p className="flex items-baseline gap-4 text-xs text-content-muted">
              <span className="num">
                {formatMonthStamp(new Date(project.completedAt))}
              </span>
              <span>{project.category}</span>
            </p>
            <h1 className="mb-[calc(var(--rhythm)*6)] mt-[calc(var(--rhythm)*4)] text-content-primary">
              {project.title}
            </h1>
            {project.tagline ? (
              <p className="mb-4 text-xl text-content-primary">{project.tagline}</p>
            ) : null}
            <p className="text-lg text-content-secondary leading-relaxed">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-control bg-surface-inverse px-6 py-3 text-sm font-medium text-content-inverse transition-opacity hover:opacity-90 active:translate-y-px"
                >
                  Live
                </a>
              ) : null}
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-control border border-border-strong px-6 py-3 text-sm font-medium text-content-primary transition-colors hover:border-accent active:translate-y-px"
                >
                  Source
                </a>
              ) : null}
            </div>
          </header>
        </Container>
      </Section>

      {project.video ? (
        <Section variant="subtle" padded className="pt-0">
          <Container keepOut>
            <figure>
              <video
                controls
                playsInline
                preload="none"
                poster={project.video.poster}
                width={project.video.width}
                height={project.video.height}
                aria-label={`${project.title} product teaser`}
                aria-describedby="project-video-description"
                className="aspect-video w-full border border-border-subtle bg-surface-elevated object-contain"
              >
                <source src={project.video.src} type="video/mp4" />
                {project.video.captionsSrc ? (
                  <track kind="captions" src={project.video.captionsSrc} srcLang="en" label="English" />
                ) : null}
              </video>
              <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-3 text-sm text-content-secondary">
                <span>Product teaser · <span className="num">{Math.round(project.video.duration)}</span> seconds</span>
                <a href={project.video.src} className="underline underline-offset-4 transition-colors hover:text-accent-ink">
                  Open video directly
                </a>
              </figcaption>
              <p id="project-video-description" className="mt-3 max-w-3xl text-sm leading-relaxed text-content-muted">
                {project.video.description}
              </p>
            </figure>
          </Container>
        </Section>
      ) : null}

      {project.images.length > 0 ? (
        <Section variant="subtle" padded className="pt-0">
          <Container>
            {/*
             * Column count follows the image count. A fixed md:grid-cols-2 left
             * an empty cell beside every project that ships a single screenshot,
             * which is most of them.
             */}
            <div
              className={
                project.images.length > 1
                  ? "grid gap-6 md:grid-cols-2"
                  : "grid gap-6"
              }
            >
              {project.images.map((src, i) => (
                <div
                  key={src}
                  className="relative aspect-video overflow-hidden border border-border-subtle bg-surface-elevated"
                >
                  <Image
                    src={src}
                    alt={`${project.title} preview ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes={
                      project.images.length > 1
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "100vw"
                    }
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
              {project.caseStudy ? (
                project.caseStudy.map((section) => (
                  <section key={section.heading}>
                    <h2 className="mb-[calc(var(--rhythm)*3)] text-sm font-medium text-content-primary">
                      {section.heading}
                    </h2>
                    <div className="space-y-4 text-content-secondary leading-relaxed">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))
              ) : (<>
              {project.role ? (
                <div>
                  <h2 className="mb-[calc(var(--rhythm)*3)] text-sm font-medium text-content-primary">Role</h2>
                  <p className="text-content-secondary leading-relaxed">
                    {project.role}
                  </p>
                </div>
              ) : null}
              {project.problem ? (
                <div>
                  <h2 className="mb-[calc(var(--rhythm)*3)] text-sm font-medium text-content-primary">Context</h2>
                  <p className="text-content-secondary leading-relaxed">
                    {project.problem}
                  </p>
                </div>
              ) : null}
              {project.solution ? (
                <div>
                  <h2 className="mb-[calc(var(--rhythm)*3)] text-sm font-medium text-content-primary">Approach</h2>
                  <p className="text-content-secondary leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              ) : null}
              {project.outcomes && project.outcomes.length > 0 ? (
                <div>
                  <h2 className="mb-[calc(var(--rhythm)*3)] text-sm font-medium text-content-primary">Outcomes</h2>
                  {/* No coloured dot per row: spacing separates them. */}
                  <ul className="list-none space-y-[calc(var(--rhythm)*4)] text-content-secondary">
                    {project.outcomes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {project.longDescription ? (
                <div>
                  <h2 className="mb-[calc(var(--rhythm)*3)] text-sm font-medium text-content-primary">Details</h2>
                  <p className="text-content-secondary leading-relaxed whitespace-pre-line">
                    {project.longDescription}
                  </p>
                </div>
              ) : null}
              </>)}
            </div>
            <aside className="lg:col-span-5 lg:pl-8">
              <div className="sticky top-24 border-t border-border-strong pt-[calc(var(--rhythm)*6)]">
                <h2 className="mb-[calc(var(--rhythm)*4)] text-sm font-medium text-content-primary">Stack</h2>
                <ul className="flex list-none flex-wrap gap-x-4 gap-y-1 text-xs text-content-muted">
                  {project.technologies.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
                <div className="mt-[calc(var(--rhythm)*10)] border-t border-border-subtle pt-[calc(var(--rhythm)*6)]">
                  <h2 className="mb-[calc(var(--rhythm)*3)] text-sm font-medium text-content-primary">More work</h2>
                  <ul className="space-y-2 text-sm">
                    {sampleProjects
                      .filter((p) => p.id !== project.id)
                      .slice(0, 4)
                      .map((p) => (
                        <li key={p.id}>
                          <Link
                            href={`/projects/${p.id}`}
                            className="text-content-secondary transition-colors hover:text-accent-ink"
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

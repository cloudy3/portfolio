import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types";
import { cn, formatMonthStamp } from "@/lib/utils";

/**
 * Catalogue entry, used by the /projects index.
 *
 * Was a rounded, shadowed, bordered card with a "FEATURED" pill overlaid on the
 * artwork, a mono uppercase "WEB · FEB 2024" meta line and four mono chips. Now:
 * sharp hairline frame, no shadow, nothing floating on the image, mono reserved
 * for the date, technologies separated by whitespace.
 *
 * The featured marker survives here (unlike on the homepage, where every item
 * shown is featured and the badge said nothing) because this page mixes both.
 * It sits in the meta line as plain text rather than on top of the artwork.
 */
export function ProjectListCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  return (
    <article className={cn("group relative", className)}>
      <div className="relative aspect-[16/10] overflow-hidden border border-border-subtle bg-surface-subtle transition-colors group-hover:border-accent">
        {project.images[0] ? (
          <Image
            src={project.images[0]}
            // Decorative: the linked title below names the project, so a
            // screen reader would hear it twice.
            alt=""
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.015]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : null}
      </div>

      <div className="mt-[calc(var(--rhythm)*4)] flex items-baseline gap-4">
        <p className="num text-xs text-content-muted">
          {formatMonthStamp(new Date(project.completedAt))}
        </p>
        <p className="text-xs text-content-muted">{project.category}</p>
        {project.featured ? (
          <p className="text-xs text-accent-ink">Featured</p>
        ) : null}
      </div>

      <h3 className="mt-[calc(var(--rhythm)*2)] text-lg">
        {/*
         * Accessible card-link pattern: only the title is a link, and the
         * stretched span carries the hit area over the whole entry, so the
         * accessible name stays the title rather than every string inside.
         */}
        <Link
          href={`/projects/${project.id}`}
          className="text-content-primary transition-colors group-hover:text-accent-ink"
        >
          {project.title}
          <span className="absolute inset-0" aria-hidden />
        </Link>
      </h3>

      <p className="mt-[calc(var(--rhythm)*3)] line-clamp-2 text-sm text-content-secondary">
        {project.description}
      </p>

      <p className="mt-[calc(var(--rhythm)*4)] flex flex-wrap gap-x-4 gap-y-1 text-xs text-content-muted">
        {project.technologies.slice(0, 4).map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </p>
    </article>
  );
}

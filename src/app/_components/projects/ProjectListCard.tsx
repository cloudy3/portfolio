import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types";
import { cn } from "@/lib/utils";

export function ProjectListCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const href = `/projects/${project.id}`;

  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-lg border border-border-subtle bg-surface-elevated overflow-hidden",
        "shadow-sm transition-all duration-300 ease-out",
        "hover:border-accent-cyan/30 hover:shadow-md",
        className
      )}
    >
      <div className="relative aspect-[16/10] bg-surface-subtle">
        {project.images[0] ? (
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : null}
        {project.featured ? (
          <span className="absolute top-3 right-3 font-mono-label text-[0.65rem] px-2 py-1 rounded-sm bg-surface-inverse/90 text-content-inverse">
            Featured
          </span>
        ) : null}
      </div>
      <div className="p-5 md:p-6">
        <p className="font-mono-label mb-2 text-content-muted">
          {project.category} ·{" "}
          {new Date(project.completedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })}
        </p>
        <h3 className="text-lg font-semibold text-content-primary tracking-tight mb-2 group-hover:text-accent-cyan transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-content-secondary line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 rounded-sm bg-surface-subtle text-content-muted font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

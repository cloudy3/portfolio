"use client";

import { useMemo, useState } from "react";
import { Project } from "@/types";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import { filterProjectsByCategory, sortProjectsByFeatured } from "@/lib/projectData";
import { ProjectListCard } from "../_components/projects/ProjectListCard";
import { cn } from "@/lib/utils";

export function ProjectsCatalog({ projects }: { projects: Project[] }) {
  const [category, setCategory] =
    useState<(typeof PROJECT_CATEGORIES)[number]>("all");

  const filtered = useMemo(() => {
    const list = filterProjectsByCategory(projects, category);
    return sortProjectsByFeatured(list);
  }, [projects, category]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10 md:mb-12">
        {PROJECT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              "border border-border-subtle",
              category === cat
                ? "bg-surface-inverse text-content-inverse border-surface-inverse"
                : "bg-surface-elevated text-content-secondary hover:border-accent-cyan/40"
            )}
          >
            {cat === "all" ? "All" : cat}
          </button>
        ))}
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {filtered.map((project) => (
          <ProjectListCard key={project.id} project={project} />
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-content-muted text-center py-16">
          No projects in this category.
        </p>
      ) : null}
    </div>
  );
}

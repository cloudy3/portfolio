import { getAllProjectSlugs, getProjectBySlug } from "@/lib/projectData";
import { renderShareCard, SHARE_CARD_SIZE } from "@/lib/shareCard";

export const alt = "Project case study by Jing Feng";
export const size = SHARE_CARD_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

/*
 * A card per case study, so a shared project link previews that project
 * rather than the generic site card. Drawn rather than taken from the
 * project's screenshots: those are not all 1.91:1, and some are SVG, which
 * the share crawlers do not render.
 */
export default async function ProjectOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  return renderShareCard({
    title: project?.title ?? "Selected work",
    subtitle: "Case study by Jing Feng",
    tags: project?.technologies.slice(0, 3) ?? [],
  });
}

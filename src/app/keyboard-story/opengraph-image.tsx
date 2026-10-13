import { renderShareCard, SHARE_CARD_SIZE } from "@/lib/shareCard";

export const alt = "Keyboard Story by Jing Feng";
export const size = SHARE_CARD_SIZE;
export const contentType = "image/png";

// Colocated because a page that sets its own `openGraph` stops inheriting the
// root card, so without this the route shared with no image at all.
export default function KeyboardStoryOpengraphImage() {
  return renderShareCard({
    title: "Keyboard Story",
    subtitle: "A scroll-driven frame sequence",
    tags: ["Next.js", "Canvas", "Framer Motion"],
  });
}

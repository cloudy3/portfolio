import { renderShareCard, SHARE_CARD_SIZE } from "@/lib/shareCard";

export const alt = "Jing Feng - Software Engineer";
export const size = SHARE_CARD_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderShareCard({
    title: "Jing Feng",
    subtitle: "Software Engineer",
    tags: ["Flutter", "Python", "Google Cloud"],
  });
}

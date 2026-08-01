import dynamic from "next/dynamic";
import HeroSection from "./_components/sections/HeroSection";

/**
 * Placeholder while a section's chunk loads.
 *
 * Transparent rather than painted. Section surfaces are translucent now so the
 * field reads through them, and an opaque placeholder would punch a hole in the
 * composition for the length of the fetch.
 *
 * This also drops an `inverse` variant that Experience alone used. It painted
 * `bg-surface-inverse`, which is the inverted-vs-page fill: in dark mode that
 * is PAPER, so the one section using it flashed a white block while loading.
 * Experience stopped being an inverted island in the redesign; the loader was
 * never updated.
 */
function SectionLoader() {
  return (
    <div className="section-padding flex min-h-[200px] items-center justify-center">
      {/* An accent segment on a track, matching loading.tsx. Circular spinners
          were the last rounded shapes on a site whose surfaces are all sharp. */}
      <div className="h-px w-32 bg-border-strong" aria-hidden>
        <span className="block h-px w-1/3 animate-pulse bg-accent" />
      </div>
    </div>
  );
}

const ProjectsSection = dynamic(
  () =>
    import("./_components/sections/ProjectsSection").then((mod) => ({
      default: mod.ProjectsSection,
    })),
  {
    loading: () => <SectionLoader />,
  }
);

const AboutSection = dynamic(
  () => import("./_components/sections/AboutSection"),
  {
    loading: () => <SectionLoader />,
  }
);

const SkillsSection = dynamic(
  () => import("./_components/sections/SkillsSection"),
  {
    loading: () => <SectionLoader />,
  }
);

const ExperienceSection = dynamic(
  () => import("./_components/sections/ExperienceSection"),
  {
    loading: () => <SectionLoader />,
  }
);

const ContactSection = dynamic(
  () => import("./_components/sections/ContactSection"),
  {
    loading: () => <SectionLoader />,
  }
);

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ContactSection />
    </div>
  );
}

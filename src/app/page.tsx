import dynamic from "next/dynamic";
import HeroSection from "./_components/sections/HeroSection";

type LoaderVariant = "default" | "inverse";

function SectionLoader({ variant = "default" }: { variant?: LoaderVariant }) {
  const containerClass =
    variant === "inverse"
      ? "section-padding bg-surface-inverse flex items-center justify-center min-h-[200px]"
      : "section-padding bg-surface-page flex items-center justify-center min-h-[200px]";
  return (
    <div className={containerClass}>
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
    loading: () => <SectionLoader variant="inverse" />,
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

import dynamic from "next/dynamic";
import HeroSection from "./_components/sections/HeroSection";

type LoaderVariant = "default" | "inverse";

function SectionLoader({ variant = "default" }: { variant?: LoaderVariant }) {
  const containerClass =
    variant === "inverse"
      ? "section-padding bg-surface-inverse flex items-center justify-center min-h-[200px]"
      : "section-padding bg-surface-page flex items-center justify-center min-h-[200px]";
  const spinnerClass =
    variant === "inverse"
      ? "h-9 w-9 rounded-full border-2 border-content-inverse-muted border-t-accent-cyan animate-spin"
      : "h-9 w-9 rounded-full border-2 border-border-strong border-t-accent-cyan animate-spin";

  return (
    <div className={containerClass}>
      <div className={spinnerClass} aria-hidden />
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

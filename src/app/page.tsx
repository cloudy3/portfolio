import dynamic from "next/dynamic";
import HeroSection from "./_components/sections/HeroSection";

const ProjectsSection = dynamic(
  () =>
    import("./_components/sections/ProjectsSection").then((mod) => ({
      default: mod.ProjectsSection,
    })),
  {
    loading: () => (
      <div className="section-padding bg-surface-subtle flex items-center justify-center min-h-[200px]">
        <div
          className="h-9 w-9 rounded-full border-2 border-border-strong border-t-accent-cyan animate-spin"
          aria-hidden
        />
      </div>
    ),
  }
);

const AboutSection = dynamic(
  () => import("./_components/sections/AboutSection"),
  {
    loading: () => (
      <div className="section-padding bg-surface-page flex items-center justify-center min-h-[200px]">
        <div
          className="h-9 w-9 rounded-full border-2 border-border-strong border-t-accent-cyan animate-spin"
          aria-hidden
        />
      </div>
    ),
  }
);

const SkillsSection = dynamic(
  () => import("./_components/sections/SkillsSection"),
  {
    loading: () => (
      <div className="section-padding bg-surface-page flex items-center justify-center min-h-[200px]">
        <div
          className="h-9 w-9 rounded-full border-2 border-border-strong border-t-accent-cyan animate-spin"
          aria-hidden
        />
      </div>
    ),
  }
);

const ExperienceSection = dynamic(
  () => import("./_components/sections/ExperienceSection"),
  {
    loading: () => (
      <div className="section-padding bg-surface-inverse flex items-center justify-center min-h-[200px]">
        <div
          className="h-9 w-9 rounded-full border-2 border-content-inverse-muted border-t-accent-cyan animate-spin"
          aria-hidden
        />
      </div>
    ),
  }
);

const ContactSection = dynamic(
  () => import("./_components/sections/ContactSection"),
  {
    loading: () => (
      <div className="section-padding bg-surface-subtle flex items-center justify-center min-h-[200px]">
        <div
          className="h-9 w-9 rounded-full border-2 border-border-strong border-t-accent-cyan animate-spin"
          aria-hidden
        />
      </div>
    ),
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

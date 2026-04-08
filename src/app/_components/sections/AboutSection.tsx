"use client";

import Image from "next/image";
import {
  JING_FENG_PROFILE,
  TECHNICAL_HIGHLIGHTS,
} from "@/lib/data/professional-profile";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";
import { FadeIn } from "../motion/FadeIn";

const pillars = [
  {
    id: "01",
    title: "End-to-end delivery",
    body: "Flutter and Dart on the client, Python and Node on the server, deployed on Google Cloud with CI you can trust.",
  },
  {
    id: "02",
    title: "Product + engineering",
    body: "Clarify constraints, ship incremental value, and instrument enough to learn—without boiling the ocean.",
  },
  {
    id: "03",
    title: "Global collaboration",
    body: "Comfortable across time zones and stakeholders, from field teams to platform owners.",
  },
];

export default function AboutSection() {
  const handleDownloadCV = () => {
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "Cheah_Jing_Feng_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Section id="about" variant="default" className="scroll-mt-20">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="About"
            title="Builder mindset, systems thinking"
            description="I care about code that survives contact with real users—readable, observable, and easy to evolve."
          />
        </FadeIn>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          <FadeIn className="lg:col-span-5">
            <div className="relative max-w-sm mx-auto lg:mx-0">
              <div className="aspect-square rounded-lg overflow-hidden border border-border-subtle bg-surface-subtle shadow-sm">
                <Image
                  src="/images/placeholder-avatar.svg"
                  alt=""
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div
                className="absolute -z-10 -bottom-3 -right-3 w-full h-full rounded-lg border border-border-subtle bg-grid-faint"
                aria-hidden
              />
            </div>
          </FadeIn>

          <div className="lg:col-span-7 space-y-8">
            <FadeIn delay={0.05}>
              <p className="text-lg text-content-secondary leading-relaxed">
                {JING_FENG_PROFILE.summary}
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleDownloadCV}
                  className="inline-flex items-center px-5 py-3 rounded-md bg-surface-inverse text-content-inverse text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Download résumé
                </button>
                <a
                  href="#contact"
                  className="inline-flex items-center px-5 py-3 rounded-md border border-border-strong text-content-primary text-sm font-medium hover:border-accent-cyan/40 transition-colors"
                >
                  Contact
                </a>
              </div>
            </FadeIn>
          </div>
        </div>

        <FadeIn>
          <h3 className="font-mono-label mb-8">Capabilities</h3>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {pillars.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.06}>
              <div className="h-full rounded-lg border border-border-subtle bg-surface-elevated p-6 shadow-sm">
                <p className="font-mono text-accent-cyan text-sm mb-3">{p.id}</p>
                <h4 className="text-lg font-semibold text-content-primary mb-2">
                  {p.title}
                </h4>
                <p className="text-sm text-content-secondary leading-relaxed">
                  {p.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="rounded-lg border border-border-subtle bg-surface-subtle/60 p-8 md:p-10">
            <h3 className="font-mono-label mb-6">Technical breadth</h3>
            <div className="grid sm:grid-cols-2 gap-8 text-sm">
              <div>
                <p className="font-mono-label mb-2 text-accent-blue">Languages</p>
                <p className="text-content-secondary">
                  {TECHNICAL_HIGHLIGHTS.languages.join(" · ")}
                </p>
              </div>
              <div>
                <p className="font-mono-label mb-2 text-accent-blue">
                  Frameworks
                </p>
                <p className="text-content-secondary">
                  {TECHNICAL_HIGHLIGHTS.frameworks.join(" · ")}
                </p>
              </div>
              <div>
                <p className="font-mono-label mb-2 text-accent-blue">Cloud</p>
                <p className="text-content-secondary">
                  {TECHNICAL_HIGHLIGHTS.cloudInfrastructure.join(" · ")}
                </p>
              </div>
              <div>
                <p className="font-mono-label mb-2 text-accent-blue">Data & tools</p>
                <p className="text-content-secondary">
                  {TECHNICAL_HIGHLIGHTS.databasesTools.join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}

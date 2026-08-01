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

/**
 * Three capabilities.
 *
 * These were three equal bordered cards in a 3-column grid, each led by an
 * "01 / 02 / 03" label. The equal-thirds feature row is the most templated
 * layout on the web, and the numbers were decoration: the items are not a
 * sequence and nothing refers back to them. They are lane-aligned passages now,
 * grouped by space alone, with no boxes and no counters.
 */
const pillars = [
  {
    title: "End-to-end delivery",
    body: "Flutter and Dart on the client, Python and Node on the server, deployed on Google Cloud with CI you can trust.",
  },
  {
    title: "Product and engineering",
    body: "Clarify constraints, ship incremental value, and instrument enough to learn without boiling the ocean.",
  },
  {
    title: "Global collaboration",
    body: "Comfortable across time zones and stakeholders, from field teams to platform owners.",
  },
];

/** Label plus contents, so breadth reads as an index rather than a spec table. */
const breadth = [
  { label: "Languages", items: TECHNICAL_HIGHLIGHTS.languages },
  { label: "Frameworks", items: TECHNICAL_HIGHLIGHTS.frameworks },
  { label: "Cloud", items: TECHNICAL_HIGHLIGHTS.cloudInfrastructure },
  { label: "Data and tools", items: TECHNICAL_HIGHLIGHTS.databasesTools },
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
    <Section
      id="about"
      variant="default"
      className="scroll-mt-20"
      field="ribbon"
      pigment="moegi"
    >
      <Container keepOut>
        <FadeIn>
          <SectionHeader
            title="Builder mindset, systems thinking"
            description="I care about code that survives contact with real users: readable, observable, and easy to evolve."
          />
        </FadeIn>

        {/*
         * Portrait on lanes 1-2, prose on lanes 4-8, lane 3 deliberately empty.
         * An offset composition rather than a 50/50 image-and-text split, partly
         * because the Work section above already spends that split once, and
         * partly because the gap is the point: the empty lane is the ma.
         */}
        <div className="lane-grid">
          <FadeIn className="md:col-span-2">
            <div className="relative w-40 sm:w-48 md:w-full md:max-w-[12rem]">
              <div className="aspect-[4/5] overflow-hidden border border-border-subtle bg-surface-subtle">
                <Image
                  src="/images/pfp.png"
                  alt={`${JING_FENG_PROFILE.name}, ${JING_FENG_PROFILE.title}`}
                  width={512}
                  height={640}
                  /* Over-requests vs. the box width on purpose: the source is
                     square, so object-cover scales it ~1.25x to fill 4:5. */
                  sizes="(min-width: 768px) 12rem, 12rem"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn beat={1} className="md:col-span-5 md:col-start-4">
            <p className="text-lg text-content-secondary">
              {JING_FENG_PROFILE.summary}
            </p>
            <div className="mt-[calc(var(--rhythm)*8)] flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDownloadCV}
                className="inline-flex items-center rounded-control bg-surface-inverse px-6 py-3 text-sm font-medium text-content-inverse transition-opacity hover:opacity-90 active:translate-y-px"
              >
                Download résumé
              </button>
              <a
                href="#contact"
                className="inline-flex items-center rounded-control border border-border-strong px-6 py-3 text-sm font-medium text-content-primary transition-colors hover:border-accent active:translate-y-px"
              >
                Contact
              </a>
            </div>
          </FadeIn>
        </div>

        {/* Capabilities: title on the left lanes, body on the right. No boxes. */}
        <div className="mt-[calc(var(--rhythm)*12)] space-y-[calc(var(--rhythm)*8)]">
          {pillars.map((pillar, i) => (
            <FadeIn key={pillar.title} beat={i} className="lane-grid">
              <h3 className="text-base font-medium text-content-primary md:col-span-2 md:pr-[var(--lane-inset)]">
                {pillar.title}
              </h3>
              <p className="max-w-[52ch] text-content-secondary md:col-span-5 md:col-start-4">
                {pillar.body}
              </p>
            </FadeIn>
          ))}
        </div>

        {/*
         * Technical breadth: four grouped rows on the lane grid with one hairline
         * between each. This was a 2x2 grid of mono labels inside a bordered
         * panel, every value list joined by middle dots. Four clusters with
         * sparse rules is the right shape for this content; items within a
         * cluster separate on whitespace.
         */}
        <div className="mt-[calc(var(--rhythm)*12)]">
          <FadeIn>
            <h3 className="text-base font-medium text-content-primary">
              Technical breadth
            </h3>
          </FadeIn>
          <dl className="mt-[calc(var(--rhythm)*6)]">
            {breadth.map((group, i) => (
              <FadeIn
                key={group.label}
                beat={i}
                className="lane-grid border-t border-border-subtle py-[calc(var(--rhythm)*5)]"
              >
                <dt className="text-sm text-content-muted md:col-span-2 md:pr-[var(--lane-inset)]">
                  {group.label}
                </dt>
                <dd className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-content-secondary md:col-span-6">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </dd>
              </FadeIn>
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  );
}

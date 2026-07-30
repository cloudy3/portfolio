import type { Metadata } from "next";
import Link from "next/link";
import KeyboardScrollytellingSection from "../_components/sections/KeyboardScrollytellingSection";

export const metadata: Metadata = {
  title: "Keyboard Story",
  description:
    "Scroll-driven keyboard deconstruction and reassembly sequence built with Next.js and Framer Motion.",
};

export default function KeyboardStoryPage() {
  return (
    <div className="bg-surface-page text-content-primary">
      <section className="container-custom section-padding">
        {/* No "Bonus Experience" mono label: the headline says what this is. */}
        <h1 className="max-w-[20ch]">Keyboard disassembly, frame by frame.</h1>
        <p className="mt-[calc(var(--rhythm)*6)] max-w-[56ch] text-content-secondary">
          A scroll-linked visual narrative using a sticky canvas and image
          sequence playback, tuned for smooth motion across desktop and mobile.
        </p>
        <div className="mt-[calc(var(--rhythm)*8)]">
          <Link
            href="/"
            className="inline-flex items-center rounded-control border border-border-strong px-6 py-3 text-sm font-medium text-content-primary transition-colors hover:border-accent active:translate-y-px"
          >
            Back to portfolio
          </Link>
        </div>
      </section>

      <KeyboardScrollytellingSection />
    </div>
  );
}

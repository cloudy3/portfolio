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
      <section className="container-custom py-20 md:py-24">
        <p className="font-mono-label text-content-muted mb-4">
          Bonus Experience
        </p>
        <h1 className="max-w-3xl">
          Keyboard disassembly, frame by frame.
        </h1>
        <p className="mt-6 max-w-2xl text-content-secondary">
          A scroll-linked visual narrative using a sticky canvas and image
          sequence playback, tuned for smooth motion across desktop and mobile.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-md border border-border-strong px-4 py-2 text-sm font-medium text-content-primary hover:border-accent-cyan/70 hover:text-accent-cyan transition-colors"
          >
            Back to portfolio
          </Link>
        </div>
      </section>

      <KeyboardScrollytellingSection />
    </div>
  );
}

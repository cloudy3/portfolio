"use client";

import { useEffect, useRef } from "react";
import { registerField } from "@/lib/field/registry";
import type { PigmentName, TreatmentName } from "@/lib/field/types";

interface FieldAnchorProps {
  treatment: TreatmentName;
  pigment: PigmentName;
}

/**
 * Opts a section into the field.
 *
 * Renders nothing. Its only job is to be a client boundary inside an otherwise
 * server-rendered section: it walks up to the nearest `[data-field]` ancestor
 * on mount and registers it, so `Section` and the page components stay Server
 * Components.
 *
 * The alternative was having the engine scan the DOM for `[data-field]`, which
 * needs a MutationObserver here because the home page loads its sections
 * through next/dynamic and they arrive after first paint. An explicit
 * register/unregister pair gets the exact lifecycle instead, and cannot go
 * stale when a section unmounts on navigation.
 */
export default function FieldAnchor({ treatment, pigment }: FieldAnchorProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = ref.current?.closest<HTMLElement>("[data-field]");
    if (!section) return;

    // The element the composition must not draw over. Optional: a section with
    // none simply lets the field use the whole frame. Its attribute value picks
    // the clip mode, defaulting to the element's own box.
    const keepOut = section.querySelector<HTMLElement>("[data-keepout]");

    return registerField({
      el: section,
      treatment,
      pigment,
      keepOut,
      keepOutMode:
        keepOut?.getAttribute("data-keepout") === "column" ? "column" : "box",
    });
  }, [treatment, pigment]);

  return <span ref={ref} hidden aria-hidden />;
}

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Field from "../Field";
import FieldAnchor from "../FieldAnchor";
import { getFieldEntries } from "@/lib/field/registry";

/**
 * Ported from WaveLineVisualization.test.tsx.
 *
 * That suite's genuinely load-bearing cases were: the canvas renders, it is
 * decorative rather than announced, and the component degrades instead of
 * throwing when the drawing context is unavailable. All three survive here.
 *
 * Its remaining cases asserted on a mocked react-three-fiber `<Canvas>` and so
 * only ever proved the mock rendered. The equivalent real assertions now live
 * in field/__tests__/treatments.test.ts, which exercises the drawing itself.
 *
 * jsdom returns null from getContext, so every render here takes the engine's
 * no-context path. That is the resilience case, and it means these tests also
 * prove the site is fully functional with no field at all.
 */
describe("Field", () => {
  beforeEach(() => {
    // Stated explicitly rather than relying on jsdom's default, which is the
    // same behaviour but logs a "Not implemented" warning per render and reads
    // as an accident instead of the case under test.
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  });

  it("renders a canvas", () => {
    render(<Field />);
    expect(screen.getByTestId("field-canvas").tagName).toBe("CANVAS");
  });

  it("is decorative: hidden from assistive tech and not interactive", () => {
    render(<Field />);
    const canvas = screen.getByTestId("field-canvas");

    expect(canvas).toHaveAttribute("aria-hidden", "true");
    expect(canvas.className).toMatch(/pointer-events-none/);
    // Fixed behind the page. z-0 rather than a negative index, which would put
    // it behind the opaque body background.
    expect(canvas.className).toMatch(/fixed/);
    expect(canvas.className).toMatch(/z-0/);
  });

  it("does not throw when no 2D context is available", () => {
    // jsdom has none. A thrown error here would take the whole layout down,
    // since Field is mounted above every page.
    expect(() => render(<Field />)).not.toThrow();
  });
});

describe("FieldAnchor", () => {
  it("registers the section it sits in, and cleans up on unmount", () => {
    const { unmount } = render(
      <section data-field>
        <FieldAnchor treatment="lines" pigment="shu" />
        <div data-keepout="box">copy</div>
      </section>
    );

    const entries = getFieldEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].treatment).toBe("lines");
    expect(entries[0].pigment).toBe("shu");
    expect(entries[0].keepOut).not.toBeNull();
    expect(entries[0].keepOutMode).toBe("box");

    unmount();
    expect(getFieldEntries()).toHaveLength(0);
  });

  it("reads the keep-out mode from the attribute", () => {
    const { unmount } = render(
      <section data-field>
        <FieldAnchor treatment="bars" pigment="ai" />
        <div data-keepout="column">copy</div>
      </section>
    );

    expect(getFieldEntries()[0].keepOutMode).toBe("column");
    unmount();
  });

  it("registers with no keep-out when the section declares none", () => {
    // A section without one simply lets the composition use the whole frame.
    const { unmount } = render(
      <section data-field>
        <FieldAnchor treatment="lines" pigment="moegi" />
      </section>
    );

    expect(getFieldEntries()[0].keepOut).toBeNull();
    unmount();
  });
});

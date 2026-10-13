import { vi } from "vitest";
import { formatMonthStamp, smoothScrollTo } from "@/lib/utils";

describe("formatMonthStamp", () => {
  // ISO dates parse as midnight UTC. With local getters these came out a month
  // early west of UTC (2023-07-01 rendered as 2023.06 in New York); run the
  // suite with TZ=America/New_York to exercise that case.
  it.each([
    ["2023-07-01", "2023.07"],
    ["2021-12-28", "2021.12"],
    ["2024-01-01", "2024.01"],
  ])("formats %s as %s in any timezone", (iso, expected) => {
    expect(formatMonthStamp(new Date(iso))).toBe(expected);
  });
});

describe("smoothScrollTo", () => {
  let target: HTMLElement;

  beforeEach(() => {
    target = document.createElement("section");
    target.id = "work";
    document.body.appendChild(target);
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    target.remove();
    document.documentElement.classList.remove("reduce-motion");
    vi.mocked(window.matchMedia).mockClear();
  });

  it("scrolls smoothly by default", () => {
    smoothScrollTo("work", 80);
    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" })
    );
  });

  it("jumps instead when the OS asks for reduced motion", () => {
    vi.mocked(window.matchMedia).mockImplementationOnce(
      (query: string) => ({ matches: true, media: query }) as MediaQueryList
    );
    smoothScrollTo("work", 80);
    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "auto" })
    );
  });

  it("jumps instead when the reduce-motion class is set", () => {
    document.documentElement.classList.add("reduce-motion");
    smoothScrollTo("work", 80);
    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "auto" })
    );
  });

  it("moves focus to the section's heading without scrolling it", () => {
    const heading = document.createElement("h2");
    target.appendChild(heading);
    const focus = vi.spyOn(heading, "focus");

    smoothScrollTo("work", 80);

    expect(document.activeElement).toBe(heading);
    expect(heading.getAttribute("tabindex")).toBe("-1");
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it("focuses the section itself when it has no heading", () => {
    smoothScrollTo("work", 80);
    expect(document.activeElement).toBe(target);
  });

  it("does nothing for a missing section", () => {
    smoothScrollTo("no-such-section");
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});

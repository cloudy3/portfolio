import { act, render, screen, fireEvent } from "@testing-library/react";
import { vi, type Mock } from "vitest";
import { usePathname } from "next/navigation";
import Navigation from "../shared/Navigation";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const mockUsePathname = usePathname as Mock;
let observerCallback: IntersectionObserverCallback | undefined;
let sectionElements: Map<string, HTMLElement>;

describe("Navigation", () => {
  beforeEach(() => {
    mockUsePathname.mockReset();
    mockUsePathname.mockReturnValue("/");
    window.scrollTo = vi.fn();
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    observerCallback = undefined;
    sectionElements = new Map();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          observerCallback = callback;
        }
        disconnect() {}
        observe() {}
        unobserve() {}
        takeRecords() {
          return [];
        }
      }
    );
    const realGetElementById =
      Document.prototype.getElementById.bind(document);
    document.getElementById = vi.fn((id: string) => {
      if (["hero", "work", "about", "skills", "experience", "contact"].includes(id)) {
        if (!sectionElements.has(id)) {
          const el = document.createElement("div");
          el.id = id;
          sectionElements.set(id, el);
        }
        return sectionElements.get(id) ?? null;
      }
      // jsdom's querySelector("#id") delegates to getElementById, so fall
      // back to the real lookup for everything else.
      return realGetElementById(id);
    });
  });

  it("renders brand", () => {
    render(<Navigation />);
    expect(screen.getByText("JF")).toBeInTheDocument();
  });

  it("renders primary nav labels on desktop", () => {
    render(<Navigation />);
    expect(screen.getAllByText("Home").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Work").length).toBeGreaterThanOrEqual(1);
  });

  it("scrolls to Work on the homepage without navigating to /projects", () => {
    const { container } = render(<Navigation />);
    const workButtons = screen.getAllByRole("button", { name: /^Work$/ });

    expect(workButtons).toHaveLength(2);
    expect(screen.queryByRole("link", { name: /^Work$/ })).not.toBeInTheDocument();

    fireEvent.click(workButtons[0]);
    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" })
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    fireEvent.click(workButtons[1]);
    expect(container.querySelector("#mobile-nav")?.className).toMatch(/max-h-0/);
  });

  it("marks Work active when its homepage section enters the reading band", () => {
    render(<Navigation />);
    const work = sectionElements.get("work");
    const notifyIntersection = observerCallback;

    if (!notifyIntersection || !work) {
      throw new Error("Navigation did not observe the Work section");
    }

    act(() => {
      notifyIntersection(
        [{ isIntersecting: true, target: work } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    const workButtons = screen.getAllByRole("button", { name: /^Work$/ });
    expect(
      workButtons.some((button) => button.className.includes("text-accent-cyan"))
    ).toBe(true);
    expect(
      workButtons.some((button) => button.className.includes("border-accent"))
    ).toBe(true);
  });

  it("opens mobile menu", () => {
    const { container } = render(<Navigation />);
    const btn = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(btn);
    const mobileNav = container.querySelector("#mobile-nav");
    expect(mobileNav).toBeTruthy();
    expect(mobileNav?.getAttribute("class") ?? "").toMatch(/max-h-\[28rem\]/);
  });

  it("uses elevated styles when not on home", () => {
    mockUsePathname.mockReturnValue("/projects");
    render(<Navigation />);
    const nav = screen.getByRole("navigation");
    expect(nav.className).toMatch(/bg-surface-elevated/);
  });

  it("renders exactly one skip link", () => {
    // AccessibilityProvider used to inject a second one at runtime, so
    // keyboard users tabbed through two in a row.
    render(<Navigation />);
    const skipLinks = screen.getAllByRole("link", {
      name: /skip to (content|main content)/i,
    });
    expect(skipLinks).toHaveLength(1);
    expect(skipLinks[0]).toHaveAttribute("href", "#main-content");
  });

  it("closes the mobile menu on Escape and returns focus to the trigger", () => {
    const { container } = render(<Navigation />);
    const btn = screen.getByRole("button", { name: /open menu/i });

    fireEvent.click(btn);
    const mobileNav = container.querySelector("#mobile-nav");
    expect(mobileNav?.getAttribute("class") ?? "").toMatch(/max-h-\[28rem\]/);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(mobileNav?.getAttribute("class") ?? "").toMatch(/max-h-0/);
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: /open menu/i })
    );
  });

  it("ignores Escape when the mobile menu is already closed", () => {
    const { container } = render(<Navigation />);

    fireEvent.keyDown(document, { key: "Escape" });

    const mobileNav = container.querySelector("#mobile-nav");
    expect(mobileNav?.getAttribute("class") ?? "").toMatch(/max-h-0/);
  });

  it("marks Work active on /projects", () => {
    mockUsePathname.mockReturnValue("/projects");
    render(<Navigation />);
    const workLinks = screen.getAllByRole("link", { name: /^Work$/ });
    expect(
      workLinks.some((link) => link.className.includes("text-accent-cyan"))
    ).toBe(true);
  });
});

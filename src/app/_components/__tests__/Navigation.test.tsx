import { render, screen, fireEvent } from "@testing-library/react";
import { vi, type Mock } from "vitest";
import { usePathname } from "next/navigation";
import Navigation from "../shared/Navigation";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const mockUsePathname = usePathname as Mock;

describe("Navigation", () => {
  beforeEach(() => {
    mockUsePathname.mockReset();
    mockUsePathname.mockReturnValue("/");
    window.scrollTo = vi.fn();
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    const realGetElementById =
      Document.prototype.getElementById.bind(document);
    document.getElementById = vi.fn((id: string) => {
      if (["hero", "work", "about", "skills", "experience", "contact"].includes(id)) {
        const el = document.createElement("div");
        el.id = id;
        return el;
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
});

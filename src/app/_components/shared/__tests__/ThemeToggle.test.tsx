import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";

/**
 * The store in useTheme caches the resolved scheme at module scope, which is
 * right for a page (one module, one lifetime) and wrong for a test file, where
 * each case needs a clean starting point. Hence the module reset and dynamic
 * import rather than a top-level one.
 */
async function renderToggle() {
  vi.resetModules();
  const { default: ThemeToggle } = await import("../ThemeToggle");
  return render(<ThemeToggle />);
}

/** vitest.setup.ts stubs matchMedia to `matches: false`, i.e. a light system. */
describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it("offers the opposite of the system scheme when nothing is stored", async () => {
    await renderToggle();

    expect(
      screen.getByRole("button", { name: /switch to dark theme/i })
    ).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  it("stores the choice and marks the document when it differs from the system", async () => {
    await renderToggle();

    fireEvent.click(screen.getByRole("button", { name: /switch to dark/i }));

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("jf-theme")).toBe("dark");
    expect(
      screen.getByRole("button", { name: /switch to light theme/i })
    ).toBeInTheDocument();
  });

  it("clears the choice when it lands back on the system scheme", async () => {
    // Otherwise toggling twice would pin the visitor to a value that happens to
    // match their OS today, and changing the OS setting later would do nothing.
    await renderToggle();
    const button = screen.getByRole("button", { name: /switch to/i });

    fireEvent.click(button);
    fireEvent.click(button);

    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(localStorage.getItem("jf-theme")).toBeNull();
  });

  it("adopts a stored choice on mount", async () => {
    localStorage.setItem("jf-theme", "dark");

    await renderToggle();

    expect(
      screen.getByRole("button", { name: /switch to light theme/i })
    ).toBeInTheDocument();
  });
});

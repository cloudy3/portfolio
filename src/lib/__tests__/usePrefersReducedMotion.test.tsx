import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type Listener = (event: { matches: boolean }) => void;

/** Install a controllable matchMedia and return a setter for its state. */
const mockMatchMedia = (initial: boolean) => {
  const listeners = new Set<Listener>();
  let matches = initial;

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn((query: string) => ({
      get matches() {
        return matches;
      },
      media: query,
      onchange: null,
      addEventListener: (_: string, cb: Listener) => listeners.add(cb),
      removeEventListener: (_: string, cb: Listener) => listeners.delete(cb),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  return (next: boolean) => {
    matches = next;
    for (const cb of listeners) cb({ matches: next });
  };
};

describe("usePrefersReducedMotion", () => {
  it("reports the preference when reduced motion is on", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it("reports false when the user has no preference", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it("updates when the preference changes after mount", () => {
    // The bug this guards: framer's useReducedMotion caches in a useState
    // initializer, so the value never updates for the component's lifetime.
    const setMatches = mockMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);

    act(() => setMatches(true));
    expect(result.current).toBe(true);

    act(() => setMatches(false));
    expect(result.current).toBe(false);
  });

  it("unsubscribes on unmount", () => {
    const setMatches = mockMatchMedia(false);
    const { result, unmount } = renderHook(() => usePrefersReducedMotion());

    unmount();
    // No state update on an unmounted component => no act() warning, no throw.
    expect(() => setMatches(true)).not.toThrow();
    expect(result.current).toBe(false);
  });
});

import { vi } from "vitest";
import {
  getFieldEntries,
  registerField,
  subscribeToFields,
} from "../registry";

/**
 * The registry is what replaced DOM scanning for `[data-field]` sections.
 * Its whole contract is that entries arrive and leave cleanly, because the home
 * page loads its sections through next/dynamic and a stale entry would leave
 * the engine observing a detached node.
 */
describe("field registry", () => {
  const entry = (id: string) => ({
    el: Object.assign(document.createElement("section"), { id }),
    treatment: "lines" as const,
    pigment: "shu" as const,
    keepOut: null,
    keepOutMode: "box" as const,
  });

  it("registers and unregisters", () => {
    const unregister = registerField(entry("a"));
    expect(getFieldEntries()).toHaveLength(1);

    unregister();
    expect(getFieldEntries()).toHaveLength(0);
  });

  it("notifies subscribers on both register and unregister", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToFields(listener);

    const unregister = registerField(entry("b"));
    expect(listener).toHaveBeenCalledTimes(1);

    unregister();
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    registerField(entry("c"))();
    // Still 2: an unsubscribed listener must not keep receiving.
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("keeps entries in registration order", () => {
    // The engine resolves overlapping sections by taking the first visible one
    // in this order, which is document order in practice.
    const first = registerField(entry("first"));
    const second = registerField(entry("second"));

    expect(getFieldEntries().map((e) => e.el.id)).toEqual(["first", "second"]);

    first();
    second();
  });
});

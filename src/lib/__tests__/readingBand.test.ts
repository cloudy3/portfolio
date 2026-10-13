import { lastInDocument } from "../readingBand";

/**
 * The nav and the field engine both resolve "which section is being read"
 * through lastInDocument. It has to follow the page, not the order sections
 * happened to be observed in: the home sections load as separate chunks.
 */
describe("lastInDocument", () => {
  const sections = ["hero", "work", "about"].map((id) =>
    Object.assign(document.createElement("section"), { id })
  );

  beforeAll(() => document.body.append(...sections));
  afterAll(() => sections.forEach((section) => section.remove()));

  it("returns null when nothing is in the band", () => {
    expect(lastInDocument([])).toBeNull();
  });

  it("picks the lower of two overlapping sections", () => {
    const [hero, work] = sections;
    expect(lastInDocument([hero, work])?.id).toBe("work");
  });

  it("ignores the order the sections were collected in", () => {
    const [hero, work, about] = sections;
    expect(lastInDocument(new Set([about, hero, work]))?.id).toBe("about");
    expect(lastInDocument([work, about, hero])?.id).toBe("about");
  });
});

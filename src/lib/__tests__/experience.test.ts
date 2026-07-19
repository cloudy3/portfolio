import {
  formatDuration,
  getExperienceDuration,
  monthsBetween,
} from "@/lib/data/experience";

describe("monthsBetween", () => {
  it("counts an exact year boundary as whole months", () => {
    // The bug this replaced: day-based math (diff / 30) turned exactly two
    // years into 25 months, which rendered as "2 years 1 month".
    expect(
      monthsBetween(new Date("2023-07-01"), new Date("2025-07-01"))
    ).toBe(24);
  });

  it("does not count the final month until its day-of-month is reached", () => {
    expect(
      monthsBetween(new Date("2021-07-01"), new Date("2021-12-28"))
    ).toBe(5);
    expect(
      monthsBetween(new Date("2021-07-01"), new Date("2022-01-01"))
    ).toBe(6);
  });

  it("handles cross-year and cross-month spans", () => {
    expect(
      monthsBetween(new Date("2023-11-15"), new Date("2024-02-15"))
    ).toBe(3);
    expect(
      monthsBetween(new Date("2023-11-15"), new Date("2024-02-14"))
    ).toBe(2);
  });

  it("never returns a negative duration", () => {
    expect(
      monthsBetween(new Date("2025-01-01"), new Date("2024-01-01"))
    ).toBe(0);
  });
});

describe("formatDuration", () => {
  it.each([
    [1, "1 month"],
    [5, "5 months"],
    [11, "11 months"],
    [12, "1 year"],
    [13, "1 year 1 month"],
    [24, "2 years"],
    [26, "2 years 2 months"],
  ])("formats %i months as %s", (months, expected) => {
    expect(formatDuration(months)).toBe(expected);
  });
});

describe("getExperienceDuration", () => {
  it("renders exactly two years as '2 years'", () => {
    expect(
      getExperienceDuration(
        { startDate: new Date("2023-07-01"), endDate: new Date("2025-07-01") },
        new Date("2026-01-01")
      )
    ).toBe("2 years");
  });

  it("measures an ongoing role against the supplied 'now'", () => {
    expect(
      getExperienceDuration(
        { startDate: new Date("2023-07-01"), endDate: undefined },
        new Date("2024-10-01")
      )
    ).toBe("1 year 3 months");
  });
});

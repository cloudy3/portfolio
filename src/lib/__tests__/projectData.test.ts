import {
  sampleProjects,
  filterProjectsByCategory,
  sortProjectsByDate,
  sortProjectsByFeatured,
  getFeaturedProjects,
  getProjectBySlug,
  getAllProjectSlugs,
} from "../projectData";

describe("Project Data Management", () => {
  describe("filterProjectsByCategory", () => {
    it('should return all projects when category is "all"', () => {
      const result = filterProjectsByCategory(sampleProjects, "all");
      expect(result).toEqual(sampleProjects);
    });

    it("should filter projects by web category", () => {
      const result = filterProjectsByCategory(sampleProjects, "web");
      expect(result.every((project) => project.category === "web")).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should filter projects by mobile category", () => {
      const result = filterProjectsByCategory(sampleProjects, "mobile");
      expect(result.every((project) => project.category === "mobile")).toBe(
        true
      );
    });

    it("should return empty array for non-existent category", () => {
      const result = filterProjectsByCategory(sampleProjects, "nonexistent");
      expect(result).toEqual([]);
    });
  });

  describe("sortProjectsByDate", () => {
    it("should sort projects by date (newest first by default)", () => {
      const result = sortProjectsByDate(sampleProjects);
      for (let i = 0; i < result.length - 1; i++) {
        const currentDate = new Date(result[i].completedAt).getTime();
        const nextDate = new Date(result[i + 1].completedAt).getTime();
        expect(currentDate).toBeGreaterThanOrEqual(nextDate);
      }
    });

    it("should sort projects by date (oldest first when ascending)", () => {
      const result = sortProjectsByDate(sampleProjects, true);
      for (let i = 0; i < result.length - 1; i++) {
        const currentDate = new Date(result[i].completedAt).getTime();
        const nextDate = new Date(result[i + 1].completedAt).getTime();
        expect(currentDate).toBeLessThanOrEqual(nextDate);
      }
    });

    it("should not mutate original array", () => {
      const originalLength = sampleProjects.length;
      const originalFirst = sampleProjects[0];
      sortProjectsByDate(sampleProjects);
      expect(sampleProjects.length).toBe(originalLength);
      expect(sampleProjects[0]).toBe(originalFirst);
    });
  });

  describe("sortProjectsByFeatured", () => {
    it("should place featured projects first", () => {
      const result = sortProjectsByFeatured(sampleProjects);
      const firstFeaturedIndex = result.findIndex(
        (project) => project.featured
      );
      const firstNonFeaturedIndex = result.findIndex(
        (project) => !project.featured
      );

      if (firstFeaturedIndex !== -1 && firstNonFeaturedIndex !== -1) {
        expect(firstFeaturedIndex).toBeLessThan(firstNonFeaturedIndex);
      }
    });

    it("should sort by date within featured and non-featured groups", () => {
      const result = sortProjectsByFeatured(sampleProjects);
      const featuredProjects = result.filter((project) => project.featured);
      const nonFeaturedProjects = result.filter((project) => !project.featured);

      // Check featured projects are sorted by date
      for (let i = 0; i < featuredProjects.length - 1; i++) {
        const currentDate = new Date(featuredProjects[i].completedAt).getTime();
        const nextDate = new Date(
          featuredProjects[i + 1].completedAt
        ).getTime();
        expect(currentDate).toBeGreaterThanOrEqual(nextDate);
      }

      // Check non-featured projects are sorted by date
      for (let i = 0; i < nonFeaturedProjects.length - 1; i++) {
        const currentDate = new Date(
          nonFeaturedProjects[i].completedAt
        ).getTime();
        const nextDate = new Date(
          nonFeaturedProjects[i + 1].completedAt
        ).getTime();
        expect(currentDate).toBeGreaterThanOrEqual(nextDate);
      }
    });
  });

  describe("getFeaturedProjects", () => {
    it("should return only featured projects", () => {
      const result = getFeaturedProjects(sampleProjects);
      expect(result.every((project) => project.featured)).toBe(true);
    });

    it("should return empty array if no featured projects", () => {
      const nonFeaturedProjects = sampleProjects.map((project) => ({
        ...project,
        featured: false,
      }));
      const result = getFeaturedProjects(nonFeaturedProjects);
      expect(result).toEqual([]);
    });
  });

  describe("getProjectBySlug", () => {
    it("returns project by id slug", () => {
      expect(getProjectBySlug("portfolio-website")?.title).toContain(
        "Portfolio"
      );
    });

    it("returns undefined for unknown slug", () => {
      expect(getProjectBySlug("unknown-slug-xyz")).toBeUndefined();
    });
  });

  describe("getAllProjectSlugs", () => {
    it("returns all project ids", () => {
      expect(getAllProjectSlugs()).toEqual(sampleProjects.map((p) => p.id));
    });
  });
});

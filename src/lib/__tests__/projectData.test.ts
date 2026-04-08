import {
  sampleProjects,
  filterProjectsByCategory,
  filterProjectsByTechnology,
  searchProjects,
  sortProjectsByDate,
  sortProjectsByFeatured,
  getFeaturedProjects,
  getProjectCategoryCounts,
  getAllTechnologies,
  getProjectsByTechnology,
  getRecentProjects,
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

  describe("filterProjectsByTechnology", () => {
    it("should filter projects by technology (case insensitive)", () => {
      const result = filterProjectsByTechnology(sampleProjects, "python");
      expect(
        result.every((project) =>
          project.technologies.some((tech) =>
            tech.toLowerCase().includes("python")
          )
        )
      ).toBe(true);
    });

    it("should filter projects by Next.js technology", () => {
      const result = filterProjectsByTechnology(sampleProjects, "Next.js");
      expect(
        result.every((project) => project.technologies.includes("Next.js"))
      ).toBe(true);
    });

    it("should return empty array when no projects match technology", () => {
      const result = filterProjectsByTechnology(
        sampleProjects,
        "nonexistent-tech"
      );
      expect(result).toEqual([]);
    });
  });

  describe("searchProjects", () => {
    it("should search projects by title", () => {
      const result = searchProjects(sampleProjects, "Diving");
      expect(
        result.some((project) =>
          project.title.toLowerCase().includes("diving")
        )
      ).toBe(true);
    });

    it("should search projects by description", () => {
      const result = searchProjects(sampleProjects, "maritime");
      expect(
        result.some((project) =>
          project.description.toLowerCase().includes("maritime")
        )
      ).toBe(true);
    });

    it("should search projects by technology", () => {
      const result = searchProjects(sampleProjects, "typescript");
      expect(
        result.some((project) =>
          project.technologies.some((tech) =>
            tech.toLowerCase().includes("typescript")
          )
        )
      ).toBe(true);
    });

    it("should be case insensitive", () => {
      const result = searchProjects(sampleProjects, "FLUTTER");
      expect(result.length).toBeGreaterThan(0);
    });

    it("should return empty array when no matches found", () => {
      const result = searchProjects(sampleProjects, "xyz123nonexistent");
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

  describe("getProjectCategoryCounts", () => {
    it("should return correct counts for each category", () => {
      const result = getProjectCategoryCounts(sampleProjects);

      expect(result.all).toBe(sampleProjects.length);
      expect(result.web).toBe(
        sampleProjects.filter((p) => p.category === "web").length
      );
      expect(result.mobile).toBe(
        sampleProjects.filter((p) => p.category === "mobile").length
      );
      expect(result.desktop).toBe(
        sampleProjects.filter((p) => p.category === "desktop").length
      );
      expect(result.other).toBe(
        sampleProjects.filter((p) => p.category === "other").length
      );
    });

    it("should handle empty project array", () => {
      const result = getProjectCategoryCounts([]);
      expect(result.all).toBe(0);
      expect(result.web).toBe(0);
      expect(result.mobile).toBe(0);
      expect(result.desktop).toBe(0);
      expect(result.other).toBe(0);
    });
  });

  describe("getAllTechnologies", () => {
    it("should return unique technologies sorted alphabetically", () => {
      const result = getAllTechnologies(sampleProjects);

      // Check uniqueness
      const uniqueResult = [...new Set(result)];
      expect(result.length).toBe(uniqueResult.length);

      // Check sorting
      const sortedResult = [...result].sort();
      expect(result).toEqual(sortedResult);
    });

    it("should handle empty project array", () => {
      const result = getAllTechnologies([]);
      expect(result).toEqual([]);
    });
  });

  describe("getProjectsByTechnology", () => {
    it("should return projects that use specific technology", () => {
      const result = getProjectsByTechnology(sampleProjects, "Flutter");
      expect(
        result.every((project) => project.technologies.includes("Flutter"))
      ).toBe(true);
    });

    it("should be case sensitive", () => {
      const result = getProjectsByTechnology(sampleProjects, "react");
      expect(result.length).toBe(0); // Should be 0 because it's case sensitive
    });

    it("should return empty array for non-existent technology", () => {
      const result = getProjectsByTechnology(sampleProjects, "NonExistentTech");
      expect(result).toEqual([]);
    });
  });

  describe("getRecentProjects", () => {
    it("should return projects from last 6 months by default", () => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const result = getRecentProjects(sampleProjects);
      expect(
        result.every((project) => new Date(project.completedAt) >= sixMonthsAgo)
      ).toBe(true);
    });

    it("should return projects from specified number of months", () => {
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const result = getRecentProjects(sampleProjects, 12);
      expect(
        result.every(
          (project) => new Date(project.completedAt) >= twelveMonthsAgo
        )
      ).toBe(true);
    });

    it("should handle edge case with 0 months", () => {
      const result = getRecentProjects(sampleProjects, 0);
      const now = new Date();
      expect(
        result.every((project) => new Date(project.completedAt) >= now)
      ).toBe(true);
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

import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AboutSection from "../AboutSection";

describe("AboutSection - Responsive Behavior", () => {
  describe("Mobile Layout (< 768px)", () => {
    it("should render Photo Element with correct mobile size classes", () => {
      render(<AboutSection />);

      const photoContainer = screen.getByAltText(
        "Professional Photo Placeholder"
      ).parentElement?.parentElement;
      expect(photoContainer).toBeInTheDocument();
      expect(photoContainer).toHaveClass("w-52");
      expect(photoContainer).toHaveClass("sm:w-60");
    });

    it("should center Photo Element on mobile", () => {
      render(<AboutSection />);

      const photoContainer = screen.getByAltText(
        "Professional Photo Placeholder"
      ).parentElement?.parentElement;
      expect(photoContainer).toHaveClass("mx-auto");
    });

    it("should use vertical stacking layout on mobile", () => {
      render(<AboutSection />);

      // Find the main content wrapper
      const photoContainer = screen.getByAltText(
        "Professional Photo Placeholder"
      ).parentElement?.parentElement;
      const contentWrapper = photoContainer?.parentElement;

      expect(contentWrapper).toHaveClass("flex");
      expect(contentWrapper).toHaveClass("flex-col");
    });

    it("should have correct spacing between elements (gap-8)", () => {
      render(<AboutSection />);

      const photoContainer = screen.getByAltText(
        "Professional Photo Placeholder"
      ).parentElement?.parentElement;
      const contentWrapper = photoContainer?.parentElement;

      expect(contentWrapper).toHaveClass("gap-8");
    });

    it("should center-align items on mobile", () => {
      render(<AboutSection />);

      const photoContainer = screen.getByAltText(
        "Professional Photo Placeholder"
      ).parentElement?.parentElement;
      const contentWrapper = photoContainer?.parentElement;

      expect(contentWrapper).toHaveClass("items-center");
    });
  });

  describe("Desktop Layout (≥ 768px)", () => {
    it("should render Photo Element with correct desktop size class", () => {
      render(<AboutSection />);

      const photoContainer = screen.getByAltText(
        "Professional Photo Placeholder"
      ).parentElement?.parentElement;
      expect(photoContainer).toHaveClass("md:w-80");
    });

    it("should use horizontal layout on desktop", () => {
      render(<AboutSection />);

      const photoContainer = screen.getByAltText(
        "Professional Photo Placeholder"
      ).parentElement?.parentElement;
      const contentWrapper = photoContainer?.parentElement;

      expect(contentWrapper).toHaveClass("md:flex-row");
    });

    it("should have correct spacing on desktop (gap-12)", () => {
      render(<AboutSection />);

      const photoContainer = screen.getByAltText(
        "Professional Photo Placeholder"
      ).parentElement?.parentElement;
      const contentWrapper = photoContainer?.parentElement;

      expect(contentWrapper).toHaveClass("md:gap-12");
    });

    it("should align items to start on desktop", () => {
      render(<AboutSection />);

      const photoContainer = screen.getByAltText(
        "Professional Photo Placeholder"
      ).parentElement?.parentElement;
      const contentWrapper = photoContainer?.parentElement;

      expect(contentWrapper).toHaveClass("md:items-start");
    });

    it("should left-align Photo Element on desktop", () => {
      render(<AboutSection />);

      const photoContainer = screen.getByAltText(
        "Professional Photo Placeholder"
      ).parentElement?.parentElement;
      expect(photoContainer).toHaveClass("md:mx-0");
    });

    it("should prevent Photo Element from shrinking", () => {
      render(<AboutSection />);

      const photoContainer = screen.getByAltText(
        "Professional Photo Placeholder"
      ).parentElement?.parentElement;
      expect(photoContainer).toHaveClass("flex-shrink-0");
    });

    it("should constrain Professional Summary text width for readability", () => {
      render(<AboutSection />);

      // Find the professional summary container
      const summaryContainer = screen.getByText(
        /Hey there! I'm the kind of developer/
      ).parentElement?.parentElement;
      expect(summaryContainer).toHaveClass("max-w-prose");
    });
  });

  describe("Layout Structure", () => {
    it("should render Photo Element and Professional Summary as siblings", () => {
      render(<AboutSection />);

      const photoContainer = screen.getByAltText(
        "Professional Photo Placeholder"
      ).parentElement?.parentElement;
      const summaryContainer = screen.getByText(
        /Hey there! I'm the kind of developer/
      ).parentElement?.parentElement;

      // Both should have the same parent
      expect(photoContainer?.parentElement).toBe(
        summaryContainer?.parentElement
      );
    });

    it("should maintain decorative elements on Photo", () => {
      render(<AboutSection />);

      const photoContainer = screen.getByAltText(
        "Professional Photo Placeholder"
      ).parentElement?.parentElement;

      // Check for decorative dots (they should be absolute positioned divs)
      const decorativeElements = photoContainer?.querySelectorAll(".absolute");
      expect(decorativeElements?.length).toBeGreaterThan(0);
    });

    it("should preserve CTA buttons within Professional Summary", () => {
      render(<AboutSection />);

      const downloadButton = screen.getByText("Download CV");
      const contactButton = screen.getByText("Get In Touch");

      expect(downloadButton).toBeInTheDocument();
      expect(contactButton).toBeInTheDocument();

      // Both buttons should be in the same container
      expect(downloadButton.parentElement).toBe(contactButton.parentElement);
    });
  });

  describe("Content Verification", () => {
    it("should render all professional summary paragraphs", () => {
      render(<AboutSection />);

      expect(
        screen.getByText(/Hey there! I'm the kind of developer/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Currently, I'm making waves in the maritime industry/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/When I'm not wrestling with/)
      ).toBeInTheDocument();
    });

    it("should render section title", () => {
      render(<AboutSection />);

      expect(screen.getByText("About Me")).toBeInTheDocument();
    });

    it("should render What I Bring section", () => {
      render(<AboutSection />);

      expect(screen.getByText("What I Bring to the Table")).toBeInTheDocument();
    });
  });
});

describe("AboutSection - Animations and Interactions", () => {
  // Mock IntersectionObserver
  let mockIntersectionObserver: jest.Mock;
  let observeCallback: IntersectionObserverCallback;

  beforeEach(() => {
    mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockImplementation((callback) => {
      observeCallback = callback;
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    });
    window.IntersectionObserver =
      mockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("IntersectionObserver Animations", () => {
    it("should initialize with opacity-0 and translate-y-8 classes before intersection", () => {
      render(<AboutSection />);

      // Section header should start hidden
      const sectionHeader = screen.getByText("About Me").parentElement;
      expect(sectionHeader).toHaveClass("opacity-0");
      expect(sectionHeader).toHaveClass("translate-y-8");

      // Main content should start hidden
      const photoContainer = screen.getByAltText(
        "Professional Photo Placeholder"
      ).parentElement?.parentElement;
      const contentWrapper = photoContainer?.parentElement;
      expect(contentWrapper).toHaveClass("opacity-0");
      expect(contentWrapper).toHaveClass("translate-y-8");
    });

    it("should trigger fade-in animations when section enters viewport", () => {
      render(<AboutSection />);

      // Simulate intersection
      const mockEntry = {
        isIntersecting: true,
        target: document.querySelector("#about"),
      } as IntersectionObserverEntry;

      act(() => {
        observeCallback([mockEntry], {} as IntersectionObserver);
      });

      // After intersection, elements should have visible classes
      const sectionHeader = screen.getByText("About Me").parentElement;
      expect(sectionHeader).toHaveClass("opacity-100");
      expect(sectionHeader).toHaveClass("translate-y-0");
    });

    it("should have properly staggered animation delays", () => {
      render(<AboutSection />);

      // Section header - no delay
      const sectionHeader = screen.getByText("About Me").parentElement;
      expect(sectionHeader?.className).not.toContain("delay-");

      // Main content - delay-200
      const photoContainer = screen.getByAltText(
        "Professional Photo Placeholder"
      ).parentElement?.parentElement;
      const contentWrapper = photoContainer?.parentElement;
      expect(contentWrapper).toHaveClass("delay-200");

      // What I Bring header - delay-600
      const whatIBringHeader = screen.getByText(
        "What I Bring to the Table"
      ).parentElement;
      expect(whatIBringHeader).toHaveClass("delay-600");

      // Value propositions - delay-700
      const valuePropsContainer = screen.getByText("Full-Stack Expertise")
        .parentElement?.parentElement;
      expect(valuePropsContainer).toHaveClass("delay-700");
    });

    it("should have smooth opacity and translate-y transitions", () => {
      render(<AboutSection />);

      // Check transition classes
      const sectionHeader = screen.getByText("About Me").parentElement;
      expect(sectionHeader).toHaveClass("transition-all");
      expect(sectionHeader).toHaveClass("duration-1000");

      const photoContainer = screen.getByAltText(
        "Professional Photo Placeholder"
      ).parentElement?.parentElement;
      const contentWrapper = photoContainer?.parentElement;
      expect(contentWrapper).toHaveClass("transition-all");
      expect(contentWrapper).toHaveClass("duration-1000");
    });

    it("should observe the section element on mount", () => {
      render(<AboutSection />);

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        { threshold: 0.1 }
      );
    });

    it("should clean up IntersectionObserver on unmount", () => {
      const unobserveMock = jest.fn();
      mockIntersectionObserver.mockImplementation((callback) => {
        observeCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: unobserveMock,
          disconnect: jest.fn(),
        };
      });

      const { unmount } = render(<AboutSection />);
      unmount();

      expect(unobserveMock).toHaveBeenCalled();
    });
  });

  describe("Interactive Elements", () => {
    it('should trigger download when "Download CV" button is clicked', () => {
      render(<AboutSection />);

      // Mock document methods for download functionality after render
      const mockAnchorElement = {
        href: "",
        download: "",
        click: jest.fn(),
      };
      const createElementSpy = jest
        .spyOn(document, "createElement")
        .mockReturnValueOnce(mockAnchorElement as unknown as HTMLElement);
      const appendChildSpy = jest
        .spyOn(document.body, "appendChild")
        .mockImplementationOnce(() => mockAnchorElement as unknown as Node);
      const removeChildSpy = jest
        .spyOn(document.body, "removeChild")
        .mockImplementationOnce(() => mockAnchorElement as unknown as Node);

      const downloadButton = screen.getByText("Download CV");
      fireEvent.click(downloadButton);

      expect(createElementSpy).toHaveBeenCalledWith("a");
      expect(mockAnchorElement.href).toBe("/resume.pdf");
      expect(mockAnchorElement.download).toBe("Cheah_Jing_Feng_Resume.pdf");
      expect(mockAnchorElement.click).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('should navigate to contact section when "Get In Touch" button is clicked', () => {
      render(<AboutSection />);

      const contactButton = screen.getByText("Get In Touch");
      expect(contactButton).toHaveAttribute("href", "#contact");
    });

    it('should have hover states on "Download CV" button', () => {
      render(<AboutSection />);

      const downloadButton = screen.getByText("Download CV");
      expect(downloadButton).toHaveClass("hover:from-amber-500");
      expect(downloadButton).toHaveClass("hover:to-orange-600");
      expect(downloadButton).toHaveClass("hover:shadow-xl");
      expect(downloadButton).toHaveClass("hover:-translate-y-1");
    });

    it('should have hover states on "Get In Touch" button', () => {
      render(<AboutSection />);

      const contactButton = screen.getByText("Get In Touch");
      expect(contactButton).toHaveClass("hover:bg-gray-900");
      expect(contactButton).toHaveClass("hover:text-white");
    });

    it("should have touch-optimized interactions on mobile devices", () => {
      render(<AboutSection />);

      const downloadButton = screen.getByText("Download CV");
      const contactButton = screen.getByText("Get In Touch");

      // Check for touch-manipulation class
      expect(downloadButton).toHaveClass("touch-manipulation");
      expect(contactButton).toHaveClass("touch-manipulation");

      // Check for active states
      expect(downloadButton).toHaveClass("active:scale-95");
      expect(contactButton).toHaveClass("active:scale-95");
    });

    it("should have proper transition durations for button interactions", () => {
      render(<AboutSection />);

      const downloadButton = screen.getByText("Download CV");
      const contactButton = screen.getByText("Get In Touch");

      expect(downloadButton).toHaveClass("transition-all");
      expect(downloadButton).toHaveClass("duration-300");
      expect(contactButton).toHaveClass("transition-all");
      expect(contactButton).toHaveClass("duration-300");
    });

    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      render(<AboutSection />);

      const downloadButton = screen.getByText("Download CV");
      const contactButton = screen.getByText("Get In Touch");

      // Tab to download button
      await user.tab();
      expect(downloadButton).toHaveFocus();

      // Tab to contact button
      await user.tab();
      expect(contactButton).toHaveFocus();
    });

    it("should trigger download on Enter key press", async () => {
      const user = userEvent.setup();
      render(<AboutSection />);

      // Mock document methods for download functionality after render
      const mockAnchorElement = {
        href: "",
        download: "",
        click: jest.fn(),
      };
      const createElementSpy = jest
        .spyOn(document, "createElement")
        .mockReturnValueOnce(mockAnchorElement as unknown as HTMLElement);
      const appendChildSpy = jest
        .spyOn(document.body, "appendChild")
        .mockImplementationOnce(() => mockAnchorElement as unknown as Node);
      const removeChildSpy = jest
        .spyOn(document.body, "removeChild")
        .mockImplementationOnce(() => mockAnchorElement as unknown as Node);

      const downloadButton = screen.getByText("Download CV");
      downloadButton.focus();
      await user.keyboard("{Enter}");

      expect(createElementSpy).toHaveBeenCalledWith("a");
      expect(mockAnchorElement.click).toHaveBeenCalled();

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });
  });
});

describe("AboutSection - Accessibility and Semantic HTML", () => {
  describe("Image Alt Text", () => {
    it("should have descriptive alt text for the profile photo", () => {
      render(<AboutSection />);

      const profileImage = screen.getByAltText(
        "Professional Photo Placeholder"
      );
      expect(profileImage).toBeInTheDocument();
      expect(profileImage).toHaveAttribute(
        "alt",
        "Professional Photo Placeholder"
      );
    });

    it("should not have empty alt text", () => {
      render(<AboutSection />);

      const profileImage = screen.getByAltText(
        "Professional Photo Placeholder"
      );
      const altText = profileImage.getAttribute("alt");
      expect(altText).not.toBe("");
      expect(altText).toBeTruthy();
    });
  });

  describe("Heading Hierarchy", () => {
    it("should have proper h2 heading for main section title", () => {
      render(<AboutSection />);

      const mainHeading = screen.getByRole("heading", {
        level: 2,
        name: "About Me",
      });
      expect(mainHeading).toBeInTheDocument();
    });

    it("should have proper h3 heading for subsection", () => {
      render(<AboutSection />);

      const subHeading = screen.getByRole("heading", {
        level: 3,
        name: "What I Bring to the Table",
      });
      expect(subHeading).toBeInTheDocument();
    });

    it("should have proper h4 headings for value proposition cards", () => {
      render(<AboutSection />);

      const h4Headings = screen.getAllByRole("heading", { level: 4 });
      expect(h4Headings).toHaveLength(3);

      const headingTexts = h4Headings.map((h) => h.textContent);
      expect(headingTexts).toContain("Full-Stack Expertise");
      expect(headingTexts).toContain("Problem Solver");
      expect(headingTexts).toContain("Global Mindset");
    });

    it("should maintain proper heading hierarchy (h2 -> h3 -> h4)", () => {
      render(<AboutSection />);

      const h2 = screen.getByRole("heading", { level: 2 });
      const h3 = screen.getByRole("heading", { level: 3 });
      const h4s = screen.getAllByRole("heading", { level: 4 });

      // Verify no h1 (should be in page header)
      const h1s = screen.queryAllByRole("heading", { level: 1 });
      expect(h1s).toHaveLength(0);

      // Verify hierarchy exists
      expect(h2).toBeInTheDocument();
      expect(h3).toBeInTheDocument();
      expect(h4s.length).toBeGreaterThan(0);
    });
  });

  describe("Keyboard Navigation", () => {
    it("should allow keyboard navigation to Download CV button", async () => {
      const user = userEvent.setup();
      render(<AboutSection />);

      const downloadButton = screen.getByRole("button", {
        name: "Download CV",
      });

      // Tab to the button
      await user.tab();
      expect(downloadButton).toHaveFocus();
    });

    it("should allow keyboard navigation to Get In Touch link", async () => {
      const user = userEvent.setup();
      render(<AboutSection />);

      const downloadButton = screen.getByRole("button", {
        name: "Download CV",
      });
      const contactLink = screen.getByRole("link", { name: "Get In Touch" });

      // Tab to download button first
      await user.tab();
      expect(downloadButton).toHaveFocus();

      // Tab to contact link
      await user.tab();
      expect(contactLink).toHaveFocus();
    });

    it("should activate Download CV button with Enter key", async () => {
      const user = userEvent.setup();
      render(<AboutSection />);

      const mockAnchorElement = {
        href: "",
        download: "",
        click: jest.fn(),
      };
      jest
        .spyOn(document, "createElement")
        .mockReturnValueOnce(mockAnchorElement as unknown as HTMLElement);
      jest
        .spyOn(document.body, "appendChild")
        .mockImplementationOnce(() => mockAnchorElement as unknown as Node);
      jest
        .spyOn(document.body, "removeChild")
        .mockImplementationOnce(() => mockAnchorElement as unknown as Node);

      const downloadButton = screen.getByRole("button", {
        name: "Download CV",
      });
      downloadButton.focus();

      await user.keyboard("{Enter}");
      expect(mockAnchorElement.click).toHaveBeenCalled();
    });

    it("should activate Download CV button with Space key", async () => {
      const user = userEvent.setup();
      render(<AboutSection />);

      const mockAnchorElement = {
        href: "",
        download: "",
        click: jest.fn(),
      };
      jest
        .spyOn(document, "createElement")
        .mockReturnValueOnce(mockAnchorElement as unknown as HTMLElement);
      jest
        .spyOn(document.body, "appendChild")
        .mockImplementationOnce(() => mockAnchorElement as unknown as Node);
      jest
        .spyOn(document.body, "removeChild")
        .mockImplementationOnce(() => mockAnchorElement as unknown as Node);

      const downloadButton = screen.getByRole("button", {
        name: "Download CV",
      });
      downloadButton.focus();

      await user.keyboard(" ");
      expect(mockAnchorElement.click).toHaveBeenCalled();
    });

    it("should have proper tab order for interactive elements", async () => {
      const user = userEvent.setup();
      render(<AboutSection />);

      const downloadButton = screen.getByRole("button", {
        name: "Download CV",
      });
      const contactLink = screen.getByRole("link", { name: "Get In Touch" });

      // Start tabbing
      await user.tab();
      expect(downloadButton).toHaveFocus();

      await user.tab();
      expect(contactLink).toHaveFocus();
    });
  });

  describe("Color Contrast", () => {
    it("should use high contrast colors for text on white background", () => {
      render(<AboutSection />);

      // Main heading should be dark gray on white
      const mainHeading = screen.getByRole("heading", {
        level: 2,
        name: "About Me",
      });
      expect(mainHeading).toHaveClass("text-gray-900");

      // Body text should be gray-700 on white (meets WCAG AA)
      const bodyText = screen.getByText(/Hey there! I'm the kind of developer/);
      expect(bodyText).toHaveClass("text-gray-700");
    });

    it("should use sufficient contrast for button text", () => {
      render(<AboutSection />);

      // Download CV button - white text on gradient background
      const downloadButton = screen.getByRole("button", {
        name: "Download CV",
      });
      expect(downloadButton).toHaveClass("text-white");
      expect(downloadButton).toHaveClass("from-amber-400");
      expect(downloadButton).toHaveClass("to-orange-500");

      // Get In Touch button - dark text on white, then white on dark on hover
      const contactLink = screen.getByRole("link", { name: "Get In Touch" });
      expect(contactLink).toHaveClass("text-gray-900");
      expect(contactLink).toHaveClass("border-gray-900");
    });

    it("should maintain contrast in value proposition cards", () => {
      render(<AboutSection />);

      const cards = screen.getAllByRole("heading", { level: 4 });

      cards.forEach((card) => {
        // Card headings should be dark gray
        expect(card).toHaveClass("text-gray-900");

        // Card container should have light gray background
        const cardContainer = card.parentElement;
        expect(cardContainer).toHaveClass("bg-gray-50");
      });
    });
  });

  describe("Semantic HTML", () => {
    it("should use semantic section element", () => {
      const { container } = render(<AboutSection />);

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute("id", "about");
    });

    it("should use button element for Download CV action", () => {
      render(<AboutSection />);

      const downloadButton = screen.getByRole("button", {
        name: "Download CV",
      });
      expect(downloadButton.tagName).toBe("BUTTON");
    });

    it("should use anchor element for Get In Touch navigation", () => {
      render(<AboutSection />);

      const contactLink = screen.getByRole("link", { name: "Get In Touch" });
      expect(contactLink.tagName).toBe("A");
      expect(contactLink).toHaveAttribute("href", "#contact");
    });

    it("should use proper paragraph elements for text content", () => {
      const { container } = render(<AboutSection />);

      const paragraphs = container.querySelectorAll("p");
      expect(paragraphs.length).toBeGreaterThan(0);

      // Check that professional summary paragraphs exist
      const summaryParagraphs = Array.from(paragraphs).filter(
        (p) =>
          p.textContent?.includes("Hey there!") ||
          p.textContent?.includes("Currently, I'm making waves") ||
          p.textContent?.includes("When I'm not wrestling")
      );
      expect(summaryParagraphs.length).toBe(3);
    });

    it("should use semantic heading elements (not styled divs)", () => {
      render(<AboutSection />);

      // All headings should be actual heading elements
      const h2 = screen.getByRole("heading", { level: 2 });
      expect(h2.tagName).toBe("H2");

      const h3 = screen.getByRole("heading", { level: 3 });
      expect(h3.tagName).toBe("H3");

      const h4s = screen.getAllByRole("heading", { level: 4 });
      h4s.forEach((h4) => {
        expect(h4.tagName).toBe("H4");
      });
    });
  });

  describe("ARIA and Accessibility Attributes", () => {
    it("should have proper section landmark with id for navigation", () => {
      const { container } = render(<AboutSection />);

      const section = container.querySelector("section#about");
      expect(section).toBeInTheDocument();
    });

    it("should have accessible button with proper role", () => {
      render(<AboutSection />);

      const downloadButton = screen.getByRole("button", {
        name: "Download CV",
      });
      expect(downloadButton).toBeInTheDocument();
    });

    it("should have accessible link with proper role and href", () => {
      render(<AboutSection />);

      const contactLink = screen.getByRole("link", { name: "Get In Touch" });
      expect(contactLink).toBeInTheDocument();
      expect(contactLink).toHaveAttribute("href", "#contact");
    });

    it("should have image with proper alt attribute", () => {
      render(<AboutSection />);

      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("alt");
      expect(image.getAttribute("alt")).not.toBe("");
    });

    it("should not have any elements with empty alt text", () => {
      const { container } = render(<AboutSection />);

      const imagesWithAlt = container.querySelectorAll("img[alt]");
      imagesWithAlt.forEach((img) => {
        const altText = img.getAttribute("alt");
        expect(altText).not.toBe("");
      });
    });
  });

  describe("Focus Management", () => {
    it("should have visible focus indicators on interactive elements", () => {
      render(<AboutSection />);

      const downloadButton = screen.getByRole("button", {
        name: "Download CV",
      });
      const contactLink = screen.getByRole("link", { name: "Get In Touch" });

      // Buttons should be focusable
      expect(downloadButton).not.toHaveAttribute("tabindex", "-1");
      expect(contactLink).not.toHaveAttribute("tabindex", "-1");
    });

    it("should not have any elements with tabindex greater than 0", () => {
      const { container } = render(<AboutSection />);

      const elementsWithTabindex = container.querySelectorAll("[tabindex]");
      elementsWithTabindex.forEach((element) => {
        const tabindex = parseInt(element.getAttribute("tabindex") || "0");
        expect(tabindex).toBeLessThanOrEqual(0);
      });
    });

    it("should maintain focus visibility during keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<AboutSection />);

      const downloadButton = screen.getByRole("button", {
        name: "Download CV",
      });

      await user.tab();
      expect(downloadButton).toHaveFocus();
      expect(document.activeElement).toBe(downloadButton);
    });
  });

  describe("Screen Reader Compatibility", () => {
    it("should have descriptive text content for all interactive elements", () => {
      render(<AboutSection />);

      const downloadButton = screen.getByRole("button", {
        name: "Download CV",
      });
      expect(downloadButton.textContent).toBe("Download CV");

      const contactLink = screen.getByRole("link", { name: "Get In Touch" });
      expect(contactLink.textContent).toBe("Get In Touch");
    });

    it("should have meaningful heading text", () => {
      render(<AboutSection />);

      const mainHeading = screen.getByRole("heading", { level: 2 });
      expect(mainHeading.textContent).toBe("About Me");

      const subHeading = screen.getByRole("heading", { level: 3 });
      expect(subHeading.textContent).toBe("What I Bring to the Table");
    });

    it("should not have any decorative images without proper alt handling", () => {
      const { container } = render(<AboutSection />);

      // All images should have alt text (even if empty for decorative)
      const images = container.querySelectorAll("img");
      images.forEach((img) => {
        expect(img).toHaveAttribute("alt");
      });
    });

    it("should have proper text hierarchy for screen readers", () => {
      render(<AboutSection />);

      // Verify content can be accessed by role
      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
      expect(screen.getAllByRole("heading", { level: 4 }).length).toBe(3);
      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByRole("link")).toBeInTheDocument();
    });
  });

  describe("Touch and Mobile Accessibility", () => {
    it("should have touch-optimized button sizes", () => {
      render(<AboutSection />);

      const downloadButton = screen.getByRole("button", {
        name: "Download CV",
      });
      const contactLink = screen.getByRole("link", { name: "Get In Touch" });

      // Buttons should have adequate padding for touch targets (minimum 44x44px)
      expect(downloadButton).toHaveClass("py-3");
      expect(downloadButton).toHaveClass("px-6");
      expect(contactLink).toHaveClass("py-3");
      expect(contactLink).toHaveClass("px-6");
    });

    it("should have touch-manipulation CSS for better mobile interaction", () => {
      render(<AboutSection />);

      const downloadButton = screen.getByRole("button", {
        name: "Download CV",
      });
      const contactLink = screen.getByRole("link", { name: "Get In Touch" });

      expect(downloadButton).toHaveClass("touch-manipulation");
      expect(contactLink).toHaveClass("touch-manipulation");
    });

    it("should have appropriate spacing between interactive elements", () => {
      render(<AboutSection />);

      const downloadButton = screen.getByRole("button", {
        name: "Download CV",
      });
      const buttonContainer = downloadButton.parentElement;

      // Container should have gap between buttons
      expect(buttonContainer).toHaveClass("gap-3");
      expect(buttonContainer).toHaveClass("sm:gap-4");
    });
  });
});

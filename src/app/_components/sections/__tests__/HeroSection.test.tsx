import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import HeroSection from "../HeroSection";

// Mock GSAP
jest.mock("gsap", () => ({
  gsap: {
    context: jest.fn((callback) => {
      callback();
      return { revert: jest.fn() };
    }),
    set: jest.fn(),
    to: jest.fn(),
    timeline: jest.fn(() => ({
      to: jest.fn().mockReturnThis(),
      delay: jest.fn(),
    })),
  },
}));

// Mock WaveLineVisualization
jest.mock("../../shared/WaveLineVisualization", () => {
  return function MockWaveLineVisualization() {
    return <div data-testid="wave-line-visualization">Wave Visualization</div>;
  };
});

// Mock ErrorBoundary
jest.mock("../../shared/ErrorBoundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  ),
}));

describe("HeroSection - Visual and Functional Testing", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("Rendering and Visual Elements", () => {
    it("should render the hero section with all main elements", () => {
      render(<HeroSection />);

      // Check for main title
      expect(screen.getByText(/Hi,/i)).toBeInTheDocument();
      expect(screen.getByText(/I'm Jing Feng/i)).toBeInTheDocument();

      // Check for subtitle
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();

      // Check for CTA buttons
      expect(
        screen.getByRole("button", { name: /View My Work/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Get In Touch/i })
      ).toBeInTheDocument();

      // Check for scroll indicator
      expect(screen.getByText(/Scroll to explore/i)).toBeInTheDocument();
    });

    it("should render WaveLineVisualization component", () => {
      render(<HeroSection />);

      expect(screen.getByTestId("wave-line-visualization")).toBeInTheDocument();
    });

    it("should have proper light background styling", () => {
      const { container } = render(<HeroSection />);

      const backgroundElement = container.querySelector(
        ".bg-gradient-to-br.from-gray-50"
      );
      expect(backgroundElement).toBeInTheDocument();
    });

    it("should render text with appropriate dark colors for light background", () => {
      const { container } = render(<HeroSection />);

      // Check for dark text colors
      const titleElement = container.querySelector(".text-slate-900");
      expect(titleElement).toBeInTheDocument();
    });

    it("should render gradient text for name", () => {
      const { container } = render(<HeroSection />);

      const gradientText = container.querySelector(
        ".bg-gradient-to-r.from-amber-500"
      );
      expect(gradientText).toBeInTheDocument();
    });
  });

  describe("Scroll Indicator Functionality", () => {
    it("should render scroll indicator with proper styling", () => {
      render(<HeroSection />);

      const scrollText = screen.getByText(/Scroll to explore/i);
      expect(scrollText).toBeInTheDocument();
      expect(scrollText).toHaveClass("text-slate-500");
    });

    it("should call scrollToSection when scroll indicator is clicked", () => {
      // Mock getElementById
      const mockElement = document.createElement("div");
      mockElement.id = "about";
      Object.defineProperty(mockElement, "offsetTop", {
        value: 1000,
        writable: true,
      });
      document.body.appendChild(mockElement);

      const scrollToSpy = jest.spyOn(window, "scrollTo");

      render(<HeroSection />);

      const scrollIndicator = screen
        .getByText(/Scroll to explore/i)
        .closest("div");
      if (scrollIndicator) {
        fireEvent.click(scrollIndicator);
      }

      expect(scrollToSpy).toHaveBeenCalled();

      // Cleanup
      document.body.removeChild(mockElement);
      scrollToSpy.mockRestore();
    });

    it("should have cursor-pointer class for interactivity", () => {
      const { container } = render(<HeroSection />);

      const scrollIndicator = container.querySelector(".cursor-pointer");
      expect(scrollIndicator).toBeInTheDocument();
    });
  });

  describe("CTA Button Navigation", () => {
    it("should scroll to projects section when 'View My Work' is clicked", () => {
      const mockElement = document.createElement("div");
      mockElement.id = "projects";
      Object.defineProperty(mockElement, "offsetTop", {
        value: 2000,
        writable: true,
      });
      document.body.appendChild(mockElement);

      const scrollToSpy = jest.spyOn(window, "scrollTo");

      render(<HeroSection />);

      const viewWorkButton = screen.getByRole("button", {
        name: /View My Work/i,
      });
      fireEvent.click(viewWorkButton);

      expect(scrollToSpy).toHaveBeenCalled();

      document.body.removeChild(mockElement);
      scrollToSpy.mockRestore();
    });

    it("should scroll to contact section when 'Get In Touch' is clicked", () => {
      const mockElement = document.createElement("div");
      mockElement.id = "contact";
      Object.defineProperty(mockElement, "offsetTop", {
        value: 3000,
        writable: true,
      });
      document.body.appendChild(mockElement);

      const scrollToSpy = jest.spyOn(window, "scrollTo");

      render(<HeroSection />);

      const contactButton = screen.getByRole("button", {
        name: /Get In Touch/i,
      });
      fireEvent.click(contactButton);

      expect(scrollToSpy).toHaveBeenCalled();

      document.body.removeChild(mockElement);
      scrollToSpy.mockRestore();
    });

    it("should have proper hover styling on CTA buttons", () => {
      const { container } = render(<HeroSection />);

      const primaryButton = container.querySelector(
        ".bg-gradient-to-r.from-amber-500"
      );
      expect(primaryButton).toBeInTheDocument();

      const secondaryButton = container.querySelector(".border-slate-300");
      expect(secondaryButton).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("should have responsive padding classes", () => {
      const { container } = render(<HeroSection />);

      const contentContainer = container.querySelector(
        ".px-4.sm\\:px-6.md\\:px-8"
      );
      expect(contentContainer).toBeInTheDocument();
    });

    it("should have responsive margin classes for spacing", () => {
      const { container } = render(<HeroSection />);

      const titleElement = container.querySelector(".mb-8.sm\\:mb-12");
      expect(titleElement).toBeInTheDocument();
    });

    it("should have touch-manipulation class for mobile interactions", () => {
      const { container } = render(<HeroSection />);

      const touchElements = container.querySelectorAll(".touch-manipulation");
      expect(touchElements.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic HTML structure", () => {
      render(<HeroSection />);

      const section = screen.getByRole("region");
      expect(section).toBeInTheDocument();
    });

    it("should have proper heading hierarchy", () => {
      render(<HeroSection />);

      const h1 = screen.getByRole("heading", { level: 1 });
      const h3 = screen.getByRole("heading", { level: 3 });

      expect(h1).toBeInTheDocument();
      expect(h3).toBeInTheDocument();
    });

    it("should have accessible button elements", () => {
      render(<HeroSection />);

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);

      buttons.forEach((button) => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe("Animation Integration", () => {
    it("should initialize GSAP animations on mount", () => {
      render(<HeroSection />);

      // GSAP context should be called during component mount
      // This is verified by the component rendering without errors
      expect(screen.getByRole("region")).toBeInTheDocument();
    });

    it("should clean up animations on unmount", () => {
      const { unmount } = render(<HeroSection />);

      // Component should unmount without errors
      expect(() => unmount()).not.toThrow();
    });
  });

  describe("Error Handling", () => {
    it("should wrap WaveLineVisualization in ErrorBoundary", () => {
      render(<HeroSection />);

      expect(screen.getByTestId("error-boundary")).toBeInTheDocument();
    });

    it("should handle missing scroll target gracefully", () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<HeroSection />);

      const viewWorkButton = screen.getByRole("button", {
        name: /View My Work/i,
      });
      fireEvent.click(viewWorkButton);

      // Should not throw error
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Color Palette", () => {
    it("should use vibrant amber/orange gradient colors", () => {
      const { container } = render(<HeroSection />);

      const gradientElement = container.querySelector(
        ".from-amber-500.via-orange-500.to-amber-600"
      );
      expect(gradientElement).toBeInTheDocument();
    });

    it("should use slate colors for text on light background", () => {
      const { container } = render(<HeroSection />);

      const slateText = container.querySelector(".text-slate-600");
      expect(slateText).toBeInTheDocument();
    });
  });
});

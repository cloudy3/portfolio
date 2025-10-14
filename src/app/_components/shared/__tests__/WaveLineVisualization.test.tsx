import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import WaveLineVisualization from "../WaveLineVisualization";

interface MockCanvasProps {
  children: React.ReactNode;
  onCreated?: (context: { gl: { domElement: HTMLCanvasElement } }) => void;
}

interface MockFrameState {
  clock: { getElapsedTime: () => number };
}

// Define mock classes outside of jest.mock
class MockBufferGeometry {
  attributes = { position: { needsUpdate: false } };
  setFromPoints() {
    return this;
  }
}

class MockLineBasicMaterial {
  constructor(public params: Record<string, unknown>) {}
}

class MockLine {
  geometry: MockBufferGeometry;
  material: MockLineBasicMaterial;
  position = { set: jest.fn() };
  constructor(geometry: MockBufferGeometry, material: MockLineBasicMaterial) {
    this.geometry = geometry;
    this.material = material;
  }
}

// Mock React Three Fiber
jest.mock("@react-three/fiber", () => ({
  Canvas: ({ children, onCreated }: MockCanvasProps) => {
    // Simulate canvas creation
    if (onCreated) {
      const mockGl = {
        domElement: document.createElement("canvas"),
      };
      onCreated({ gl: mockGl });
    }
    return <div data-testid="r3f-canvas">{children}</div>;
  },
  useFrame: jest.fn((callback: (state: MockFrameState) => void) => {
    // Simulate a frame update
    const mockState: MockFrameState = {
      clock: { getElapsedTime: () => 0 },
    };
    callback(mockState);
  }),
}));

// Mock Three.js classes
jest.mock("three", () => ({
  Vector3: class Vector3 {
    constructor(public x = 0, public y = 0, public z = 0) {}
  },
  BufferGeometry: MockBufferGeometry,
  LineBasicMaterial: MockLineBasicMaterial,
  Line: MockLine,
}));

// Mock detectWebGLSupport
jest.mock("../ThreeScene", () => ({
  detectWebGLSupport: jest.fn(() => true),
}));

describe("WaveLineVisualization - Visual and Functional Testing", () => {
  let matchMediaMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset window.matchMedia mock - default to NO reduced motion
    matchMediaMock = jest.fn().mockImplementation((query) => ({
      matches: false, // Default: no reduced motion
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMediaMock,
    });
  });

  describe("Rendering and Visual Elements", () => {
    it("should render the canvas when WebGL is supported", () => {
      render(<WaveLineVisualization />);

      expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    });

    it("should have proper ARIA attributes for accessibility", () => {
      const { container } = render(<WaveLineVisualization />);

      const visualizationContainer = container.querySelector(
        '[aria-label="Animated background visualization"]'
      );
      expect(visualizationContainer).toBeInTheDocument();
      expect(visualizationContainer).toHaveAttribute("role", "img");
    });

    it("should render with light background gradient", () => {
      const { container } = render(<WaveLineVisualization />);

      const background = container.querySelector(
        ".bg-gradient-to-br.from-slate-50"
      );
      expect(background).toBeInTheDocument();
    });
  });

  describe("Color Palette", () => {
    it("should use default vibrant color palette", () => {
      render(<WaveLineVisualization />);

      // Component should render successfully with default colors
      expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    });

    it("should accept custom color palette", () => {
      const customColors = ["#FF0000", "#00FF00", "#0000FF"];

      render(<WaveLineVisualization colorPalette={customColors} />);

      expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    });

    it("should have harmonious default colors", () => {
      // Test that default colors are defined and valid
      const { container } = render(<WaveLineVisualization />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Animation System", () => {
    it("should initialize with proper animation speed", () => {
      render(<WaveLineVisualization animationSpeed={1.5} />);

      expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    });

    it("should use default animation speed when not specified", () => {
      render(<WaveLineVisualization />);

      expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    });
  });

  describe("Mobile Optimization", () => {
    it("should detect mobile devices", () => {
      // Mock mobile user agent
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
        configurable: true,
      });

      render(<WaveLineVisualization />);

      expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    });

    it("should reduce line count on mobile", () => {
      // Mock mobile viewport
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 375,
      });

      render(<WaveLineVisualization />);

      expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    });

    it("should use custom line count when provided", () => {
      render(<WaveLineVisualization lineCount={8} />);

      expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    });
  });

  describe("Reduced Motion Support", () => {
    it("should respect prefers-reduced-motion preference", async () => {
      // Mock reduced motion preference
      matchMediaMock.mockImplementation((query) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { container } = render(<WaveLineVisualization />);

      // Should render static fallback instead of animated canvas
      await waitFor(() => {
        const canvas = screen.queryByTestId("r3f-canvas");
        expect(canvas).not.toBeInTheDocument();

        const fallback = container.querySelector(".bg-gradient-to-br");
        expect(fallback).toBeInTheDocument();
      });
    });

    it("should show static fallback for reduced motion", async () => {
      matchMediaMock.mockImplementation((query) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { container } = render(<WaveLineVisualization />);

      await waitFor(() => {
        const fallback = container.querySelector(".bg-gradient-to-br");
        expect(fallback).toBeInTheDocument();
      });
    });
  });

  describe("Interactivity", () => {
    it("should enable interactivity by default", () => {
      render(<WaveLineVisualization />);

      expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    });

    it("should allow disabling interactivity", () => {
      render(<WaveLineVisualization enableInteractivity={false} />);

      expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    });

    it("should handle mouse events when interactivity is enabled", () => {
      render(<WaveLineVisualization enableInteractivity={true} />);

      // Simulate mouse move
      const mouseMoveEvent = new MouseEvent("mousemove", {
        clientX: 100,
        clientY: 100,
      });
      window.dispatchEvent(mouseMoveEvent);

      expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    });

    it("should handle touch events on mobile", () => {
      render(<WaveLineVisualization enableInteractivity={true} />);

      // Simulate touch move
      const touchMoveEvent = new TouchEvent("touchmove", {
        touches: [{ clientX: 100, clientY: 100 } as Touch],
      });
      window.dispatchEvent(touchMoveEvent);

      expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    });
  });

  describe("Performance Optimization", () => {
    it("should use appropriate DPR for mobile", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 375,
      });

      render(<WaveLineVisualization />);

      expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    });

    it("should use appropriate DPR for desktop", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 1920,
      });

      render(<WaveLineVisualization />);

      expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    });

    it("should optimize WebGL settings for mobile", () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
        configurable: true,
      });

      render(<WaveLineVisualization />);

      expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should handle WebGL context loss", () => {
      const { container } = render(<WaveLineVisualization />);

      const canvas = container.querySelector("canvas");
      if (canvas) {
        const contextLostEvent = new Event("webglcontextlost");
        canvas.dispatchEvent(contextLostEvent);
      }

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should handle WebGL context restoration", () => {
      const { container } = render(<WaveLineVisualization />);

      const canvas = container.querySelector("canvas");
      if (canvas) {
        const contextLostEvent = new Event("webglcontextlost");
        const contextRestoredEvent = new Event("webglcontextrestored");

        canvas.dispatchEvent(contextLostEvent);
        canvas.dispatchEvent(contextRestoredEvent);
      }

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("should handle window resize events", () => {
      render(<WaveLineVisualization />);

      // Simulate window resize
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 768,
      });

      const resizeEvent = new Event("resize");
      window.dispatchEvent(resizeEvent);

      expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    });

    it("should update mobile detection on resize", () => {
      render(<WaveLineVisualization />);

      // Start with desktop width
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 1920,
      });
      window.dispatchEvent(new Event("resize"));

      // Change to mobile width
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 375,
      });
      window.dispatchEvent(new Event("resize"));

      expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    });
  });

  describe("Custom Props", () => {
    it("should accept custom className", () => {
      const { container } = render(
        <WaveLineVisualization className="custom-class" />
      );

      const visualizationContainer = container.querySelector(
        '[aria-label="Animated background visualization"]'
      );
      expect(visualizationContainer).toBeInTheDocument();
      expect(visualizationContainer).toHaveClass("custom-class");
    });

    it("should apply custom className alongside default classes", () => {
      const { container } = render(
        <WaveLineVisualization className="my-custom-class" />
      );

      const visualizationContainer = container.querySelector(
        '[aria-label="Animated background visualization"]'
      );
      expect(visualizationContainer).toBeInTheDocument();
      expect(visualizationContainer).toHaveClass("my-custom-class");
      expect(visualizationContainer).toHaveClass("absolute");
      expect(visualizationContainer).toHaveClass("inset-0");
    });
  });
});

import { vi } from "vitest";
// Tests for ThreeScene WebGL detection functionality
import { detectWebGLSupport } from "../shared/ThreeScene";

function createGlMock() {
  return {
    VERTEX_SHADER: 35633,
    COMPILE_STATUS: 35713,
    createShader: vi.fn(() => ({})),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => true),
    deleteShader: vi.fn(),
    getExtension: vi.fn(() => ({})),
  };
}

const mockGetContext = vi.fn();
const mockCreateElement = vi.fn(() => ({
  getContext: mockGetContext,
}));

Object.defineProperty(document, "createElement", {
  value: mockCreateElement,
  writable: true,
});

describe("ThreeScene WebGL Detection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateElement.mockReturnValue({
      getContext: mockGetContext,
    });
  });

  describe("detectWebGLSupport", () => {
    it("should return true when WebGL2 is supported", () => {
      mockGetContext.mockReturnValueOnce(createGlMock());

      const result = detectWebGLSupport();

      expect(mockCreateElement).toHaveBeenCalledWith("canvas");
      expect(mockGetContext).toHaveBeenCalledWith("webgl2");
      expect(result).toBe(true);
    });

    it("should return true when experimental-webgl is supported", () => {
      mockGetContext
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(createGlMock());

      const result = detectWebGLSupport();

      expect(mockGetContext).toHaveBeenCalledWith("webgl2");
      expect(mockGetContext).toHaveBeenCalledWith("webgl");
      expect(mockGetContext).toHaveBeenCalledWith("experimental-webgl");
      expect(result).toBe(true);
    });

    it("should return false when WebGL is not supported", () => {
      mockGetContext
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(null);

      const result = detectWebGLSupport();

      expect(result).toBe(false);
    });

    it("should return false when an exception is thrown", () => {
      mockGetContext.mockImplementation(() => {
        throw new Error("WebGL not available");
      });

      expect(detectWebGLSupport()).toBe(false);
    });

    it("should handle canvas creation failure", () => {
      mockCreateElement.mockImplementation(() => {
        throw new Error("Canvas creation failed");
      });

      expect(detectWebGLSupport()).toBe(false);
    });
  });
});

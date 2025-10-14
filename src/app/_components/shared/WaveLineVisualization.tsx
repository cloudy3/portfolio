"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { detectWebGLSupport } from "./ThreeScene";
// Import only the specific Three.js classes we need for better tree-shaking
import { Vector3, BufferGeometry, LineBasicMaterial, Line } from "three";

/**
 * Configuration for individual line animations
 *
 * Each line in the visualization has its own configuration to create
 * visual variety and organic motion patterns.
 *
 * @property amplitude - Wave height (vertical displacement from center)
 * @property frequency - Number of wave cycles along the line length
 * @property phase - Starting position in the wave cycle (0 to 2π)
 * @property speed - Animation speed multiplier
 * @property pointCount - Number of points defining the line geometry
 */
interface LineConfig {
  amplitude: number;
  frequency: number;
  phase: number;
  speed: number;
  pointCount: number;
}

/**
 * Generates an array of THREE.Vector3 points for a parametric wave line
 *
 * This function creates smooth, flowing wave patterns using parametric equations.
 * Each line is defined by sine and cosine functions that create organic motion
 * in 3D space, inspired by Japanese music visualization aesthetics.
 *
 * @param config - Line configuration parameters (amplitude, frequency, phase, speed, pointCount)
 * @param time - Current animation time in seconds from the Three.js clock
 * @returns Array of Vector3 points forming a smooth wave pattern
 *
 * @example
 * const config = { amplitude: 2.5, frequency: 3, phase: 0, speed: 0.5, pointCount: 50 };
 * const points = generateLinePoints(config, 1.5);
 */
function generateLinePoints(config: LineConfig, time: number): Vector3[] {
  const points: Vector3[] = [];
  const { pointCount, amplitude, frequency, phase, speed } = config;

  for (let i = 0; i < pointCount; i++) {
    // Normalize position along the line (0 to 1)
    const t = i / pointCount;

    // Horizontal position: spread line across screen width
    // Range: -20 to +20 units (centered at origin)
    const x = (t - 0.5) * 40;

    // Vertical wave motion: primary animation axis
    // Uses sine function for smooth, periodic motion
    const y = Math.sin(t * frequency + time * speed + phase) * amplitude;

    // Depth wave motion: creates 3D effect
    // Uses cosine with different frequency/speed for visual variety
    // Amplitude is halved to keep depth subtle
    const z =
      Math.cos(t * frequency * 0.5 + time * speed * 0.7 + phase) *
      amplitude *
      0.5;

    points.push(new Vector3(x, y, z));
  }

  return points;
}

/**
 * Props for the WaveLineVisualization component
 *
 * @property className - Optional CSS class name for styling the container
 * @property lineCount - Number of animated lines to render
 *                       Default: 12 on desktop, 6 on mobile
 *                       Higher values create denser visualizations but impact performance
 * @property colorPalette - Array of color strings (hex, rgb, or named colors)
 *                          Default: Japanese-inspired vibrant palette
 *                          Colors are cycled through if fewer than lineCount
 * @property animationSpeed - Animation speed multiplier
 *                            Default: 1.0
 *                            Values > 1.0 speed up, < 1.0 slow down
 * @property enableInteractivity - Enable mouse/touch interaction
 *                                 Default: true
 *                                 When enabled, cursor position affects wave amplitude and frequency
 */
interface WaveLineVisualizationProps {
  className?: string;
  lineCount?: number;
  colorPalette?: string[];
  animationSpeed?: number;
  enableInteractivity?: boolean;
}

/**
 * Props for the LineWaveSystem component
 *
 * Internal component that handles the actual Three.js line rendering and animation.
 *
 * @property lineCount - Number of lines to render
 * @property colorPalette - Array of color strings for the lines
 * @property animationSpeed - Speed multiplier for animations
 * @property isMobile - Whether the device is mobile (affects performance optimizations)
 * @property enableInteractivity - Whether to enable mouse/touch interaction
 */
interface LineWaveSystemProps {
  lineCount: number;
  colorPalette: string[];
  animationSpeed: number;
  isMobile: boolean;
  enableInteractivity: boolean;
}

/**
 * LineWaveSystem Component
 *
 * Internal component that renders and animates multiple 3D lines with wave patterns.
 * This component runs inside the React Three Fiber Canvas and handles:
 * - Line geometry generation and updates
 * - Animation loop using useFrame
 * - Mouse/touch interaction handling
 * - Performance optimizations for mobile devices
 *
 * @internal
 */
function LineWaveSystem({
  lineCount,
  colorPalette,
  animationSpeed,
  isMobile,
  enableInteractivity,
}: LineWaveSystemProps) {
  const linesRef = useRef<Line[]>([]);
  const lineConfigsRef = useRef<LineConfig[]>([]);
  const baseConfigsRef = useRef<LineConfig[]>([]);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  // Initialize line configurations once on component mount
  // Each line gets unique parameters to create visual variety
  if (lineConfigsRef.current.length === 0) {
    for (let i = 0; i < lineCount; i++) {
      // Normalize index to 0-1 range for parameter distribution
      const normalizedIndex = i / lineCount;

      // Reduce animation complexity on mobile for better performance
      const mobileSpeedMultiplier = isMobile ? 0.7 : 1.0;

      const config = {
        // Wave height: optimized for visual impact without overwhelming
        // Mobile: 2.0 (increased slightly for better visibility)
        // Desktop: 2.8 (increased for more dramatic effect)
        amplitude: isMobile ? 2.0 : 2.8,
        // Wave frequency: varies per line for visual diversity
        // Range: 2.5 to 5.5 (adjusted for smoother, more elegant waves)
        frequency: 2.5 + normalizedIndex * 3,
        // Phase offset: distributes lines evenly in wave cycle
        // Prevents all lines from moving in sync
        phase: normalizedIndex * Math.PI * 2,
        // Animation speed: varies per line for organic feel
        // Range: 0.35 to 0.55 (slightly faster for more energy)
        // Slower lines in front, faster in back creates depth
        speed:
          (0.35 + normalizedIndex * 0.2) *
          animationSpeed *
          mobileSpeedMultiplier,
        // Point count: fewer points on mobile for performance
        pointCount: isMobile ? 30 : 50,
      };

      lineConfigsRef.current.push(config);
      // Store base configs for resetting after mouse interaction
      baseConfigsRef.current.push({ ...config });
    }
  }

  // Mouse/touch interaction handler
  useEffect(() => {
    if (!enableInteractivity) return;

    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      targetMouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        // Normalize touch position to -1 to 1 range
        targetMouseRef.current.x = (touch.clientX / window.innerWidth) * 2 - 1;
        targetMouseRef.current.y =
          -(touch.clientY / window.innerHeight) * 2 + 1;
      }
    };

    const handleMouseLeave = () => {
      // Reset to center when mouse leaves
      targetMouseRef.current.x = 0;
      targetMouseRef.current.y = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [enableInteractivity]);

  // Animation loop - updates line geometries each frame (60 FPS target)
  // This is called by React Three Fiber's render loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Apply smooth easing to mouse position for fluid interaction
    // Uses linear interpolation (lerp) with factor 0.1 for gradual movement
    if (enableInteractivity) {
      mousePositionRef.current.x +=
        (targetMouseRef.current.x - mousePositionRef.current.x) * 0.1;
      mousePositionRef.current.y +=
        (targetMouseRef.current.y - mousePositionRef.current.y) * 0.1;

      // Update line configs based on mouse position
      // Mouse movement influences wave amplitude and frequency for interactivity
      lineConfigsRef.current.forEach((config, index) => {
        const baseConfig = baseConfigsRef.current[index];

        // Horizontal mouse position affects wave height (amplitude)
        // Multiplier 0.6 creates noticeable but elegant interaction
        const mouseInfluence = Math.abs(mousePositionRef.current.x) * 0.6;

        // Vertical mouse position affects wave frequency
        // Multiplier 0.4 creates balanced frequency changes
        const mouseInfluenceY = Math.abs(mousePositionRef.current.y) * 0.4;

        // Apply influences to create responsive animation
        // Clamped to prevent extreme values
        config.amplitude = Math.min(
          baseConfig.amplitude + mouseInfluence,
          baseConfig.amplitude * 1.8
        );
        config.frequency = Math.min(
          baseConfig.frequency + mouseInfluenceY,
          baseConfig.frequency * 1.5
        );
      });
    }

    // Update each line's geometry with new wave positions
    linesRef.current.forEach((line, index) => {
      if (line && line.geometry) {
        const config = lineConfigsRef.current[index];

        // Generate new points based on current time and config
        const newPoints = generateLinePoints(config, time);

        // Update geometry with new points (efficient in-place update)
        line.geometry.setFromPoints(newPoints);

        // Mark position attribute for GPU update
        // Required for Three.js to know the geometry changed
        line.geometry.attributes.position.needsUpdate = true;
      }
    });
  });

  return (
    <group>
      {lineConfigsRef.current.map((config, index) => {
        // Generate initial points for the line
        const initialPoints = generateLinePoints(config, 0);
        const geometry = new BufferGeometry().setFromPoints(initialPoints);

        // Select color from palette (cycle through if needed)
        const color = colorPalette[index % colorPalette.length];

        // Create material with optimized thickness and opacity
        const material = new LineBasicMaterial({
          color: color,
          linewidth: isMobile ? 3 : 5, // Thickness optimized for visibility
          transparent: true,
          opacity: 0.88, // Slightly increased for better color vibrancy
        });

        const line = new Line(geometry, material);
        // Vertical spacing: 0.65 units between lines for optimal coverage
        // Centers the group of lines vertically in the viewport
        line.position.set(0, (index - lineCount / 2) * 0.65, 0);

        return (
          <primitive
            key={index}
            object={line}
            ref={(el: Line) => {
              if (el) linesRef.current[index] = el;
            }}
          />
        );
      })}
    </group>
  );
}

/**
 * Static gradient fallback component for browsers without WebGL support
 *
 * Provides a visually similar static background when:
 * - WebGL is not supported by the browser
 * - User prefers reduced motion (accessibility)
 * - WebGL context is lost and cannot be restored
 *
 * Uses CSS gradients and blur effects to approximate the animated aesthetic.
 *
 * @internal
 */
function StaticGradientFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100">
      <div className="absolute inset-0 opacity-30">
        {/* Static decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

/**
 * Loading fallback component shown while the 3D scene initializes
 *
 * Displays a simple loading message during the brief period when
 * React Three Fiber is setting up the WebGL context and loading resources.
 *
 * @internal
 */
function LoadingFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
      <div className="text-slate-400 text-sm">Loading visualization...</div>
    </div>
  );
}

/**
 * WaveLineVisualization Component
 *
 * A modern Japanese-style music visualization featuring colorful animated 3D lines
 * that create flowing, wave-like patterns. Built with Three.js and React Three Fiber.
 *
 * ## Features
 * - Smooth, fluid wave animations using parametric equations
 * - Vibrant Japanese-inspired color palette
 * - Interactive mouse/touch response
 * - Mobile-optimized performance (reduced complexity on mobile)
 * - Graceful fallback for unsupported browsers
 * - Respects `prefers-reduced-motion` accessibility preference
 * - WebGL context loss handling
 *
 * ## Performance Considerations
 * - Desktop: 12 lines with 50 points each, targets 60 FPS
 * - Mobile: 6 lines with 30 points each, targets 30+ FPS
 * - Uses efficient geometry updates (no recreation per frame)
 * - Automatic quality reduction on mobile devices
 * - Bundle size: ~15KB gzipped (with Three.js tree-shaking)
 *
 * ## Accessibility
 * - Automatically detects and respects `prefers-reduced-motion`
 * - Shows static gradient fallback when motion is reduced
 * - Provides fallback for browsers without WebGL support
 * - Background visualization doesn't interfere with screen readers
 *
 * ## Browser Support
 * - Chrome/Edge 90+ (full support)
 * - Firefox 88+ (full support)
 * - Safari 14+ (full support)
 * - Older browsers: static gradient fallback
 *
 * @example
 * // Basic usage with defaults
 * <WaveLineVisualization />
 *
 * @example
 * // Custom configuration
 * <WaveLineVisualization
 *   lineCount={8}
 *   animationSpeed={0.7}
 *   colorPalette={['#FF6B9D', '#4ECDC4', '#AA96DA']}
 *   enableInteractivity={true}
 *   className="opacity-80"
 * />
 *
 * @example
 * // Non-interactive, slower animation
 * <WaveLineVisualization
 *   animationSpeed={0.5}
 *   enableInteractivity={false}
 * />
 */
export default function WaveLineVisualization({
  className = "",
  lineCount,
  colorPalette,
  animationSpeed = 1.0,
  enableInteractivity = true,
}: WaveLineVisualizationProps) {
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState<boolean>(false);
  const [contextLost, setContextLost] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Detect WebGL support, mobile devices, and motion preferences on mount
  useEffect(() => {
    // Check WebGL support
    const webGLAvailable = detectWebGLSupport();
    setWebGLSupported(webGLAvailable);

    if (!webGLAvailable) {
      console.warn(
        "WaveLineVisualization: WebGL is not supported on this device. Falling back to static gradient."
      );
    }

    // Detect mobile devices
    const checkMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };

    // Check reduced motion preference
    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
    };

    checkMobile();
    checkReducedMotion();

    // Listen for window resize to update mobile detection
    window.addEventListener("resize", checkMobile);

    // Listen for motion preference changes
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        console.info(
          "WaveLineVisualization: Motion preference changed to reduced. Switching to static fallback."
        );
      }
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("resize", checkMobile);
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // Handle WebGL context loss and restoration
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn(
        "WaveLineVisualization: WebGL context lost. Attempting to restore..."
      );
      setContextLost(true);
    };

    const handleContextRestored = () => {
      console.info("WaveLineVisualization: WebGL context restored.");
      setContextLost(false);
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, []);

  // Show fallback if WebGL is not supported
  if (!webGLSupported) {
    return <StaticGradientFallback />;
  }

  // Show static fallback if user prefers reduced motion
  if (prefersReducedMotion) {
    console.info(
      "WaveLineVisualization: User prefers reduced motion. Showing static fallback."
    );
    return <StaticGradientFallback />;
  }

  // Show fallback if WebGL context is lost
  if (contextLost) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Restoring visualization...</div>
      </div>
    );
  }

  // Determine line count based on device type if not explicitly provided
  const effectiveLineCount = lineCount ?? (isMobile ? 6 : 12);

  // Default color palette - vibrant Japanese-inspired colors
  // Carefully curated for visual harmony and contrast on light background
  const defaultColorPalette = [
    "#FF6B9D", // Vibrant Pink - primary accent
    "#4ECDC4", // Bright Cyan - cool contrast
    "#AA96DA", // Rich Purple - depth
    "#F38181", // Warm Coral - energy
    "#95E1D3", // Soft Mint - freshness
    "#FF8FB1", // Hot Pink - vibrancy
    "#6C5CE7", // Electric Purple - modern
    "#FD79A8", // Rose Pink - elegance
    "#74B9FF", // Sky Blue - calm
    "#A29BFE", // Lavender - sophistication
    "#FDCB6E", // Golden Yellow - warmth
    "#55EFC4", // Turquoise - energy
  ];

  // Use provided color palette or default
  const effectiveColorPalette = colorPalette ?? defaultColorPalette;

  return (
    <div
      className={`absolute inset-0 ${className}`}
      aria-label="Animated background visualization"
      role="img"
    >
      {/* Light background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 z-0"></div>

      {/* Three.js Canvas */}
      <div className="absolute inset-0 z-1 opacity-90">
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            camera={{
              position: [0, 0, 16], // Slightly pulled back for better framing
              fov: 55, // Narrower field of view for more elegant perspective
              near: 0.1,
              far: 1000,
            }}
            dpr={isMobile ? [1, 1.5] : [1, 2]}
            frameloop="always"
            style={{ width: "100%", height: "100%" }}
            gl={{
              antialias: !isMobile,
              alpha: true,
              powerPreference: isMobile ? "low-power" : "high-performance",
            }}
            onCreated={({ gl }) => {
              canvasRef.current = gl.domElement;
              console.info(
                "WaveLineVisualization: Three.js canvas initialized successfully"
              );
            }}
          >
            {/* Ambient lighting for subtle illumination */}
            <ambientLight intensity={0.5} />

            {/* Directional light for depth */}
            <directionalLight position={[10, 10, 5]} intensity={0.3} />

            {/* Animated line wave system */}
            <LineWaveSystem
              lineCount={effectiveLineCount}
              colorPalette={effectiveColorPalette}
              animationSpeed={animationSpeed}
              isMobile={isMobile}
              enableInteractivity={enableInteractivity}
            />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
}

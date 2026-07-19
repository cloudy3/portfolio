"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { detectWebGLSupport } from "@/lib/webgl";
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
 * The site's four accent tokens (--accent-cyan/blue/violet/lime), cycled across
 * the lines. Three.js needs literal values, so these mirror globals.css.
 */
const DEFAULT_COLOR_PALETTE = [
  "#06b6d4", // accent-cyan
  "#2563eb", // accent-blue
  "#7c3aed", // accent-violet
  "#84cc16", // accent-lime
];

/**
 * Line opacity. The palette is more saturated than the old pastel one, so the
 * lines are drawn lighter to stay a background element on the cream page.
 */
const LINE_OPACITY = 0.55;

/** Page-native backdrop for the canvas and its loading/error states. */
const BACKDROP_CLASS =
  "bg-gradient-to-br from-surface-page via-surface-elevated to-surface-subtle";

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
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  // Live configs — mutated in place by the mouse interaction each frame.
  const lineConfigs = useMemo<LineConfig[]>(() => {
    return Array.from({ length: lineCount }, (_, i) => {
      // Normalize index to 0-1 range for parameter distribution
      const normalizedIndex = i / lineCount;

      // Reduce animation complexity on mobile for better performance
      const mobileSpeedMultiplier = isMobile ? 0.7 : 1.0;

      return {
        // Wave height: mobile is tuned down slightly
        amplitude: isMobile ? 2.0 : 2.8,
        // Wave frequency: varies per line for visual diversity (2.5 - 5.5)
        frequency: 2.5 + normalizedIndex * 3,
        // Phase offset: distributes lines evenly through the wave cycle so
        // they don't all move in sync
        phase: normalizedIndex * Math.PI * 2,
        // Slower lines in front, faster behind, which reads as depth
        speed:
          (0.35 + normalizedIndex * 0.2) *
          animationSpeed *
          mobileSpeedMultiplier,
        // Fewer points on mobile for performance
        pointCount: isMobile ? 30 : 50,
      };
    });
  }, [lineCount, isMobile, animationSpeed]);

  // Pristine copy, used to clamp the mouse-driven values back to base.
  const baseConfigs = useMemo(
    () => lineConfigs.map((config) => ({ ...config })),
    [lineConfigs]
  );

  // Identity of the palette contents, so an inline array prop doesn't rebuild
  // every GPU object on each parent render.
  const paletteKey = colorPalette.join(",");

  /*
   * Build the Three.js objects once per configuration rather than inside
   * render(). These were previously constructed in the render map(), so any
   * parent re-render allocated a fresh BufferGeometry / LineBasicMaterial /
   * Line per line and leaked the old GPU-backed ones.
   */
  const lines = useMemo(() => {
    return lineConfigs.map((config, index) => {
      const geometry = new BufferGeometry().setFromPoints(
        generateLinePoints(config, 0)
      );

      const material = new LineBasicMaterial({
        // NOTE: `linewidth` is intentionally absent — WebGL ignores it and
        // always draws 1px lines. Thicker lines would need Line2 / MeshLine.
        color: colorPalette[index % colorPalette.length],
        transparent: true,
        opacity: LINE_OPACITY,
      });

      const line = new Line(geometry, material);
      // 0.65 units of vertical spacing, centred on the group
      line.position.set(0, (index - lineCount / 2) * 0.65, 0);
      return line;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineConfigs, lineCount, paletteKey]);

  // Release GPU resources when the lines are replaced or the scene unmounts.
  useEffect(() => {
    return () => {
      for (const line of lines) {
        line.geometry.dispose();
        (line.material as LineBasicMaterial).dispose();
      }
    };
  }, [lines]);

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
      lineConfigs.forEach((config, index) => {
        const baseConfig = baseConfigs[index];

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
    lines.forEach((line, index) => {
      const config = lineConfigs[index];
      if (!config) return;

      // In-place geometry update — no per-frame allocation of GPU objects
      line.geometry.setFromPoints(generateLinePoints(config, time));
      line.geometry.attributes.position.needsUpdate = true;
    });
  });

  return (
    <group>
      {lines.map((line, index) => (
        <primitive key={index} object={line} />
      ))}
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
    <div
      className="absolute inset-0 bg-surface-page"
      data-testid="wave-static-fallback"
      aria-hidden
    >
      {/* Same faint grid the rest of the site uses */}
      <div className="absolute inset-0 bg-grid-faint opacity-70" />
      {/* One soft cyan glow, echoing the sparse accent language */}
      <div className="absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-cyan/10 blur-3xl" />
      {/* Fade the grid out toward the bottom so section edges stay calm */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface-page to-transparent" />
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
    <div
      className={`absolute inset-0 ${BACKDROP_CLASS} flex items-center justify-center`}
    >
      <div className="text-content-muted text-sm">Loading visualization…</div>
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

    // Viewport-based mobile detection. This drives quality settings, so what
    // matters is the viewport, not the device. A resize listener fired on
    // every pixel of movement and remounted the scene when crossing 768px;
    // matchMedia only notifies on an actual crossing.
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const handleMobileChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile(e.matches);

    handleMobileChange(mobileQuery);
    mobileQuery.addEventListener("change", handleMobileChange);

    // Reduced motion preference
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setPrefersReducedMotion(e.matches);

    handleMotionChange(motionQuery);
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      mobileQuery.removeEventListener("change", handleMobileChange);
      motionQuery.removeEventListener("change", handleMotionChange);
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
    return <StaticGradientFallback />;
  }

  // Show fallback if WebGL context is lost
  if (contextLost) {
    return (
      <div
        className={`absolute inset-0 ${BACKDROP_CLASS} flex items-center justify-center`}
      >
        <div className="text-content-muted text-sm">
          Restoring visualization…
        </div>
      </div>
    );
  }

  // Determine line count based on device type if not explicitly provided
  const effectiveLineCount = lineCount ?? (isMobile ? 6 : 12);

  // Use provided color palette or the theme accents
  const effectiveColorPalette = colorPalette ?? DEFAULT_COLOR_PALETTE;

  return (
    <div
      className={`absolute inset-0 ${className}`}
      aria-label="Animated background visualization"
      role="img"
    >
      {/* Page-native background gradient */}
      <div
        className={`absolute inset-0 ${BACKDROP_CLASS} z-0`}
        data-testid="wave-backdrop"
      />

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

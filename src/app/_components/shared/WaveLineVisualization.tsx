"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { detectWebGLSupport } from "./ThreeScene";
// Import only the specific Three.js classes we need for better tree-shaking
import { Vector3, BufferGeometry, LineBasicMaterial, Line } from "three";

/**
 * Configuration for individual line animations
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
 * @param config - Line configuration parameters
 * @param time - Current animation time in seconds
 * @returns Array of Vector3 points forming a smooth wave pattern
 */
function generateLinePoints(config: LineConfig, time: number): Vector3[] {
  const points: Vector3[] = [];
  const { pointCount, amplitude, frequency, phase, speed } = config;

  for (let i = 0; i < pointCount; i++) {
    const t = i / pointCount;

    // Spread line across the screen horizontally
    const x = (t - 0.5) * 20;

    // Create vertical wave motion using sine function
    const y = Math.sin(t * frequency + time * speed + phase) * amplitude;

    // Create depth wave motion using cosine function for 3D effect
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
 */
interface WaveLineVisualizationProps {
  /** Optional CSS class name for styling */
  className?: string;
  /** Number of animated lines to render (default: 12 on desktop, 6 on mobile) */
  lineCount?: number;
  /** Array of color strings for the lines */
  colorPalette?: string[];
  /** Animation speed multiplier (default: 1.0) */
  animationSpeed?: number;
  /** Enable mouse/touch interaction (default: true) */
  enableInteractivity?: boolean;
}

/**
 * Props for the LineWaveSystem component
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
 * Renders and animates multiple 3D lines with wave patterns
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

  // Initialize line configurations once
  if (lineConfigsRef.current.length === 0) {
    for (let i = 0; i < lineCount; i++) {
      const normalizedIndex = i / lineCount;

      // Reduce animation complexity on mobile
      const mobileSpeedMultiplier = isMobile ? 0.7 : 1.0;

      const config = {
        amplitude: isMobile ? 1.8 : 2.5,
        frequency: 2 + normalizedIndex * 3, // Vary frequency for each line
        phase: normalizedIndex * Math.PI * 2, // Distribute phases evenly
        speed:
          (0.3 + normalizedIndex * 0.2) *
          animationSpeed *
          mobileSpeedMultiplier,
        pointCount: isMobile ? 30 : 50,
      };

      lineConfigsRef.current.push(config);
      // Store base configs for resetting
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

  // Animation loop - updates line geometries each frame
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Smooth easing for mouse position (lerp with factor 0.1)
    if (enableInteractivity) {
      mousePositionRef.current.x +=
        (targetMouseRef.current.x - mousePositionRef.current.x) * 0.1;
      mousePositionRef.current.y +=
        (targetMouseRef.current.y - mousePositionRef.current.y) * 0.1;

      // Update line configs based on mouse position
      lineConfigsRef.current.forEach((config, index) => {
        const baseConfig = baseConfigsRef.current[index];
        const mouseInfluence = Math.abs(mousePositionRef.current.x) * 0.5;
        const mouseInfluenceY = Math.abs(mousePositionRef.current.y) * 0.3;

        // Influence amplitude based on horizontal mouse position
        config.amplitude = baseConfig.amplitude + mouseInfluence;

        // Influence frequency based on vertical mouse position
        config.frequency = baseConfig.frequency + mouseInfluenceY;
      });
    }

    linesRef.current.forEach((line, index) => {
      if (line && line.geometry) {
        const config = lineConfigsRef.current[index];

        // Generate new points based on current time
        const newPoints = generateLinePoints(config, time);

        // Update geometry with new points
        line.geometry.setFromPoints(newPoints);

        // Mark position attribute for update
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

        // Create material with appropriate thickness
        const material = new LineBasicMaterial({
          color: color,
          linewidth: isMobile ? 2 : 3, // Note: linewidth > 1 may not work on all platforms
          transparent: true,
          opacity: 0.85,
        });

        const line = new Line(geometry, material);
        line.position.set(0, (index - lineCount / 2) * 0.3, 0); // Spread lines vertically

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
 * Features:
 * - Smooth, fluid wave animations
 * - Vibrant color palette
 * - Mouse/touch interactivity
 * - Mobile-optimized performance
 * - Graceful fallback for unsupported browsers
 * - Respects reduced motion preferences
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
  // Memoized to prevent recreation on every render
  const defaultColorPalette = [
    "#FF6B9D", // Pink
    "#4ECDC4", // Cyan
    "#95E1D3", // Mint
    "#F38181", // Coral
    "#AA96DA", // Purple
    "#FCBAD3", // Light Pink
    "#FFFFD2", // Light Yellow
    "#FFB6B9", // Pastel Pink
    "#FEC8D8", // Light Rose
    "#957DAD", // Lavender
    "#D4A5A5", // Dusty Rose
    "#9FD8CB", // Seafoam
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
              position: [0, 0, 15],
              fov: 50,
              near: 0.1,
              far: 1000,
            }}
            dpr={isMobile ? [1, 1.5] : [1, 2]}
            frameloop="always"
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

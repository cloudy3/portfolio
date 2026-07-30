"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_BACKGROUND,
  FRAME_SCALE_FACTOR,
  MAX_DPR,
  TOTAL_FRAMES,
  loadFrame,
  sampleFrameBackgroundColor,
} from "@/lib/keyboardStory";

interface CanvasDimensions {
  width: number;
  height: number;
}

export default function KeyboardScrollytellingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const pendingFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const hasDrawnInitialRef = useRef(false);

  // Not framer's useReducedMotion: it caches in a useState initializer and can
  // stay false for the component's lifetime, which left the 400vh scroll
  // region in place for reduced-motion visitors.
  const shouldReduceMotion = usePrefersReducedMotion();

  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [frameBackgrounds, setFrameBackgrounds] = useState<string[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentBackground, setCurrentBackground] =
    useState<string>(DEFAULT_BACKGROUND);
  const currentBackgroundRef = useRef<string>(DEFAULT_BACKGROUND);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 135,
    damping: 30,
    mass: 0.25,
  });

  // Reduced-motion visitors never scrub, so a single frame is the whole story.
  const targetFrameCount = shouldReduceMotion ? 1 : TOTAL_FRAMES;

  const progressPercent = useMemo(() => {
    if (targetFrameCount === 0) return 0;
    return Math.round((loadedCount / targetFrameCount) * 100);
  }, [loadedCount, targetFrameCount]);

  const getCanvasDimensions = useCallback(
    (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const nextWidth = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const nextHeight = Math.max(1, Math.round(canvas.clientHeight * dpr));

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const dimensions: CanvasDimensions = {
        width: canvas.clientWidth,
        height: canvas.clientHeight,
      };

      return dimensions;
    },
    []
  );

  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !frames[index]) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      const image = frames[index];
      const { width, height } = getCanvasDimensions(canvas, context);

      const containScale = Math.min(
        width / image.naturalWidth,
        height / image.naturalHeight
      );
      const scale = containScale * FRAME_SCALE_FACTOR;
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;

      context.clearRect(0, 0, width, height);
      context.drawImage(image, x, y, drawWidth, drawHeight);

      const nextBackground = frameBackgrounds[index] ?? DEFAULT_BACKGROUND;
      if (currentBackgroundRef.current !== nextBackground) {
        currentBackgroundRef.current = nextBackground;
        setCurrentBackground(nextBackground);
      }

      currentFrameRef.current = index;
    },
    [frameBackgrounds, frames, getCanvasDimensions]
  );

  const scheduleFrameDraw = useCallback(
    (index: number) => {
      pendingFrameRef.current = index;

      if (rafRef.current !== null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        drawFrame(pendingFrameRef.current);
      });
    },
    [drawFrame]
  );

  useEffect(() => {
    let cancelled = false;
    setLoadError(null);
    setLoadedCount(0);
    setIsReady(false);

    /*
     * Frame 0 first, so something is on screen after a single request; the
     * other 39 stream in behind it. Previously all 40 JPGs were requested on
     * mount, before any scroll intent — and reduced-motion visitors paid that
     * full download to look at one static frame.
     */
    const loadFrames = async () => {
      try {
        const firstFrame = await loadFrame(0);
        if (cancelled) return;

        const firstBackground = sampleFrameBackgroundColor(firstFrame);
        setFrames([firstFrame]);
        setFrameBackgrounds([firstBackground]);
        currentBackgroundRef.current = firstBackground;
        setCurrentBackground(firstBackground);
        setLoadedCount(1);

        if (shouldReduceMotion) {
          setIsReady(true);
          return;
        }

        const remainingFrames = await Promise.all(
          Array.from({ length: TOTAL_FRAMES - 1 }, async (_, offset) => {
            const image = await loadFrame(offset + 1);
            if (!cancelled) {
              setLoadedCount((value) => value + 1);
            }
            return image;
          })
        );

        if (cancelled) return;

        const allFrames = [firstFrame, ...remainingFrames];
        setFrames(allFrames);
        setFrameBackgrounds(allFrames.map(sampleFrameBackgroundColor));
        setIsReady(true);
      } catch (error) {
        if (cancelled) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to preload keyboard frames."
        );
      }
    };

    void loadFrames();

    return () => {
      cancelled = true;
    };
  }, [shouldReduceMotion]);

  // Paint frame 0 as soon as it exists — but only once, so the later arrival
  // of the remaining frames doesn't yank an already-scrubbed canvas back.
  useEffect(() => {
    if (hasDrawnInitialRef.current || frames.length === 0) return;
    hasDrawnInitialRef.current = true;
    pendingFrameRef.current = 0;
    currentFrameRef.current = 0;
    drawFrame(0);
  }, [drawFrame, frames]);

  useMotionValueEvent(smoothProgress, "change", (value) => {
    if (!isReady || shouldReduceMotion) return;

    const frame = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.round(value * (TOTAL_FRAMES - 1)))
    );

    if (frame === currentFrameRef.current) return;
    scheduleFrameDraw(frame);
  });

  useEffect(() => {
    const onResize = () => {
      if (!isReady) return;
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [drawFrame, isReady]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <section
      className="relative text-content-primary transition-colors duration-300"
      style={{ backgroundColor: currentBackground }}
    >
      {/*
       * Reduced motion gets a single screen-height section rather than a 400vh
       * scroll region: the frame never changes, so the tall container was just
       * a long empty scroll.
       */}
      <div
        ref={containerRef}
        className={
          shouldReduceMotion ? "relative h-screen" : "relative h-[400vh]"
        }
      >
        <div
          className={
            shouldReduceMotion
              ? "h-screen w-full overflow-hidden"
              : "sticky top-0 h-screen w-full overflow-hidden"
          }
        >
          <canvas
            ref={canvasRef}
            className="keyboard-story-canvas h-screen w-full"
            style={{ backgroundColor: currentBackground }}
            aria-label="Keyboard disassembly sequence"
            role="img"
          />

          {!isReady && !loadError ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="keyboard-story-loader absolute inset-0 flex flex-col items-center justify-center gap-4"
            >
              {/* Determinate track: the progress is known, so a spinner would
                  be throwing that information away. */}
              <div className="h-px w-40 bg-border-strong" aria-hidden>
                <span
                  className="block h-px bg-accent transition-[width] duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-content-muted">
                Loading <span className="num">{progressPercent}%</span>
              </p>
            </motion.div>
          ) : null}

          {loadError ? (
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
              <p className="max-w-lg text-content-muted">{loadError}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

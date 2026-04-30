"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
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

  const shouldReduceMotion = useReducedMotion();

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

  const progressPercent = useMemo(() => {
    if (TOTAL_FRAMES === 0) return 0;
    return Math.round((loadedCount / TOTAL_FRAMES) * 100);
  }, [loadedCount]);

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

    const loadFrames = async () => {
      try {
        const loadedFrames = await Promise.all(
          Array.from({ length: TOTAL_FRAMES }, async (_, index) => {
            const image = await loadFrame(index);
            if (!cancelled) {
              setLoadedCount((value) => value + 1);
            }
            return image;
          })
        );

        if (cancelled) return;
        const sampledBackgrounds = loadedFrames.map((frame) =>
          sampleFrameBackgroundColor(frame)
        );
        setFrames(loadedFrames);
        setFrameBackgrounds(sampledBackgrounds);
        currentBackgroundRef.current = sampledBackgrounds[0] ?? DEFAULT_BACKGROUND;
        setCurrentBackground(sampledBackgrounds[0] ?? DEFAULT_BACKGROUND);
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
  }, []);

  useEffect(() => {
    if (!isReady || frames.length !== TOTAL_FRAMES) return;
    const initialFrame = 0;
    pendingFrameRef.current = initialFrame;
    currentFrameRef.current = initialFrame;
    drawFrame(initialFrame);
  }, [drawFrame, frames, isReady]);

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
      <div ref={containerRef} className="relative h-[400vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
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
              <div
                className="h-10 w-10 rounded-full border-2 border-border-strong border-t-accent-cyan animate-spin"
                aria-hidden
              />
              <p className="font-mono-label text-content-muted tracking-[0.2em]">
                LOADING {progressPercent}%
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

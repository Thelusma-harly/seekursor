import createGlobe, { type COBEOptions } from "cobe";
import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "@/lib/utils";

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [37 / 255, 99 / 255, 235 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
};

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const preferences = useRef({ theme, reduce });
  preferences.current = { theme, reduce };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phi = useRef(0),
    width = useRef(0),
    ratio = useRef(2);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const visible = useRef(true);
  const onRender = useCallback((state: Record<string, unknown>) => {
    if (
      pointerInteracting.current === null &&
      !preferences.current.reduce &&
      visible.current
    )
      phi.current += 0.005;
    state.phi = phi.current + pointerInteractionMovement.current / 200;
    state.width = width.current * ratio.current;
    state.height = width.current * ratio.current;
    const dark = preferences.current.theme === "dark";
    state.dark = dark ? 1 : 0;
    state.baseColor = dark ? [0.55, 0.65, 0.8] : [1, 1, 1];
    state.glowColor = dark
      ? [16 / 255, 24 / 255, 40 / 255]
      : [248 / 255, 250 / 255, 252 / 255];
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onResize = () => {
      width.current = canvas.offsetWidth;
    };
    onResize();
    window.addEventListener("resize", onResize);
    const resize = new ResizeObserver(onResize);
    resize.observe(canvas);
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
    });
    observer.observe(canvas);
    const globe = createGlobe(canvas, {
      ...config,
      devicePixelRatio: ratio.current,
      width: width.current * ratio.current,
      height: width.current * ratio.current,
      onRender,
    });
    const frame = requestAnimationFrame(() => {
      canvas.style.opacity = "1";
    });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      resize.disconnect();
      observer.disconnect();
      globe.destroy();
    };
  }, [config, onRender]);
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute bottom-[-180px] left-1/2 z-0 aspect-square w-[min(360px,100%)] -translate-x-1/2 sm:bottom-[-255px] sm:w-[510px] lg:bottom-[-320px] lg:w-[640px]",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        className="size-full cursor-grab opacity-0 transition-opacity duration-500 [contain:layout_paint_size] [touch-action:pan-y]"
        onPointerDown={(event) => {
          pointerInteracting.current =
            event.clientX - pointerInteractionMovement.current;
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.style.cursor = "grabbing";
        }}
        onPointerMove={(event) => {
          if (pointerInteracting.current !== null)
            pointerInteractionMovement.current =
              event.clientX - pointerInteracting.current;
        }}
        onPointerUp={(event) => {
          pointerInteracting.current = null;
          event.currentTarget.style.cursor = "grab";
        }}
        onPointerCancel={(event) => {
          pointerInteracting.current = null;
          event.currentTarget.style.cursor = "grab";
        }}
        onLostPointerCapture={() => {
          pointerInteracting.current = null;
        }}
      />
    </div>
  );
}

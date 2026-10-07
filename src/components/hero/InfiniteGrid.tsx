import React, { useId, useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface GridPatternProps {
  offsetX: MotionValue<number>;
  offsetY: MotionValue<number>;
  size: number;
}

/**
 * SVG grid pattern matching Seekursor's restrained architectural aesthetic
 */
const GridPattern: React.FC<GridPatternProps> = ({
  offsetX,
  offsetY,
  size,
}) => {
  const patternId = useId();
  return (
    <svg className="w-full h-full" aria-hidden="true">
      <defs>
        <motion.pattern
          id={patternId}
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-ink"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};

export interface InfiniteGridProps {
  gridSize?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * InfiniteGrid component for Seekursor
 * Displays a subtle scrolling background grid with cursor-revealed active layer.
 * Uses the shared theme tokens with a subtle cursor highlight.
 */
export const InfiniteGrid: React.FC<InfiniteGridProps> = ({
  gridSize = 40,
  className,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Track mouse position with Motion Values for 60fps performance
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const handleMouseMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-1000);
    mouseY.set(-1000);
  };

  // Grid offsets for infinite scroll animation
  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = shouldReduceMotion ? 0 : 0.4;
  const speedY = shouldReduceMotion ? 0 : 0.4;

  useAnimationFrame(() => {
    if (shouldReduceMotion) return;
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % gridSize);
    gridOffsetY.set((currentY + speedY) % gridSize);
  });

  // Dynamic radial mask for the flashlight effect (300px circle)
  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onPointerMove={handleMouseMove}
      onPointerLeave={handleMouseLeave}
      className={cn(
        "relative w-full overflow-hidden bg-page transition-colors duration-200",
        className,
      )}
    >
      {/* Layer 1: Subtle background grid (always visible at 5% opacity) */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none select-none">
        <GridPattern
          offsetX={gridOffsetX}
          offsetY={gridOffsetY}
          size={gridSize}
        />
      </div>

      {/* Layer 2: Highlighted grid (revealed by mouse mask at ~25% opacity) */}
      <motion.div
        className="absolute inset-0 z-0 opacity-25 pointer-events-none select-none"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern
          offsetX={gridOffsetX}
          offsetY={gridOffsetY}
          size={gridSize}
        />
      </motion.div>

      {/* Children content wrapper */}
      <div className="relative w-full">{children}</div>
    </div>
  );
};

export default InfiniteGrid;

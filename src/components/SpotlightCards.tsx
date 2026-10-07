"use client";

/**
 * Feature grid with aurora ambient, magnetic 3D tilt, and focus-dim siblings.
 * Adapted for Seekursor with cohesive brand palette and customer discovery content.
 */

import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Search, Compass, MessageSquare } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ─── Constants ──────────────────────────────────────────────────────────────────

const TILT_MAX = 3;
const TILT_SPRING = { stiffness: 300, damping: 28 } as const;
const GLOW_SPRING = { stiffness: 180, damping: 22 } as const;

// ─── Data ────────────────────────────────────────────────────────────────────────

export interface SpotlightItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const DISCOVERY_ICONS = [Search, Compass, MessageSquare];

// ─── Card ────────────────────────────────────────────────────────────────────────

interface CardProps {
  item: SpotlightItem;
  dimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

function Card({ item, dimmed, onHoverStart, onHoverEnd }: CardProps) {
  const Icon = item.icon;
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const normX = useMotionValue(0.5);
  const normY = useMotionValue(0.5);

  const rawRotateX = useTransform(normY, [0, 1], [TILT_MAX, -TILT_MAX]);
  const rawRotateY = useTransform(normX, [0, 1], [-TILT_MAX, TILT_MAX]);

  const rotateX = useSpring(rawRotateX, TILT_SPRING);
  const rotateY = useSpring(rawRotateY, TILT_SPRING);
  const glowOpacity = useSpring(0, GLOW_SPRING);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el || reduce) {
      return;
    }
    const rect = el.getBoundingClientRect();
    normX.set((e.clientX - rect.left) / rect.width);
    normY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseEnter = () => {
    glowOpacity.set(reduce ? 0 : 0.5);
    onHoverStart();
  };

  const handleMouseLeave = () => {
    normX.set(0.5);
    normY.set(0.5);
    glowOpacity.set(0);
    onHoverEnd();
  };

  return (
    <motion.div
      animate={{
        scale: dimmed && !reduce ? 0.99 : 1,
        opacity: dimmed ? 0.9 : 1,
      }}
      className={cn(
        "group relative flex flex-col gap-5 overflow-hidden rounded-2xl border p-6",
        "border-line bg-surface",
        "transition-[border-color] duration-300",
        "hover:border-brand/30 cursor-default",
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={cardRef}
      style={{
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformPerspective: 900,
      }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {/* Static accent tint — always visible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}14, transparent 65%)`,
        }}
      />

      {/* Hover glow layer */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}2e, transparent 65%)`,
        }}
      />

      {/* Shimmer sweep */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[55%] -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[280%]"
      />

      {/* Icon badge */}
      <div
        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{
          background: `${item.color}18`,
          boxShadow: `inset 0 0 0 1px ${item.color}30`,
        }}
      >
        <Icon
          size={17}
          strokeWidth={1.9}
          className="text-brand-ink"
          aria-hidden="true"
        />
      </div>

      {/* Text */}
      <div className="relative z-10 flex flex-col gap-2">
        <h3 className="font-semibold text-[15px] sm:text-[16px] text-ink tracking-tight font-display">
          {item.title}
        </h3>
        <p className="text-[13px] text-ink-secondary leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Accent bottom line */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full transition-all duration-500 group-hover:w-full"
        style={{
          background: `linear-gradient(to right, ${item.color}80, transparent)`,
        }}
      />
    </motion.div>
  );
}

Card.displayName = "Card";

// ─── Main export ──────────────────────────────────────────────────────────────────

export interface SpotlightCardsProps {
  items?: SpotlightItem[];
  eyebrow?: string;
  heading?: string;
  className?: string;
}

export default function SpotlightCards({
  items,
  eyebrow,
  heading,
  className,
}: SpotlightCardsProps) {
  const t = useTranslations("Discovery");
  const localizedItems = items ?? (t.raw("items") as {title: string; description: string}[])
    .map((item, index) => ({...item, icon: DISCOVERY_ICONS[index], color: "#2563EB"}));
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);

  return (
    <section className="py-20 sm:py-24 bg-page border-b border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-2xl px-6 sm:px-10 pt-10 pb-12",
            "bg-surface border border-line shadow-xs",
            className,
          )}
        >
          {/* Dot grid — light mode only */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 dark:hidden"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(0,0,0,0.055) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          {/* Header */}
          <div className="relative mb-10 max-w-3xl flex flex-col gap-2">
            <p className="font-semibold text-xs text-brand-ink uppercase tracking-[0.2em]">
              {eyebrow ?? t("eyebrow")}
            </p>
            <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-ink tracking-tight font-display text-balance">
              {heading ?? t("title")}
            </h2>
          </div>

          {/* Card grid */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {localizedItems.map((item) => (
              <Card
                dimmed={hoveredTitle !== null && hoveredTitle !== item.title}
                item={item}
                key={item.title}
                onHoverEnd={() => setHoveredTitle(null)}
                onHoverStart={() => setHoveredTitle(item.title)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { SpotlightCards };

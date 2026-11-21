"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import "./new-effect-visuals.css";

const Waterfall = dynamic(() => import("./LightWaterfallPool"), { ssr: false });
const CursorField = dynamic(() => import("./CursorRingField"), { ssr: false });
const Velour = dynamic(() => import("./VelourBolster"), { ssr: false });

// The source renderers are mounted only while their section is visible.
// Touch, data-saving and reduced-motion visitors retain the static composition.
function useVisualGate() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const media = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (prefers-reduced-motion: no-preference)",
    );
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    let visible = false;
    const update = () =>
      setEnabled(
        visible && media.matches && !document.hidden && !connection?.saveData,
      );
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(host);
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return { ref, enabled };
}

export function WaterfallBackground() {
  const { ref, enabled } = useVisualGate();
  const { theme } = useTheme();
  const dark = theme === "dark";
  return (
    <div
      ref={ref}
      className="waterfall-effect"
      data-live={enabled}
      aria-hidden="true"
    >
      <div className="waterfall-still">
        <i />
        <b />
      </div>
      {enabled && (
        <div className="waterfall-live">
          <Waterfall
            background="#000000"
            baseColor={dark ? "#397AFF" : "#2563EB"}
            accentColor={dark ? "#DBECFF" : "#3D7CF0"}
            strands={180}
            glow={dark ? 75 : 65}
            floor={55}
            scale={160}
            zoom={72}
            placement={{ x: 27, y: 0, angle: 0, tilt: 0 }}
            hover={12}
            hoverSpeed={25}
            surge={false}
            speed={42}
            advanced={{
              horizon: 76,
              floorTop: "#000000",
              floorDeep: "#000000",
              bloomColor: "#4B84ED",
              horizonColor: "#6195F6",
              causticColor: "#397AFF",
              sparkleColor: "#A1C4FF",
              specks: 2,
              sparkles: 4,
              grain: 2,
              reflection: 65,
              vignette: 0,
              lean: 4,
            }}
            style={{ background: "transparent" }}
          />
        </div>
      )}
    </div>
  );
}

export function CursorFieldBackground() {
  const { ref, enabled } = useVisualGate();
  return (
    <div
      ref={ref}
      className="cursor-field-effect"
      data-live={enabled}
      aria-hidden="true"
    >
      <div className="cursor-field-still" />
      {enabled && (
        <div className="cursor-field-live">
          <CursorField
            background="transparent"
            colors={["#2563EB", "#5C91F3", "#A1C4FF"]}
            density={90}
            dotSize={90}
            speed={3}
            cameraDistance={200}
            ring={{ radius: 24, width: 8, push: 0, turbulence: 0 }}
            style={{ background: "transparent", minWidth: 0, minHeight: 0 }}
          />
        </div>
      )}
    </div>
  );
}

export function VelourAccent({ label }: { label: string }) {
  const { ref, enabled } = useVisualGate();
  const [active, setActive] = useState(false);
  useEffect(() => {
    const parent = ref.current?.closest<HTMLElement>("a, button");
    if (!parent) return;
    const enter = () => setActive(true);
    const leave = () => setActive(false);
    parent.addEventListener("pointerenter", enter);
    parent.addEventListener("pointerleave", leave);
    parent.addEventListener("focus", enter);
    parent.addEventListener("blur", leave);
    return () => {
      parent.removeEventListener("pointerenter", enter);
      parent.removeEventListener("pointerleave", leave);
      parent.removeEventListener("focus", enter);
      parent.removeEventListener("blur", leave);
    };
  }, []);
  return (
    <div
      ref={ref}
      className="velour-effect"
      aria-hidden="true"
      data-label={label}
    >
      {enabled && active && (
        <Velour
          text=""
          fabric="#2563EB"
          background="transparent"
          buttonHeight={54}
          buttonWidth={240}
          radius={16}
          drift={0}
          response={{
            puff: 2.8,
            bulge: 2.5,
            press: 3,
            wobble: 2,
            drag: 2,
            ripple: 2,
            release: 0.4,
          }}
          advanced={{
            glow: 0,
            shadow: 12,
            hem: 3,
            nap: 80,
            pile: 65,
            wrinkles: 60,
            fuzz: 0.3,
            sheen: 70,
          }}
          style={{ background: "transparent", overflow: "visible" }}
        />
      )}
    </div>
  );
}

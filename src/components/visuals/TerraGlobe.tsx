"use client";
import { useEffect, useRef, useState } from "react";

// Terra Dusk's daylight / atmosphere treatment with a single local texture.
export function TerraGlobe() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let visible = false;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setActive(visible && !document.hidden && !media.matches);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(root);
    document.addEventListener("visibilitychange", update);
    media.addEventListener("change", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      media.removeEventListener("change", update);
    };
  }, []);
  return (
    <div ref={ref} className="terra-stage" aria-hidden="true">
      <div className="terra-orbit" />
      <div
        className="terra-globe"
        style={{ animationPlayState: active ? "running" : "paused" }}
      />
      <span className="terra-pin" />
    </div>
  );
}

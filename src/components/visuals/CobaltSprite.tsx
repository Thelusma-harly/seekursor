"use client";
import type { PointerEvent } from "react";

// Cobalt Sprite's frosted capsule and cursor-following eyes, without a second raytracer.
export function CobaltSprite() {
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--look-x",
      ((event.clientX - rect.left) / rect.width - 0.5) * 12 + "px",
    );
    event.currentTarget.style.setProperty(
      "--look-y",
      ((event.clientY - rect.top) / rect.height - 0.5) * 8 + "px",
    );
  };
  return (
    <div
      aria-hidden="true"
      className="cobalt-sprite"
      onPointerMove={move}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--look-x", "0px");
        event.currentTarget.style.setProperty("--look-y", "0px");
      }}
    >
      <span className="sprite-shell" />
      <span className="sprite-body">
        <i />
        <i />
      </span>
      <span className="sprite-frost" />
    </div>
  );
}

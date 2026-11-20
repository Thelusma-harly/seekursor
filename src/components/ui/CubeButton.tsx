"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Cube Flip Button — adapted from the user-supplied Originkit component.
// CSS keeps the two faces synchronized without observers or animation loops.
export function CubeFaces({ children }: { children: ReactNode }) {
  return (
    <span className="cube-rotor">
      <span className="cube-face">{children}</span>
      <span className="cube-face cube-face-back" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
export type CubeVariant = "primary" | "secondary" | "light";
export const CubeButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: CubeVariant }
>(function CubeButton(
  { children, className, variant = "primary", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn("cube-button", className)}
      data-variant={variant}
      {...props}
    >
      <CubeFaces>{children}</CubeFaces>
    </button>
  );
});

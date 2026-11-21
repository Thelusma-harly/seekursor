"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Compatibility exports for the existing actions. The visual now follows the
// supplied Tactile Button: one keycap above a fixed base, with native semantics.
export function CubeFaces({ children }: { children: ReactNode }) {
  return <span className="tactile-face">{children}</span>;
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
      className={cn("cube-button tactile-button", className)}
      data-variant={variant}
      {...props}
    >
      <CubeFaces>{children}</CubeFaces>
    </button>
  );
});

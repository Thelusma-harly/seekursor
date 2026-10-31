"use client";

import { forwardRef, useId, useState, type CSSProperties, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SocialItem {
  href: string;
  ariaLabel: string;
  tooltip: string;
  svgUrl: string;
  color: string;
  darkColor?: string;
  onActivate?: (trigger: HTMLElement) => void;
}

export interface SocialTooltipProps extends HTMLAttributes<HTMLUListElement> {
  items: SocialItem[];
  tooltipSide?: "top" | "bottom";
}

const SocialTooltip = forwardRef<HTMLUListElement, SocialTooltipProps>(
  ({ className, items, tooltipSide = "bottom", onKeyDown, ...props }, ref) => {
    const id = useId();
    const [dismissed, setDismissed] = useState(false);
    const baseIconStyles = "relative flex size-11 items-center justify-center overflow-hidden rounded-full bg-page transition-shadow duration-300 ease-in-out group-hover:shadow-lg group-focus-within:shadow-lg motion-reduce:transition-none";
    const baseSvgStyles = "relative z-10 size-5 brightness-0 transition-[filter] duration-300 ease-in-out dark:invert group-hover:invert group-focus-within:invert motion-reduce:transition-none";
    const baseFilledStyles = "absolute bottom-0 left-0 h-0 w-full bg-[var(--social-fill)] transition-[height] duration-300 ease-in-out group-hover:h-full group-focus-within:h-full dark:bg-[var(--social-fill-dark)] motion-reduce:transition-none";
    const baseTooltipStyles = "invisible absolute left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm text-white opacity-0 transition-all duration-300 ease-in-out motion-reduce:transition-none";

    return (
      <ul ref={ref} className={cn("flex items-center justify-center gap-3", className)}
        onKeyDown={event => { onKeyDown?.(event); if (event.key === "Escape") setDismissed(true); }} {...props}>
        {items.map((item, index) => {
          const tooltipId = `${id}-${index}`;
          const icon = <>
            <span aria-hidden="true" className={baseFilledStyles} style={{ "--social-fill": item.color, "--social-fill-dark": item.darkColor ?? item.color } as CSSProperties} />
            <img src={item.svgUrl} alt="" aria-hidden="true" width={20} height={20} className={baseSvgStyles} />
          </>;
          return (
            <li key={item.href || item.ariaLabel}
              onPointerEnter={() => setDismissed(false)} onFocusCapture={() => setDismissed(false)}
              className={cn("group relative", tooltipSide === "top"
                ? "before:absolute before:inset-x-0 before:-top-5 before:h-5"
                : "before:absolute before:inset-x-0 before:-bottom-5 before:h-5")}>
              {item.href ? (
                <a href={item.href} aria-label={item.ariaLabel} aria-describedby={tooltipId}
                  className={baseIconStyles}
                  target={item.href.startsWith("https://") ? "_blank" : undefined}
                  rel={item.href.startsWith("https://") ? "noopener noreferrer" : undefined}>
                  {icon}
                </a>
              ) : (
                <button type="button" aria-label={item.ariaLabel} aria-describedby={tooltipId} aria-haspopup="dialog"
                  className={baseIconStyles} onClick={event => item.onActivate?.(event.currentTarget)}>
                  {icon}
                </button>
              )}
              <span id={tooltipId} role="tooltip" className={cn(baseTooltipStyles,
                tooltipSide === "top" ? "top-[-40px]" : "bottom-[-40px]",
                !dismissed && "group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100",
                !dismissed && (tooltipSide === "top"
                  ? "group-hover:top-[-50px] group-focus-within:top-[-50px]"
                  : "group-hover:bottom-[-50px] group-focus-within:bottom-[-50px]"))}
                style={{ backgroundColor: item.color }}>
                {item.tooltip}
              </span>
            </li>
          );
        })}
      </ul>
    );
  },
);

SocialTooltip.displayName = "SocialTooltip";
export { SocialTooltip };
export default SocialTooltip;

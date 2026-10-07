import type { MouseEvent } from "react";

// Section navigation stays on the current locale URL, including acquisition attribution.
export function followSection(event: MouseEvent<HTMLAnchorElement>, hash: string) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const section = document.querySelector(hash);
  if (!section) return;
  event.preventDefault();
  requestAnimationFrame(() => {
    section.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
    if (location.hash !== hash) history.pushState(null, "", hash);
  });
}

"use client";

import { useEffect, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";
import type { OpenAcquisition } from "../lib/acquisition";
import { ContactSocialLinks } from "./ContactSocialLinks";

export function FloatingSocialLinks({ footerRef, onAcquire, suspended = false }: {
  footerRef: RefObject<HTMLElement | null>;
  onAcquire: OpenAcquisition;
  suspended?: boolean;
}) {
  const [outsideFooter, setOutsideFooter] = useState(false);
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setOutsideFooter(!entry.isIntersecting), { threshold: 0 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, [footerRef]);
  const visible = outsideFooter && !suspended;
  return (
    <div data-floating-socials data-visible={visible} aria-hidden={!visible} inert={!visible}
      className={cn("fixed right-4 z-40 rounded-2xl border border-line bg-surface/95 p-3 shadow-lg backdrop-blur-md transition-[opacity,transform,visibility] duration-200 [bottom:max(1rem,env(safe-area-inset-bottom))] sm:right-6 motion-reduce:transition-none",
        visible ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-2 opacity-0")}>
      <ContactSocialLinks onAcquire={onAcquire} tooltipSide="top" />
    </div>
  );
}

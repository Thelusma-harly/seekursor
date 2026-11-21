"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const RippleImage = dynamic(() => import("./RippleImage"), { ssr: false });

// Keep the real photograph in the HTML; the decorative water surface is optional.
export function FounderPortrait({ src, alt }: { src: string; alt: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [size, setSize] = useState({ width: 500, height: 500 });

  useEffect(() => {
    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const update = () => {
      const next = media.matches && !connection?.saveData;
      setEnabled(next);
      if (!next || document.hidden) setActive(false);
    };
    const stop = () => setActive(false);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) stop();
    });
    if (frame.current) observer.observe(frame.current);
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("resize", stop);
    update();
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("resize", stop);
    };
  }, []);

  return (
    <div
      ref={frame}
      className="founder-portrait"
      onPointerEnter={(event) => {
        if (
          !enabled ||
          event.pointerType !== "mouse" ||
          event.currentTarget.closest("[inert]")
        )
          return;
        const rect = event.currentTarget.getBoundingClientRect();
        setSize({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
        setActive(true);
      }}
      onPointerLeave={() => setActive(false)}
    >
      <Image
        src={src}
        alt={alt}
        loading="lazy"
        width={1024}
        height={1024}
        sizes="(min-width: 1400px) 612px, (min-width: 1024px) calc((100vw - 176px) / 2), (min-width: 768px) 50vw, calc(100vw - 40px)"
      />
      {active && (
        <div className="founder-ripple" aria-hidden="true">
          <RippleImage
            image={src}
            cardWidth={size.width}
            cardHeight={size.height}
            intensity={20}
            size={40}
            rounded={0}
          />
        </div>
      )}
    </div>
  );
}

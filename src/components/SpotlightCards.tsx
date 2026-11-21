"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Fingerprint, MousePointer2 } from "lucide-react";
import { Reveal } from "./ui/Reveal";

const icons = [Search, Fingerprint, MousePointer2];
export function SpotlightCards() {
  const t = useTranslations("Discovery");
  const items = t.raw("items") as { title: string; description: string }[];
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    let inView = false;
    const update = () => setActive(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    if (sectionRef.current) observer.observe(sectionRef.current);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return (
    <section
      ref={sectionRef}
      data-dots-active={active}
      className="discovery-section section-space dot-discovery-section"
    >
      <div className="page-shell">
        <Reveal className="section-heading dot-discovery-heading">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2>{t("title")}</h2>
        </Reveal>
        <div className="dot-discovery-grid">
          {items.map((item, index) => {
            const Icon = icons[index];
            return (
              <Reveal key={item.title} delay={index * 0.06}>
                <article
                  className="dot-discovery-card"
                  style={
                    { "--dot-delay": `${index * -2.5}s` } as React.CSSProperties
                  }
                >
                  <span className="discovery-orbit-dot" aria-hidden="true" />
                  <div className="dot-card-interior">
                    <span className="dot-card-ray" aria-hidden="true" />
                    <span className="dot-card-icon">
                      <Icon size={29} strokeWidth={1.4} aria-hidden="true" />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span
                      className="dot-card-line dot-card-line-top"
                      aria-hidden="true"
                    />
                    <span
                      className="dot-card-line dot-card-line-left"
                      aria-hidden="true"
                    />
                    <span
                      className="dot-card-line dot-card-line-bottom"
                      aria-hidden="true"
                    />
                    <span
                      className="dot-card-line dot-card-line-right"
                      aria-hidden="true"
                    />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default SpotlightCards;

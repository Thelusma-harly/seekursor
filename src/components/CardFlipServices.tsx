"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowUpRight, ArrowLeft, Check } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useSeekursorConfig, type ServiceItem } from "../data/seekursorConfig";
import { WhatsAppCTA } from "./WhatsAppCTA";
import { Reveal } from "./ui/Reveal";
import type { OpenAcquisition } from "../lib/acquisition";

const RippleImage = dynamic(() => import("./visuals/RippleImage"), {
  ssr: false,
});
const images = [
  "digital-presence",
  "customer-experience",
  "custom-apps",
  "automation",
  "social-publishing",
];
function ServiceCard({
  service,
  index,
  onAcquire,
  ripple,
  onRipple,
}: {
  service: ServiceItem;
  index: number;
  onAcquire: OpenAcquisition;
  ripple: boolean;
  onRipple: (index: number | null) => void;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState({ width: 400, height: 510 });
  const frontRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const pendingFocus = useRef(false);
  const reduce = useReducedMotion();
  const image = "/images/services/" + images[index] + ".webp";
  const toggle = (next: boolean) => {
    pendingFocus.current = true;
    onRipple(null);
    setOpen(next);
  };
  useEffect(() => {
    if (!pendingFocus.current) return;
    const frame = requestAnimationFrame(() => {
      (open ? backRef : frontRef).current?.focus({ preventScroll: true });
      if (open && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        if (rect.top < 88 || rect.bottom > window.innerHeight - 100) {
          cardRef.current.scrollIntoView({
            block: "start",
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "instant"
              : "smooth",
          });
        }
      }
      pendingFocus.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);
  return (
    <article
      ref={cardRef}
      data-service-card={service.title}
      className={"service-card service-card-" + index}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          toggle(false);
        }
      }}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse" || reduce || open) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setSize({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
        onRipple(index);
      }}
      onPointerLeave={() => onRipple(null)}
      onFocusCapture={() => onRipple(null)}
    >
      <div className="service-front" aria-hidden={open} inert={open}>
        <Image
          src={image}
          alt={t("Services.imageAlt", { title: service.title })}
          width={800}
          height={1000}
          loading="lazy"
          sizes="(min-width: 1400px) 426px, (min-width: 1024px) calc((100vw - 100px) / 3), (min-width: 768px) calc((100vw - 78px) / 2), (min-width: 480px) calc((100vw - 62px) / 2), calc(100vw - 40px)"
          className="service-image"
        />
        {ripple && !open && (
          <div className="service-ripple" aria-hidden="true">
            <RippleImage
              image={image}
              cardWidth={size.width}
              cardHeight={size.height}
              intensity={24}
              size={42}
              rounded={0}
            />
          </div>
        )}
        <div className="service-shade" />
        <div className="service-front-copy">
          <h3>{service.title}</h3>
          <p>{service.subtitle}</p>
          <button
            ref={frontRef}
            type="button"
            onClick={() => toggle(true)}
            aria-label={t("Services.discoverLabel", { title: service.title })}
            className="service-discover"
          >
            {t("Services.discover")}
            <span>
              <ArrowUpRight size={19} aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
      <div
        data-service-back
        className="service-back"
        aria-hidden={!open}
        inert={!open}
      >
        <div>
          <div className="service-back-header">
            <h3>{service.title}</h3>
            <button
              ref={backRef}
              type="button"
              aria-label={t("Services.returnLabel", { title: service.title })}
              onClick={() => toggle(false)}
              className="service-back-button"
            >
              <ArrowLeft size={19} aria-hidden="true" />
            </button>
          </div>
          <p className="service-detail">{service.description}</p>
        </div>
        <ul>
          {service.features.map((feature) => (
            <li key={feature}>
              <Check size={15} aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
        <WhatsAppCTA
          onUnavailable={onAcquire}
          message={t("WhatsApp.service", { title: service.title })}
          className="cube-compact w-full"
        >
          {t("Services.discuss")}
          <ArrowUpRight size={17} aria-hidden="true" />
        </WhatsAppCTA>
      </div>
    </article>
  );
}
export function CardFlipServices({
  onAcquire,
}: {
  onAcquire: OpenAcquisition;
}) {
  const t = useTranslations("Services");
  const { services } = useSeekursorConfig();
  const [ripple, setRipple] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const close = () => {
      if (document.hidden) setRipple(null);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setRipple(null);
    });
    if (sectionRef.current) observer.observe(sectionRef.current);
    document.addEventListener("visibilitychange", close);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", close);
    };
  }, []);
  return (
    <section
      ref={sectionRef}
      id="services"
      className="section-space services-section"
    >
      <div className="page-shell">
        <Reveal className="section-heading">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2>{t("title")}</h2>
          <p>{t("description")}</p>
        </Reveal>
        <div className="service-grid">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              index={index}
              onAcquire={onAcquire}
              ripple={ripple === index}
              onRipple={setRipple}
            />
          ))}
        </div>
        <p className="services-note">{t("aiNote")}</p>
      </div>
    </section>
  );
}

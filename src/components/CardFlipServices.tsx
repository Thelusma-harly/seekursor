"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  ArrowLeft,
  Check,
  Globe2,
  Users,
  PanelsTopLeft,
  Workflow,
  CalendarDays,
} from "lucide-react";
import { useSeekursorConfig, type ServiceItem } from "../data/seekursorConfig";
import { WhatsAppCTA } from "./WhatsAppCTA";
import { Reveal } from "./ui/Reveal";
import type { OpenAcquisition } from "../lib/acquisition";

const icons = [Globe2, Users, PanelsTopLeft, Workflow, CalendarDays];

// Interactive Travel Card's spring tilt and raised inner surface, adapted to
// simple service icons. The original service copy and contact actions remain.
function ServiceCard({
  service,
  index,
  onAcquire,
}: {
  service: ServiceItem;
  index: number;
  onAcquire: OpenAcquisition;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const frontRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const pendingFocus = useRef(false);
  const detailsId = useId();
  const reduce = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { damping: 22, stiffness: 150 });
  const springY = useSpring(pointerY, { damping: 22, stiffness: 150 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-7, 7]);
  const Icon = icons[index];
  const resetTilt = () => {
    pointerX.set(0);
    pointerY.set(0);
  };
  const toggle = (next: boolean) => {
    pendingFocus.current = true;
    resetTilt();
    setOpen(next);
  };

  useEffect(() => {
    if (!pendingFocus.current) return;
    const frame = requestAnimationFrame(() => {
      (open ? backRef : frontRef).current?.focus({ preventScroll: true });
      if (open && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        if (rect.top < 88 || rect.bottom > window.innerHeight - 32) {
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
    <motion.article
      ref={cardRef}
      data-service-card={service.title}
      data-service-open={open}
      className={"depth-service-card depth-service-card-" + index}
      style={{
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      onPointerMove={(event) => {
        if (
          event.pointerType !== "mouse" ||
          reduce ||
          open ||
          !window.matchMedia("(hover: hover) and (pointer: fine)").matches
        )
          return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
        pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={resetTilt}
      onFocusCapture={resetTilt}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          toggle(false);
        }
      }}
    >
      <div
        className="depth-service-face depth-service-front"
        aria-hidden={open}
        inert={open}
      >
        <div className="depth-service-symbol" aria-hidden="true">
          <Icon size={38} strokeWidth={1.35} />
        </div>
        <div className="depth-service-summary">
          <h3>{service.title}</h3>
          <p>{service.subtitle}</p>
        </div>
        <button
          ref={frontRef}
          type="button"
          onClick={() => toggle(true)}
          aria-expanded={open}
          aria-controls={detailsId}
          aria-label={t("Services.discoverLabel", { title: service.title })}
          className="depth-service-discover"
        >
          {t("Services.discover")}
          <ArrowUpRight size={18} aria-hidden="true" />
        </button>
      </div>
      <div
        id={detailsId}
        data-service-back
        className="depth-service-face depth-service-back"
        aria-hidden={!open}
        inert={!open}
      >
        <div>
          <div className="depth-service-back-header">
            <h3>{service.title}</h3>
            <button
              ref={backRef}
              type="button"
              aria-label={t("Services.returnLabel", { title: service.title })}
              onClick={() => toggle(false)}
              className="depth-service-return"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
          </div>
          <p className="depth-service-detail">{service.description}</p>
        </div>
        <ul>
          {service.features.map((feature) => (
            <li key={feature}>
              <Check size={15} aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <WhatsAppCTA
          onUnavailable={onAcquire}
          message={t("WhatsApp.service", { title: service.title })}
          className="w-full depth-service-discuss"
        >
          {t("Services.discuss")}
          <ArrowUpRight size={17} aria-hidden="true" />
        </WhatsAppCTA>
      </div>
    </motion.article>
  );
}

export function CardFlipServices({
  onAcquire,
}: {
  onAcquire: OpenAcquisition;
}) {
  const t = useTranslations("Services");
  const { services } = useSeekursorConfig();
  return (
    <section id="services" className="section-space services-section">
      <div className="page-shell">
        <Reveal className="section-heading">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2>{t("title")}</h2>
          <p>{t("description")}</p>
        </Reveal>
        <div className="depth-service-grid">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
              onAcquire={onAcquire}
            />
          ))}
        </div>
        <p className="services-note">{t("aiNote")}</p>
      </div>
    </section>
  );
}

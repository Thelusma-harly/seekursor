"use client";
import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowUpRight,
  MessageCircle,
  ListChecks,
  FileCheck2,
  PanelsTopLeft,
  Workflow,
  Users,
} from "lucide-react";
import { WhatsAppCTA } from "./WhatsAppCTA";
import { BrandLockup } from "./BrandLockup";
import { Reveal } from "./ui/Reveal";
import type { OpenAcquisition } from "../lib/acquisition";

const stepIcons = [MessageCircle, ListChecks, FileCheck2];
const nodes = [
  {
    icon: MessageCircle,
    x: 110,
    y: 90,
    path: "M 270 205 V 105 Q 270 90 255 90 H 110",
  },
  {
    icon: PanelsTopLeft,
    x: 360,
    y: 70,
    path: "M 294 205 V 85 Q 294 70 309 70 H 360",
  },
  { icon: ListChecks, x: 160, y: 205, path: "M 250 205 H 160" },
  { icon: Users, x: 480, y: 205, path: "M 314 205 H 480" },
  { icon: FileCheck2, x: 282, y: 360, path: "M 282 205 V 360" },
  {
    icon: Workflow,
    x: 460,
    y: 340,
    path: "M 314 215 V 325 Q 314 340 329 340 H 460",
  },
];
function PricingIntegrationVisual() {
  const id = useId().replace(/:/g, "");
  return (
    <div className="pricing-integration-visual" aria-hidden="true">
      <div className="integration-dots" />
      <div className="pricing-integration-diagram">
        <svg viewBox="0 0 564 410" fill="none" className="integration-lines">
          <defs>
            <linearGradient
              id={id}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="564"
              y2="410"
            >
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
          </defs>
          {nodes.map((node, index) => (
            <g key={index}>
              <path d={node.path} className="integration-line-base" />
              <path
                d={node.path}
                stroke={`url(#${id})`}
                className="integration-line-flow"
                style={{ animationDelay: `${index * -0.65}s` }}
              />
            </g>
          ))}
        </svg>
        <span className="integration-center">
          <BrandLockup />
          <span className="integration-pulse" />
        </span>
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <span
              key={index}
              className="integration-node"
              style={{
                left: `${(node.x / 564) * 100}%`,
                top: `${(node.y / 410) * 100}%`,
              }}
            >
              <Icon size={24} strokeWidth={1.45} />
            </span>
          );
        })}
      </div>
    </div>
  );
}
export function PricingApproachSection({
  onAcquire,
}: {
  onAcquire: OpenAcquisition;
}) {
  const t = useTranslations("Pricing");
  const steps = t.raw("steps") as string[];
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
      id="tarifs"
      aria-labelledby="pricing-title"
      data-integration-active={active}
      className="section-space pricing-section integration-pricing-section"
    >
      <div className="page-shell">
        <Reveal className="integration-pricing-card">
          <PricingIntegrationVisual />
          <div className="integration-pricing-content">
            <div className="section-heading">
              <p className="eyebrow">{t("eyebrow")}</p>
              <h2 id="pricing-title">{t("title")}</h2>
              <p>{t("description")}</p>
            </div>
            <ol className="integration-pricing-steps">
              {steps.map((step, index) => {
                const Icon = stepIcons[index];
                return (
                  <li key={step}>
                    <Icon size={21} strokeWidth={1.5} aria-hidden="true" />
                    <p>{step}</p>
                  </li>
                );
              })}
            </ol>
            <p className="integration-pricing-recurring">{t("recurring")}</p>
            <WhatsAppCTA
              onUnavailable={onAcquire}
              className="integration-pricing-action"
            >
              {t("discuss")}
              <ArrowUpRight size={18} aria-hidden="true" />
            </WhatsAppCTA>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

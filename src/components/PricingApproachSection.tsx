import { useTranslations } from "next-intl";
import {
  ArrowUpRight,
  MessageCircle,
  ListChecks,
  FileCheck2,
} from "lucide-react";
import { WhatsAppCTA } from "./WhatsAppCTA";
import { GlassIcon } from "./ui/GlassIcon";
import { Reveal } from "./ui/Reveal";
import type { OpenAcquisition } from "../lib/acquisition";
const icons = [MessageCircle, ListChecks, FileCheck2];
export function PricingApproachSection({
  onAcquire,
}: {
  onAcquire: OpenAcquisition;
}) {
  const t = useTranslations("Pricing");
  const steps = t.raw("steps") as string[];
  return (
    <section
      id="tarifs"
      aria-labelledby="pricing-title"
      className="section-space pricing-section"
    >
      <div className="page-shell">
        <div className="pricing-layout">
          <Reveal className="section-heading">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 id="pricing-title">{t("title")}</h2>
            <p>{t("description")}</p>
          </Reveal>
          <div className="pricing-steps">
            {steps.map((step, index) => (
              <Reveal key={step} delay={index * 0.06}>
                <div className="pricing-step">
                  <GlassIcon icon={icons[index]} />
                  <p>{step}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="pricing-bottom">
          <p>{t("recurring")}</p>
          <WhatsAppCTA onUnavailable={onAcquire} className="shrink-0">
            {t("discuss")}
            <ArrowUpRight size={18} aria-hidden="true" />
          </WhatsAppCTA>
        </div>
      </div>
    </section>
  );
}

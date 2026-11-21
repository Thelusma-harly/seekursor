"use client";
import { useTranslations } from "next-intl";
import { ArrowUpRight, CalendarDays, ArrowDown } from "lucide-react";
import { WaterfallBackground, VelourAccent } from "./visuals/EffectBackgrounds";
import { WhatsAppCTA } from "./WhatsAppCTA";
import { CubeButton } from "./ui/CubeButton";
import { Reveal } from "./ui/Reveal";
import { followSection } from "../lib/sectionNavigation";
import { Link } from "../i18n/navigation";
import type { OpenAcquisition } from "../lib/acquisition";

export function Hero({ onAcquire }: { onAcquire: OpenAcquisition }) {
  const t = useTranslations();
  return (
    <section id="accueil" className="premium-hero">
      <div className="hero-waterfall" aria-hidden="true">
        <WaterfallBackground />
      </div>
      <div className="hero-retro-grid" aria-hidden="true" />
      <div className="hero-layout page-shell">
        <Reveal className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" />
            {t("Hero.eyebrow")}
          </p>
          <h1>{t("Hero.title")}</h1>
          <p className="hero-description">{t("Hero.description")}</p>
          <div className="hero-actions">
            <WhatsAppCTA
              onUnavailable={onAcquire}
              appearance="velour"
              className="hero-velour-cta"
            >
              <VelourAccent label={t("Common.talk")} />
              <span className="velour-label">
                {t("Common.talk")}
                <ArrowUpRight size={18} aria-hidden="true" />
              </span>
            </WhatsAppCTA>
            <CubeButton
              variant="secondary"
              aria-haspopup="dialog"
              data-acquisition="booking"
              onClick={(event) => onAcquire("booking", event.currentTarget)}
            >
              {t("Common.booking")}
              <CalendarDays size={17} aria-hidden="true" />
            </CubeButton>
          </div>
        </Reveal>
        <div className="hero-art">
          <span className="art-coordinate" aria-hidden="true">
            {t("Common.location")}
          </span>
        </div>
      </div>
      <div className="hero-bottom page-shell">
        <span>{t("Hero.baseline")}</span>
        <Link
          href="/#services"
          onClick={(event) => followSection(event, "#services")}
          className="hero-scroll"
        >
          {t("Navigation.services")}
          <ArrowDown size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
export default Hero;

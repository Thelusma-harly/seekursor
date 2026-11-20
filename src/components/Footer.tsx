import { useTranslations } from "next-intl";
import { forwardRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { useSeekursorConfig } from "../data/seekursorConfig";
import type { OpenAcquisition } from "../lib/acquisition";
import { Link } from "../i18n/navigation";
import { followSection } from "../lib/sectionNavigation";
import { BrandLockup } from "./BrandLockup";
import { ContactSocialLinks } from "./ContactSocialLinks";
import { FinalCTASection } from "./FinalCTASection";

// Footer 03, adapted from Originkit's public preview with the user's approval.
// Closing CTA, four columns, status line and illuminated oversize wordmark.
export const Footer = forwardRef<HTMLElement, { onAcquire: OpenAcquisition }>(
  function Footer({ onAcquire }, ref) {
    const config = useSeekursorConfig();
    const t = useTranslations();
    return (
      <footer ref={ref} id="contact" className="premium-footer">
        <div className="page-shell">
          <FinalCTASection onAcquire={onAcquire} />
          <div className="footer-columns">
            <div className="footer-brand-column">
              <Link
                href="/#accueil"
                onClick={(event) => followSection(event, "#accueil")}
                aria-label={t("Navigation.brandHome")}
              >
                <BrandLockup />
              </Link>
              <p>{config.brand.description}</p>
              <p className="footer-status">
                <span className="status-dot" />
                {t("Common.baseline")}
              </p>
            </div>
            <nav aria-label={t("Navigation.primary")}>
              <h2>{t("Navigation.primary")}</h2>
              {config.navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={"/" + link.href}
                  onClick={(event) => followSection(event, link.href)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <nav aria-label={t("Navigation.services")}>
              <h2>{t("Navigation.services")}</h2>
              {config.services.map((service) => (
                <Link
                  key={service.title}
                  href="/#services"
                  onClick={(event) => followSection(event, "#services")}
                >
                  {service.title}
                </Link>
              ))}
            </nav>
            <div className="footer-contact">
              <h2>{t("Footer.contact")}</h2>
              <ContactSocialLinks
                onAcquire={onAcquire}
                className="justify-start"
                tooltipSide="top"
              />
              {config.contact.email && (
                <a href={"mailto:" + config.contact.email}>
                  {config.contact.email}
                </a>
              )}
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={(event) => onAcquire("booking", event.currentTarget)}
              >
                {t("Common.booking")}
                <ArrowUpRight size={15} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={(event) => onAcquire("inquiry", event.currentTarget)}
              >
                {t("Common.inquiry")}
                <ArrowUpRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="footer-wordmark" aria-hidden="true">
            <span>seekursor</span>
          </div>
          <div className="footer-bottom">
            <p>{t("Footer.copyright", { year: new Date().getFullYear() })}</p>
            <p>{t("Footer.madeIn")}</p>
            <Link
              href="/#accueil"
              onClick={(event) => followSection(event, "#accueil")}
              aria-label={t("Navigation.brandHome")}
            >
              <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </footer>
    );
  },
);

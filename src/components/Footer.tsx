import { useTranslations } from "next-intl";
import { forwardRef } from "react";
import { useSeekursorConfig } from "../data/seekursorConfig";
import type { OpenAcquisition } from "../lib/acquisition";
import { Link } from "../i18n/navigation";
import { followSection } from "../lib/sectionNavigation";
import { BrandLockup } from "./BrandLockup";
import { ContactSocialLinks } from "./ContactSocialLinks";
export const Footer = forwardRef<HTMLElement, { onAcquire: OpenAcquisition }>(function Footer({ onAcquire }, ref) {
  const config = useSeekursorConfig();
  const contact = config.contact;
  const t = useTranslations();
  return (
    <footer ref={ref} className="bg-surface text-ink">
      <div className="mx-auto max-w-7xl px-5 pt-14 pb-6 sm:px-8">
        <div className="grid gap-10 pb-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <Link href="/#accueil" onClick={event => followSection(event, "#accueil")} aria-label={t("Navigation.brandHome")}>
              <BrandLockup />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-secondary">
              {config.brand.description}
            </p>
            <p className="mt-4 text-xs text-ink-muted">
              {config.brand.baseline}
            </p>
          </div>
          <div className="space-y-3 text-sm text-ink-secondary md:justify-self-end">
            <h2 className="font-display font-semibold text-ink">
              {t("Footer.contact")}
            </h2>
            {contact.email && (
              <a
                className="block break-all hover:text-brand-ink"
                href={`mailto:${contact.email}`}
              >
                {contact.email}
              </a>
            )}
            <ContactSocialLinks onAcquire={onAcquire} className="justify-start" />
            <div className="border-t border-line pt-3">
              <button type="button" aria-haspopup="dialog" onClick={event => onAcquire("booking", event.currentTarget)} className="block min-h-11 text-left hover:text-brand-ink">{t("Common.booking")}</button>
              <button type="button" aria-haspopup="dialog" onClick={event => onAcquire("inquiry", event.currentTarget)} className="block min-h-11 text-left hover:text-brand-ink">{t("Common.inquiry")}</button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-xs text-ink-muted">
          <p>{t("Footer.copyright", {year: new Date().getFullYear()})}</p>
          <p>{t("Footer.madeIn")}</p>
        </div>
      </div>
    </footer>
  );
});

import { Component, lazy, Suspense, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { useTranslations } from "next-intl";
import { createPortal } from "react-dom";
import { ArrowUpRight, X } from "lucide-react";
import { useDialog } from "../hooks/useDialog";
import { useTheme } from "../context/ThemeContext";
import { acquisitionConfig, createWhatsAppLink } from "../data/acquisitionConfig";
import { siteConfig } from "../data/siteConfig";
import { collectAttribution, createCalDestination, createTallyDestination, type AcquisitionChannel } from "../lib/acquisition";
import { BrandLockup } from "./BrandLockup";

const BookingEmbed = lazy(() => import("./BookingEmbed"));
class EmbedBoundary extends Component<{ children: ReactNode; fallback: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <p role="alert" className="p-6 text-sm text-ink-secondary">{this.props.fallback}</p> : this.props.children;
  }
}

export function AcquisitionModal({ request, onClose, returnFocusRef }: {
  request: { channel: AcquisitionChannel; context?: string } | null;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}) {
  const t = useTranslations();
  const panelRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  useDialog(Boolean(request), onClose, panelRef, returnFocusRef);
  const attribution = useMemo(() => request ? collectAttribution(window.location.href, document.referrer, request.context) : {}, [request]);
  const calTitle = t("Acquisition.calTitle");
  const cal = useMemo(() => createCalDestination(acquisitionConfig.calUrl, attribution, theme, calTitle), [attribution, theme, calTitle]);
  const tally = useMemo(() => createTallyDestination(acquisitionConfig.tallyFormUrl, attribution), [attribution]);
  if (!request) return null;
  const { channel } = request;
  const configured = channel === "booking" ? Boolean(cal) : channel === "inquiry" ? Boolean(tally) : false;
  const hostedUrl = channel === "booking" ? cal?.hostedUrl : tally?.hostedUrl;
  const whatsapp = createWhatsAppLink({ message: channel === "whatsapp" ? request.context ?? t("WhatsApp.default") : t("WhatsApp.default") });
  const email = siteConfig.email;
  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-5"
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="acquisition-title"
        aria-describedby="acquisition-description" tabIndex={-1}
        className={`flex max-h-[calc(100dvh-1.5rem)] w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface text-ink shadow-xl sm:max-h-[calc(100dvh-2.5rem)] ${configured ? "h-[min(820px,calc(100dvh-1.5rem))] max-w-5xl" : "max-w-lg"}`}>
        <div className="shrink-0 border-b border-line p-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <BrandLockup />
            <button type="button" aria-label={t("Common.close")} onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full hover:bg-surface-secondary"><X size={20} /></button>
          </div>
          <h2 id="acquisition-title" className="mt-4 font-display text-xl font-semibold sm:text-2xl">{channel === "booking" ? t("Acquisition.titles.booking") : t(channel === "whatsapp" ? "Common.talk" : "Common.inquiry")}</h2>
          <p id="acquisition-description" className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-secondary">{t(`Acquisition.descriptions.${channel}`)}</p>
          {configured && hostedUrl && <a href={hostedUrl} target="_blank" rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-9 items-center gap-2 text-sm font-medium text-brand-ink">
            {t("Acquisition.direct", {provider: channel === "booking" ? "Cal.com" : "Tally"})} <ArrowUpRight size={15} aria-hidden="true" />
          </a>}
        </div>
        {configured ? (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {channel === "booking" && cal ? <EmbedBoundary key={theme} fallback={t("Acquisition.embedError")}>
              <Suspense fallback={<p role="status" className="p-6 text-sm text-ink-secondary">{t("Acquisition.loading")}</p>}>
                <BookingEmbed destination={cal} />
              </Suspense>
            </EmbedBoundary> : tally ? (
              // Tally owns its form appearance. Keep its chosen palette; never invert or restyle cross-origin controls.
              <iframe src={tally.embedUrl} title={t("Acquisition.tallyTitle")}
                className="block h-full w-full border-0 bg-white [color-scheme:light]"
                referrerPolicy="no-referrer" />
            ) : null}
          </div>
        ) : (
          <div className="overflow-y-auto p-5 sm:p-6">
            <p className="text-sm leading-relaxed text-ink-secondary">{t(`Acquisition.unavailable.${channel}`)}</p>
            {(channel !== "whatsapp" && whatsapp) || email ? <div className="mt-5 flex flex-wrap gap-3">
              {channel !== "whatsapp" && whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer"
                className="rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white hover:bg-brand-hover">{t("Common.writeWhatsApp")}</a>}
              {email && <a href={`mailto:${email}`} className="rounded-xl border border-line px-4 py-3 text-sm font-medium">{t("Acquisition.email")}</a>}
            </div> : <p className="mt-3 text-sm text-ink-muted">{t("Acquisition.later")}</p>}
            <button type="button" onClick={onClose} className="mt-6 min-h-11 rounded-xl border border-line px-4 py-2 text-sm hover:bg-surface-secondary">{t("Acquisition.back")}</button>
          </div>
        )}
        {configured && <div className="shrink-0 border-t border-line px-4 py-2 text-right sm:px-6">
          <button type="button" onClick={onClose} className="min-h-10 rounded-lg px-3 text-sm text-ink-secondary hover:bg-surface-secondary">{t("Common.close")}</button>
        </div>}
      </div>
    </div>, document.body,
  );
}

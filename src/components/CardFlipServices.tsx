import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import {
  ArrowRight,
  Repeat2,
  Globe2,
  Users,
  PanelsTopLeft,
  Workflow,
  Sparkles,
} from "lucide-react";
import { useSeekursorConfig, type ServiceItem } from "../data/seekursorConfig";
import { cn } from "@/lib/utils";
import { WhatsAppCTA } from "./WhatsAppCTA";
import type { OpenAcquisition } from "../lib/acquisition";

const icons = [Globe2, Users, PanelsTopLeft, Workflow, Sparkles];
export function CardFlip({
  service,
  index,
  onAcquire,
}: {
  service: ServiceItem;
  index: number;
  onAcquire: OpenAcquisition;
}) {
  const t = useTranslations();
  const [flipped, setFlipped] = useState(false);
  const frontRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const movingFocus = useRef(false);
  const Icon = icons[index];
  const flipWithFocus = (next: boolean) => {
    movingFocus.current = true;
    setFlipped(next);
    requestAnimationFrame(() => {
      (next ? backRef : frontRef).current?.focus({ preventScroll: true });
      movingFocus.current = false;
    });
  };
  return (
    <article
      data-service-card={service.title}
      className="group relative mx-auto h-[440px] w-full max-w-[400px] [perspective:2000px]"
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest("button, a"))
          flipWithFocus(!flipped);
      }}
      onPointerEnter={(e) => {
        if (
          e.pointerType === "mouse" &&
          !e.currentTarget.closest("[inert]") &&
          !e.currentTarget.contains(document.activeElement)
        )
          setFlipped(true);
      }}
      onPointerLeave={(e) => {
        if (
          e.pointerType === "mouse" &&
          !e.currentTarget.closest("[inert]") &&
          !e.currentTarget.contains(document.activeElement)
        )
          setFlipped(false);
      }}
      onBlur={(e) => {
        if (
          !movingFocus.current &&
          !e.currentTarget.closest("[inert]") &&
          !e.currentTarget.contains(e.relatedTarget)
        )
          setFlipped(false);
      }}
    >
      <div
        className={cn(
          "relative size-full [transform-style:preserve-3d] transition-transform duration-500 motion-reduce:transition-none",
          flipped ? "[transform:rotateY(180deg)]" : "",
        )}
      >
        <div
          aria-hidden={flipped}
          inert={flipped}
          className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-line bg-surface [backface-visibility:hidden]"
        >
          <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-brand-tint to-surface">
            <div className="grid size-24 place-items-center rounded-2xl border border-brand/20 bg-surface text-brand-ink">
              <Icon size={40} strokeWidth={1.3} aria-hidden="true" />
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-display text-xl font-semibold leading-tight text-ink">
              {service.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
              {service.subtitle}
            </p>
            <button
              ref={frontRef}
              type="button"
              onClick={() => flipWithFocus(true)}
              aria-label={t("Services.discoverLabel", {title: service.title})}
              className="mt-5 flex w-full items-center justify-between rounded-lg py-2 text-sm font-medium text-brand-ink"
            >
              {t("Services.discover")} <Repeat2 size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div
          data-service-back
          aria-hidden={!flipped}
          inert={!flipped}
          className="absolute inset-0 grid grid-rows-[auto_1fr_auto] gap-4 overflow-hidden rounded-2xl border border-line bg-surface p-5 text-ink [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-lg font-semibold leading-tight">
                {service.title}
              </h3>
              <button
                ref={backRef}
                type="button"
                aria-label={t("Services.returnLabel", {title: service.title})}
                onClick={() => flipWithFocus(false)}
                className="grid size-7 shrink-0 place-items-center rounded-md text-ink-muted hover:bg-surface-secondary"
              >
                <Repeat2 size={16} />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
              {service.description}
            </p>
          </div>
          <ul className="space-y-2 self-start">
            {service.features.map((feature, i) => (
              <li
                key={feature}
                style={{
                  opacity: flipped ? 1 : 0,
                  transform: flipped ? "translateX(0)" : "translateX(-10px)",
                  transitionDelay: `${i * 40 + 100}ms`,
                }}
                className="flex items-start gap-2 text-sm text-ink-secondary transition-[opacity,transform] duration-300"
              >
                <ArrowRight
                  size={14}
                  className="mt-1 shrink-0 text-brand-ink"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>
          <div className="border-t border-line pt-4">
            <WhatsAppCTA onUnavailable={onAcquire} message={t("WhatsApp.service", {title: service.title})} className="flex min-h-12 w-full items-center justify-between gap-2 rounded-xl bg-brand-tint px-3 py-2 text-left text-sm font-medium text-ink hover:bg-brand hover:text-white">
              {t("Services.discuss")} <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
            </WhatsAppCTA>
          </div>
        </div>
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
  const config = useSeekursorConfig();
  return (
    <section
      id="services"
      className="border-b border-line bg-surface py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-brand-ink">
            {t("eyebrow")}
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-secondary sm:text-lg">
            {t("description")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {config.services.map((service, index) => (
            <CardFlip
              key={index}
              service={service}
              index={index}
              onAcquire={onAcquire}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import { useTranslations } from "next-intl";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { X, ArrowUpRight } from "lucide-react";
import type { ProjectItem } from "../data/seekursorConfig";
import { useDialog } from "../hooks/useDialog";
import { WhatsAppCTA } from "./WhatsAppCTA";
import type { OpenAcquisition } from "../lib/acquisition";
export function ProjectModal({
  project,
  onClose,
  onAcquire,
}: {
  project: ProjectItem | null;
  onClose: () => void;
  onAcquire: OpenAcquisition;
}) {
  const t = useTranslations();
  const panelRef = useRef<HTMLDivElement>(null);
  useDialog(Boolean(project), onClose, panelRef);
  if (!project) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        tabIndex={-1}
        className="max-h-[calc(100dvh-2rem)] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-2xl border border-line bg-surface text-ink"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
          <span className="text-xs font-medium text-ink-secondary">
            {project.badge} · {project.category}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("Projects.close")}
            className="grid size-9 place-items-center rounded-full hover:bg-surface-secondary"
          >
            <X size={20} />
          </button>
        </div>
        <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2">
          <img
            src={project.image}
            alt={t("Projects.imageAlt", {title: project.title})}
            width={1024}
            height={768}
            className="aspect-[4/3] w-full rounded-xl object-cover"
          />
          <div>
            <h2
              id="project-title"
              className="font-display text-2xl font-semibold"
            >
              {project.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-secondary">
              {project.longDescription}
            </p>
            <h3 className="mt-6 text-sm font-semibold">{t("Projects.proposed")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
              {project.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span
                    className="size-1.5 shrink-0 rounded-full bg-brand"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-4 border-t border-line px-6 py-5 sm:flex-row sm:items-center sm:px-8">
          <div className="flex flex-col items-start gap-2 sm:ml-auto">
            <WhatsAppCTA onUnavailable={onAcquire} message={t("WhatsApp.project", {title: project.title})} className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white hover:bg-brand-hover">
              {t("Projects.discuss")} <ArrowUpRight size={17} />
            </WhatsAppCTA>
            <button type="button" aria-haspopup="dialog" data-acquisition="inquiry" onClick={event => onAcquire("inquiry", event.currentTarget, project.title)} className="inline-flex min-h-11 items-center text-sm font-medium text-brand-ink hover:underline">{t("Common.inquiry")}</button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

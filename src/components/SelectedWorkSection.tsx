import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { useSeekursorConfig, type ProjectItem } from "../data/seekursorConfig";
export function SelectedWorkSection({
  onSelectProject,
}: {
  onSelectProject: (project: ProjectItem) => void;
}) {
  const t = useTranslations("Projects");
  const config = useSeekursorConfig();
  return (
    <section
      id="realisations"
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
        <div className="grid gap-8 lg:grid-cols-3">
          {config.projects.map((project) => (
            <article
              key={project.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-page transition-colors hover:border-brand/50"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-secondary">
                <img
                  src={project.image}
                  alt={t("previewAlt", {title: project.title})}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="mb-3 text-xs text-ink-muted">
                  {project.category}
                </p>
                <h3 className="font-display text-xl font-semibold text-ink">
                  {project.title}
                </h3>
                <p className="mt-3 mb-6 text-sm leading-relaxed text-ink-secondary">
                  {project.description}
                </p>
                <button
                  type="button"
                  onClick={() => onSelectProject(project)}
                  className="mt-auto flex items-center justify-between border-t border-line pt-5 text-sm font-medium text-ink hover:text-brand-ink"
                >
                  {t("examine")}{" "}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

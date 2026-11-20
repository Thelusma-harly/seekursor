import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useSeekursorConfig, type ProjectItem } from "../data/seekursorConfig";
import { CubeButton } from "./ui/CubeButton";
import { Reveal } from "./ui/Reveal";
export function SelectedWorkSection({
  onSelectProject,
}: {
  onSelectProject: (project: ProjectItem) => void;
}) {
  const t = useTranslations("Projects");
  const { projects } = useSeekursorConfig();
  return (
    <section id="realisations" className="section-space projects-section">
      <div className="page-shell">
        <Reveal className="section-heading">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2>{t("title")}</h2>
          <p>{t("description")}</p>
        </Reveal>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.06}>
              <article className="project-card">
                <div className="project-image">
                  <Image
                    src={project.image}
                    alt={t("previewAlt", { title: project.title })}
                    loading="lazy"
                    width={1024}
                    height={768}
                    sizes="(min-width: 1280px) 410px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <span className="project-image-arrow" aria-hidden="true">
                    <ArrowUpRight size={22} />
                  </span>
                </div>
                <div className="project-copy">
                  <p className="eyebrow">{project.category}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <CubeButton
                    variant="secondary"
                    className="cube-compact"
                    onClick={() => onSelectProject(project)}
                  >
                    {t("examine")}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </CubeButton>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

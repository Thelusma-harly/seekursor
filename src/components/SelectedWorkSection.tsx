import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { useSeekursorConfig, type ProjectItem } from "../data/seekursorConfig";
import { CubeButton } from "./ui/CubeButton";
import { NotchedProjectCover } from "./ui/NotchedProjectCard";
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
        <div className="projects-grid notched-projects-grid">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.06}>
              <article className="project-card notched-project-card">
                <NotchedProjectCover
                  image={project.image}
                  imageAlt={t("previewAlt", { title: project.title })}
                  label={t("examine") + " : " + project.title}
                  badge={project.category}
                  onOpen={() => onSelectProject(project)}
                />
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

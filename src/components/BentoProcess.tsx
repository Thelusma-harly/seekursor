import { useTranslations } from "next-intl";
import { MessageCircle, Focus, PenTool, CheckCircle2 } from "lucide-react";
import { useSeekursorConfig } from "../data/seekursorConfig";
import { GlassIcon } from "./ui/GlassIcon";
import { Reveal } from "./ui/Reveal";
import { CobaltSprite } from "./visuals/CobaltSprite";
const icons = [MessageCircle, Focus, PenTool, CheckCircle2];
export function BentoGrid() {
  const t = useTranslations("Process");
  const { processSteps } = useSeekursorConfig();
  return (
    <section id="approche" className="section-space process-section">
      <div className="page-shell">
        <div className="process-intro">
          <Reveal className="section-heading">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2>{t("title")}</h2>
            <p>{t("description")}</p>
          </Reveal>
          <CobaltSprite />
        </div>
        <div className="process-grid">
          {processSteps.map((item, index) => (
            <Reveal key={item.number} delay={index * 0.06}>
              <article className="process-card">
                <div className="process-card-top">
                  <GlassIcon icon={icons[index]} />
                  <span>{t("step", { number: item.number })}</span>
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <span className="process-connector" aria-hidden="true" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
export default BentoGrid;

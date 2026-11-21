import { useTranslations } from "next-intl";
import { Compass, Layers3, Sparkles, MapPin } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { GlassIcon } from "./ui/GlassIcon";
import { TerraGlobe } from "./visuals/TerraGlobe";
import { HeroSculpture } from "./visuals/HeroSculpture";
const icons = [Compass, Layers3, Sparkles, MapPin];
export function DifferentiationSection() {
  const t = useTranslations("Differentiation");
  const common = useTranslations("Common");
  const principles = t.raw("items") as { title: string; description: string }[];
  return (
    <section className="section-space difference-section">
      <div className="page-shell">
        <Reveal className="difference-heading">
          <h2>{t("title")}</h2>
          <div className="difference-emblem">
            <HeroSculpture />
          </div>
        </Reveal>
        <div className="principles-grid">
          {principles.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.04}>
              <article className="principle-card">
                <GlassIcon icon={icons[index]} />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="global-panel">
          <div>
            <p className="eyebrow">{common("location")}</p>
            <p>{t("closing")}</p>
          </div>
          <TerraGlobe />
        </Reveal>
      </div>
    </section>
  );
}

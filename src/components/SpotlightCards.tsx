import { useTranslations } from "next-intl";
import { Search, Fingerprint, MousePointer2 } from "lucide-react";
import { GlassIcon } from "./ui/GlassIcon";
import { Reveal } from "./ui/Reveal";
const icons = [Search, Fingerprint, MousePointer2];
export function SpotlightCards() {
  const t = useTranslations("Discovery");
  const items = t.raw("items") as { title: string; description: string }[];
  return (
    <section className="discovery-section section-space">
      <div className="page-shell">
        <Reveal className="discovery-layout">
          <div className="section-heading">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2>{t("title")}</h2>
          </div>
          <div className="discovery-cards">
            {items.map((item, index) => (
              <article key={item.title} className="discovery-card">
                <GlassIcon icon={icons[index]} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <span className="discovery-line" aria-hidden="true" />
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
export default SpotlightCards;

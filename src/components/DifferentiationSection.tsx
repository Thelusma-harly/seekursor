import { useTranslations } from "next-intl";
import { TiltCard } from "./TiltCard";

export function DifferentiationSection() {
  const t = useTranslations("Differentiation");
  const principles = t.raw("items") as {title: string; description: string}[];
  return (
    <section className="border-b border-line bg-page py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 className="mb-12 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t("title")}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {principles.map((principle, index) => (
            <TiltCard key={principle.title} className="h-full rounded-2xl">
              <article className="h-full rounded-2xl border border-line bg-surface p-8 sm:p-10">
                <span
                  className={`mb-6 block h-1 w-10 rounded-full ${index % 2 ? "bg-teal" : "bg-brand"}`}
                  aria-hidden="true"
                />
                <h3 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  {principle.title}
                </h3>
                <p className="mt-5 leading-relaxed text-ink-secondary">
                  {principle.description}
                </p>
              </article>
            </TiltCard>
          ))}
        </div>
        <p className="mt-8 max-w-3xl leading-relaxed text-ink-secondary">{t("closing")}</p>
      </div>
    </section>
  );
}

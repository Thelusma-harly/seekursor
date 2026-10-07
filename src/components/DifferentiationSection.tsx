import { useTranslations } from "next-intl";
import { TiltCard } from "./TiltCard";

export function DifferentiationSection() {
  const t = useTranslations("Differentiation");
  return (
    <section className="border-b border-line bg-page py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 md:grid-cols-2">
        <TiltCard className="h-full rounded-2xl">
          <article className="h-full rounded-2xl border border-line bg-surface p-8 sm:p-10">
            <span
              className="mb-6 block h-1 w-10 rounded-full bg-brand"
              aria-hidden="true"
            />
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {t("purposeTitle")}
            </h2>
            <p className="mt-5 leading-relaxed text-ink-secondary">
              {t("purposeDescription")}
            </p>
          </article>
        </TiltCard>
        <TiltCard className="h-full rounded-2xl">
          <article className="h-full rounded-2xl border border-line bg-surface p-8 sm:p-10">
            <span
              className="mb-6 block h-1 w-10 rounded-full bg-teal"
              aria-hidden="true"
            />
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {t("reachTitle")}
            </h2>
            <p className="mt-5 leading-relaxed text-ink-secondary">
              {t("reachDescription")}
            </p>
          </article>
        </TiltCard>
      </div>
    </section>
  );
}

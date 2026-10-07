import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { useSeekursorConfig } from "../../data/seekursorConfig";
import { WhatsAppCTA } from "../WhatsAppCTA";
import type { OpenAcquisition } from "../../lib/acquisition";

export function HeroSection({ onAcquire }: { onAcquire: OpenAcquisition }) {
  const config = useSeekursorConfig();
  const t = useTranslations("Common");
  const hero = useTranslations("Hero");
  const reduce = useReducedMotion();
  const item = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.5 } },
  };
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        show: {
          transition: {
            staggerChildren: reduce ? 0 : 0.15,
            delayChildren: reduce ? 0 : 0.1,
          },
        },
      }}
      className="pointer-events-none relative z-10 mx-auto max-w-5xl px-5 pt-32 pb-[176px] text-center sm:px-8 sm:pt-36 sm:pb-[232px] lg:pt-36 lg:pb-[280px]"
    >
      <motion.p variants={item} className="pointer-events-auto mb-4 text-xs font-semibold uppercase tracking-[.18em] text-brand-ink sm:text-sm">
        {hero("eyebrow")}
      </motion.p>
      <motion.h1
        variants={item}
        className="pointer-events-auto mx-auto max-w-[960px] text-balance font-display text-[2.55rem] font-semibold leading-[1.08] tracking-[-0.045em] text-ink sm:text-6xl lg:text-[4rem]"
      >
        {config.brand.heroHeadline}
      </motion.h1>
      <motion.p
        variants={item}
        className="pointer-events-auto mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-ink-secondary sm:text-lg"
      >
        {config.brand.heroSubtitle}
      </motion.p>
      <motion.div
        variants={item}
        className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <WhatsAppCTA onUnavailable={onAcquire} className="pointer-events-auto inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 font-medium text-white hover:bg-brand-hover sm:w-auto">
          {t("talk")} <ArrowUpRight size={18} aria-hidden="true" />
        </WhatsAppCTA>
        <button type="button" aria-haspopup="dialog" data-acquisition="booking" onClick={event => onAcquire("booking", event.currentTarget)} className="pointer-events-auto inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface px-6 py-3 font-medium text-ink hover:bg-surface-secondary sm:w-auto">
          {t("booking")} <CalendarDays size={17} aria-hidden="true" />
        </button>
      </motion.div>
      <motion.p
        variants={item}
        className="pointer-events-auto mt-6 text-xs text-ink-muted sm:text-sm"
      >
        {hero("baseline")}
      </motion.p>
    </motion.div>
  );
}

import { useTranslations } from "next-intl";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { MessageCircle, Focus, PenTool, CheckCircle2 } from "lucide-react";
import { useSeekursorConfig } from "../data/seekursorConfig";
const cues = [MessageCircle, Focus, PenTool, CheckCircle2];

function BentoCard({ index }: { index: number }) {
  const t = useTranslations("Process");
  const item = useSeekursorConfig().processSteps[index],
    Icon = cues[index];
  const reduce = useReducedMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [2, -2]),
    rotateY = useTransform(x, [-100, 100], [-2, 2]);
  return (
    <motion.article
      className="flex h-full min-h-[230px] flex-col justify-between rounded-2xl border border-line bg-surface p-7 text-ink hover:border-brand/40"
      variants={{
        hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
      style={{
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformPerspective: 900,
      }}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onPointerMove={(event) => {
        if (reduce || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(((event.clientX - rect.left) / rect.width - 0.5) * 100);
        y.set(((event.clientY - rect.top) / rect.height - 0.5) * 100);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <div className="mb-8 flex items-center justify-between">
        <span className="text-xs font-medium tracking-wider text-brand-ink">
          {t("step", {number: item.number})}
        </span>
        <Icon
          size={23}
          strokeWidth={1.5}
          className="text-ink-muted"
          aria-hidden="true"
        />
      </div>
      <div>
        <h3 className="font-display text-2xl font-semibold">{item.title}</h3>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-secondary">
          {item.description}
        </p>
      </div>
    </motion.article>
  );
}
export function BentoGrid() {
  const t = useTranslations("Process");
  return (
    <section
      id="approche"
      className="border-b border-line bg-page py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-brand-ink">
            {t("eyebrow")}
          </p>
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-secondary sm:text-lg">
            {t("description")}
          </p>
        </div>
        <motion.div
          className="grid gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <BentoCard index={0} />
            </div>
            <div className="md:col-span-2">
              <BentoCard index={1} />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <BentoCard index={2} />
            <BentoCard index={3} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
export default BentoGrid;

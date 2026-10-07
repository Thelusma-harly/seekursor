"use client";

import { useEffect, useId, useRef, useState, useTransition, type KeyboardEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "../i18n/navigation";
import { routing, type Locale } from "../i18n/routing";

// Animated dropdown design adapted from @emerald-ui (MIT), supplied by the user.
export function LanguageSelector({onSelect}: {onSelect?: () => void}) {
  const locale = useLocale();
  const t = useTranslations("Common");
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [above, setAbove] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listId = useId();
  const reducedMotion = useReducedMotion();
  const selectedIndex = routing.locales.indexOf(locale as Locale);

  const showOptions = (index = selectedIndex) => {
    const trigger = triggerRef.current;
    if (trigger) {
      const bottom = trigger.closest('[role="dialog"]')?.getBoundingClientRect().bottom ?? window.innerHeight;
      setAbove(Math.min(bottom, window.innerHeight) - trigger.getBoundingClientRect().bottom < 140);
    }
    setActiveIndex(index);
    setOpen(true);
  };
  const closeOptions = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };
  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.focus({preventScroll: true});
  }, [open, activeIndex]);
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  const selectLocale = (nextLocale: Locale) => {
    closeOptions(true);
    onSelect?.();
    if (nextLocale === locale) return;
    startTransition(() => router.replace(pathname + window.location.search + window.location.hash,
      {locale: nextLocale, scroll: false}));
  };
  const handleOptionsKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const lastIndex = routing.locales.length - 1;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeOptions(true);
    } else if (event.key === "Tab") {
      closeOptions();
    } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (event.key === "Home") setActiveIndex(0);
      else if (event.key === "End") setActiveIndex(lastIndex);
      else setActiveIndex(index => (index + (event.key === "ArrowDown" ? 1 : -1) + routing.locales.length) % routing.locales.length);
    } else if (event.key.length === 1 && event.key.trim() && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const index = routing.locales.findIndex(code => t(`languages.${code}`).toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()));
      if (index !== -1) {
        event.preventDefault();
        setActiveIndex(index);
      }
    }
  };
  return (
    <div ref={wrapperRef} data-state={open ? "open" : "closed"}
      className="group relative inline-block shrink-0"
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeOptions();
      }}>
      <button ref={triggerRef} type="button" aria-label={t("language")}
        aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? listId : undefined}
        disabled={pending}
        onClick={() => open ? closeOptions() : showOptions()}
        onKeyDown={event => {
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            showOptions(event.key === "Home" ? 0 : event.key === "End" ? routing.locales.length - 1 : selectedIndex);
          }
        }}
        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-line bg-surface px-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-50">
        <span>{locale.toUpperCase()}</span>
        <motion.span animate={{rotate: open ? 180 : 0}} transition={{duration: reducedMotion ? 0 : 0.2, ease: "easeInOut"}}>
          <ChevronDown size={16} aria-hidden="true" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && <motion.div id={listId} role="listbox" aria-label={t("language")}
          onKeyDown={handleOptionsKey}
          initial={{opacity: 0, y: reducedMotion ? 0 : above ? 10 : -10, scale: reducedMotion ? 1 : 0.95}}
          animate={{opacity: 1, y: 0, scale: 1}}
          exit={{opacity: 0, y: reducedMotion ? 0 : above ? 10 : -10, scale: reducedMotion ? 1 : 0.95}}
          transition={{duration: reducedMotion ? 0 : 0.2, ease: "easeOut"}}
          className={`absolute left-1/2 z-50 w-max min-w-full -translate-x-1/2 overflow-hidden rounded-md border-2 border-slate-200 bg-slate-100 text-ink shadow-lg dark:border-zinc-800 dark:bg-zinc-900 ${above ? "bottom-[calc(100%+0.5rem)]" : "top-[calc(100%+0.5rem)]"}`}>
          <motion.div initial="hidden" animate="visible" variants={{visible: {transition: {staggerChildren: reducedMotion ? 0 : 0.03}}}}>
            {routing.locales.map((code, index) => <motion.button key={code}
              ref={element => {optionRefs.current[index] = element;}}
              type="button" role="option" aria-selected={locale === code} lang={code}
              tabIndex={activeIndex === index ? 0 : -1}
              onFocus={() => setActiveIndex(index)} onClick={() => selectLocale(code)}
              variants={{hidden: {opacity: 0, x: reducedMotion ? 0 : -20}, visible: {opacity: 1, x: 0}}}
              className="block w-full border-b-2 border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm whitespace-nowrap transition-colors duration-150 last:border-b-0 hover:bg-slate-200 focus-visible:bg-slate-200 focus-visible:outline-none aria-selected:bg-slate-200/70 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:focus-visible:bg-zinc-800 dark:aria-selected:bg-zinc-800/70">
              {t(`languages.${code}`)}
            </motion.button>)}
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}

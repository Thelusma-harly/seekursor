import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Menu, Moon, Sun, X, ArrowUpRight } from "lucide-react";
import { useSeekursorConfig } from "../data/seekursorConfig";
import { useTheme } from "../context/ThemeContext";
import { useDialog } from "../hooks/useDialog";
import { BrandLockup } from "./BrandLockup";
import { LanguageSelector } from "./LanguageSelector";
import { Link } from "../i18n/navigation";
import { followSection } from "../lib/sectionNavigation";
import { WhatsAppCTA } from "./WhatsAppCTA";
import type { OpenAcquisition } from "../lib/acquisition";

export function ThemeToggle() {
  const t = useTranslations("Common");
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "light" ? t("darkMode") : t("lightMode")
      }
      className="grid size-10 shrink-0 place-items-center rounded-full text-ink-secondary hover:bg-surface-secondary"
    >
      {theme === "light" ? (
        <Moon size={18} aria-hidden="true" />
      ) : (
        <Sun size={18} aria-hidden="true" />
      )}
    </button>
  );
}

export function Navbar1({
  onAcquire,
}: {
  onAcquire: OpenAcquisition;
}) {
  const t = useTranslations();
  const config = useSeekursorConfig();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  useDialog(open, () => setOpen(false), panelRef);
  useEffect(() => {
    const close = () => setOpen(false);
    const desktop = window.matchMedia("(min-width: 1024px)");
    const resize = () => {
      if (desktop.matches) close();
    };
    window.addEventListener("popstate", close);
    window.addEventListener("hashchange", close);
    desktop.addEventListener("change", resize);
    return () => {
      window.removeEventListener("popstate", close);
      window.removeEventListener("hashchange", close);
      desktop.removeEventListener("change", resize);
    };
  }, []);
  const followLink = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    setOpen(false);
    followSection(event, href);
  };
  return (
    <>
      <header className="fixed inset-x-0 top-4 z-50 px-4 sm:px-6">
        <nav
          aria-label={t("Navigation.primary")}
          className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl border border-line bg-surface/95 px-4 py-2 shadow-sm backdrop-blur-xl"
        >
          <Link href="/#accueil" onClick={event => followLink(event, "#accueil")} aria-label={t("Navigation.brandHome")} className="inline-flex items-center">
            <BrandLockup className="[&>span]:text-xl [&>span]:leading-none" />
          </Link>
          <div className="hidden items-center gap-5 lg:flex">
            {config.navLinks.map((link) => (
              <Link
                key={link.href}
                href={"/" + link.href}
                onClick={event => followLink(event, link.href)}
                className="text-sm font-medium text-ink-secondary hover:text-brand-ink"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <div className="hidden lg:block"><LanguageSelector /></div>
            <WhatsAppCTA onUnavailable={onAcquire} className="hidden rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-hover lg:block">{t("Common.talk")}</WhatsAppCTA>
            <button
              type="button"
              aria-label={t("Navigation.open")}
              ref={menuTriggerRef}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
              className="grid size-10 place-items-center rounded-full text-ink hover:bg-surface-secondary lg:hidden"
            >
              <Menu size={21} />
            </button>
          </div>
        </nav>
      </header>
      {open && createPortal(
        <>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[70]"
            >
              <div
                onClick={() => setOpen(false)}
                className="absolute inset-0 bg-black/45 backdrop-blur-sm"
                aria-hidden="true"
              />
              <motion.div
                id="mobile-menu"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={t("Navigation.menu")}
                tabIndex={-1}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-y-0 right-0 flex w-[min(88vw,380px)] flex-col overflow-y-auto overscroll-contain border-l border-line bg-surface p-5 text-ink"
              >
                <div className="flex items-center justify-between gap-2">
                  <BrandLockup />
                  <button
                    type="button"
                    aria-label={t("Navigation.close")}
                    onClick={() => setOpen(false)}
                    className="grid size-10 place-items-center rounded-full hover:bg-surface-secondary"
                  >
                    <X size={21} />
                  </button>
                </div>
                <nav
                  aria-label={t("Navigation.mobile")}
                  className="my-10 flex flex-col gap-2"
                >
                  {config.navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={"/" + link.href}
                      onClick={(event) => followLink(event, link.href)}
                      className="rounded-xl px-3 py-4 font-display text-xl hover:bg-surface-secondary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto space-y-5">
                  <WhatsAppCTA onNavigate={() => setOpen(false)} onUnavailable={(channel, _trigger, context) => {
                      setOpen(false);
                      onAcquire(channel, menuTriggerRef.current ?? undefined, context);
                    }} className="flex w-full items-center justify-between gap-3 rounded-xl bg-brand px-4 py-4 font-medium text-white hover:bg-brand-hover">{t("Common.talk")} <ArrowUpRight size={18} /></WhatsAppCTA>
                  <div className="flex items-center justify-between border-t border-line pt-4">
                    <span className="text-sm text-ink-secondary">
                      {t("Common.appearance")}
                    </span>
                    <ThemeToggle />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ink-secondary">{t("Common.language")}</span>
                    <LanguageSelector onSelect={() => setOpen(false)} />
                  </div>
                  <p className="text-xs text-ink-muted">
                    {config.brand.baseline}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>,
        document.body,
      )}
    </>
  );
}

"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  House,
  Layers3,
  GalleryHorizontalEnd,
  Route,
  UserRound,
  Moon,
  Sun,
} from "lucide-react";
import { useSeekursorConfig } from "../data/seekursorConfig";
import { useTheme } from "../context/ThemeContext";
import { BrandLockup } from "./BrandLockup";
import { LanguageSelector } from "./LanguageSelector";
import { Link } from "../i18n/navigation";
import { followSection } from "../lib/sectionNavigation";
import { cn } from "@/lib/utils";

const icons = [House, Layers3, GalleryHorizontalEnd, Route, UserRound];
export function ThemeToggle() {
  const t = useTranslations("Common");
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === "light" ? Moon : Sun;
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "light" ? t("darkMode") : t("lightMode")}
      className="theme-toggle"
    >
      <Icon size={17} aria-hidden="true" />
    </button>
  );
}
export function Navbar1() {
  const t = useTranslations();
  const { navLinks } = useSeekursorConfig();
  const [active, setActive] = useState("#accueil");
  const reduce = useReducedMotion();
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter((item): item is Element => Boolean(item));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length)
          setActive("#" + visible[visible.length - 1].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    const syncHash = () => {
      if (navLinks.some((link) => link.href === location.hash))
        setActive(location.hash);
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, [navLinks.map((link) => link.href).join("|")]);
  return (
    <>
      <header className="site-header">
        <Link
          href="/#accueil"
          onClick={(event) => {
            setActive("#accueil");
            followSection(event, "#accueil");
          }}
          aria-label={t("Navigation.brandHome")}
          className="header-brand"
        >
          <BrandLockup />
        </Link>
        <div className="header-controls">
          <ThemeToggle />
          <LanguageSelector />
        </div>
      </header>
      <nav aria-label={t("Navigation.primary")} className="lamp-nav">
        {navLinks.map((link, index) => {
          const Icon = icons[index];
          const selected = active === link.href;
          return (
            <Link
              key={link.href}
              href={"/" + link.href}
              aria-label={link.label}
              title={link.label}
              aria-current={selected ? "location" : undefined}
              onClick={(event) => {
                setActive(link.href);
                followSection(event, link.href);
              }}
              className={cn("lamp-link", selected && "is-active")}
            >
              <Icon
                className="nav-icon"
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span className="nav-label">{link.label}</span>
              {selected && (
                <motion.span
                  className="nav-active"
                  layoutId={reduce ? undefined : "seekursor-lamp"}
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 32,
                    duration: reduce ? 0 : undefined,
                  }}
                  aria-hidden="true"
                >
                  <span className="nav-lamp" />
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

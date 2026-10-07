"use client";

import { useTranslations } from "next-intl";
import restaurantImage from "../assets/images/showcase_restaurant_1791226109241.jpg";
import businessImage from "../assets/images/showcase_business_1791226120501.jpg";
import catalogueImage from "../assets/images/showcase_menu_catalog_1791226129424.jpg";
import workspaceImage from "../assets/images/founder_workspace.jpg";
import { siteConfig } from "./siteConfig";

export interface ServiceItem {
  title: string; subtitle: string; description: string; features: string[];
}
export interface ProjectItem {
  id: string; title: string; category: string;
  description: string; longDescription: string; image: string; features: string[];
}
const navigation = [
  {key: "home", href: "#accueil"}, {key: "services", href: "#services"},
  {key: "projects", href: "#realisations"}, {key: "approach", href: "#approche"},
  {key: "about", href: "#a-propos"},
] as const;
const projects = [
  {id: "restaurant-experience", image: restaurantImage.src},
  {id: "business-local", image: businessImage.src},
  {id: "catalogue-menu", image: catalogueImage.src},
];

export function useSeekursorConfig() {
  const t = useTranslations();
  const translatedProjects = t.raw("Projects.items") as Omit<ProjectItem, "id" | "image">[];
  return {
    brand: {name: siteConfig.name, logo: siteConfig.logo, description: t("Footer.description"),
      heroHeadline: t("Hero.title"), heroSubtitle: t("Hero.description"), baseline: t("Common.baseline")},
    contact: siteConfig,
    founder: {name: siteConfig.founderName, image: workspaceImage.src, role: t("Founder.role"),
      statement1: t("Founder.statement1"), statement2: t("Founder.statement2")},
    navLinks: navigation.map(link => ({...link, label: t(`Navigation.${link.key}`)})),
    services: t.raw("Services.items") as ServiceItem[],
    processSteps: (t.raw("Process.items") as {title: string; description: string}[])
      .map((step, index) => ({...step, number: String(index + 1).padStart(2, "0")})),
    projects: projects.map((project, index) => ({...translatedProjects[index], ...project})),
  };
}

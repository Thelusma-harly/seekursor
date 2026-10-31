"use client";

import { useTranslations } from "next-intl";
import { acquisitionConfig, createWhatsAppLink } from "../data/acquisitionConfig";
import { siteConfig } from "../data/siteConfig";
import type { OpenAcquisition } from "../lib/acquisition";
import { SocialTooltip, type SocialItem, type SocialTooltipProps } from "./SocialTooltip";

export function ContactSocialLinks({ onAcquire, ...props }: Omit<SocialTooltipProps, "items"> & { onAcquire: OpenAcquisition }) {
  const t = useTranslations();
  const message = t("WhatsApp.default");
  const items: SocialItem[] = [
    { href: siteConfig.instagramUrl, ariaLabel: t("Social.instagram"), tooltip: "Instagram", svgUrl: "/icons/social/instagram.svg", color: "#C13584" },
    { href: siteConfig.tiktokUrl, ariaLabel: t("Social.tiktok"), tooltip: "TikTok", svgUrl: "/icons/social/tiktok.svg", color: "#111827", darkColor: "#000000" },
    ...(acquisitionConfig.whatsappNumber ? [{ href: `tel:+${acquisitionConfig.whatsappNumber}`, ariaLabel: t("Social.phone", {number: siteConfig.phoneLabel}), tooltip: siteConfig.phoneLabel, svgUrl: "/icons/social/phone.svg", color: "#2563EB" }] : []),
    { href: createWhatsAppLink({ message }), ariaLabel: t("Social.whatsapp"), tooltip: "WhatsApp", svgUrl: "/icons/social/whatsapp.svg", color: "#128C4A",
      onActivate: trigger => onAcquire("whatsapp", trigger, message) },
  ];
  return <SocialTooltip items={items} aria-label={t("Social.contacts")} {...props} />;
}

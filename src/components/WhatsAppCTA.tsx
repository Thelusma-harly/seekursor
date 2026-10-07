import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { createWhatsAppLink } from "../data/acquisitionConfig";
import type { OpenAcquisition } from "../lib/acquisition";

export function WhatsAppCTA({ children, className, message, onUnavailable, onNavigate }: {
  children: ReactNode;
  className: string;
  message?: string;
  onUnavailable: OpenAcquisition;
  onNavigate?: () => void;
}) {
  const t = useTranslations("WhatsApp");
  const localizedMessage = message ?? t("default");
  const href = createWhatsAppLink({ message: localizedMessage });
  if (href) return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onNavigate}
      data-acquisition="whatsapp">{children}</a>
  );
  return (
    <button type="button" className={className} data-acquisition="whatsapp" aria-haspopup="dialog"
      onClick={event => onUnavailable("whatsapp", event.currentTarget, localizedMessage)}>{children}</button>
  );
}

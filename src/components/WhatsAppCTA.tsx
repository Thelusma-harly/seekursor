import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { createWhatsAppLink } from "../data/acquisitionConfig";
import type { OpenAcquisition } from "../lib/acquisition";
import { cn } from "@/lib/utils";
import { CubeFaces, type CubeVariant } from "./ui/CubeButton";

export function WhatsAppCTA({
  children,
  className,
  message,
  onUnavailable,
  onNavigate,
  variant = "primary",
}: {
  children: ReactNode;
  className: string;
  message?: string;
  onUnavailable: OpenAcquisition;
  onNavigate?: () => void;
  variant?: CubeVariant;
}) {
  const t = useTranslations("WhatsApp");
  const localizedMessage = message ?? t("default");
  const href = createWhatsAppLink({ message: localizedMessage });
  if (href)
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("cube-button", className)}
        data-variant={variant}
        onClick={onNavigate}
        data-acquisition="whatsapp"
      >
        <CubeFaces>{children}</CubeFaces>
      </a>
    );
  return (
    <button
      type="button"
      className={cn("cube-button", className)}
      data-variant={variant}
      data-acquisition="whatsapp"
      aria-haspopup="dialog"
      onClick={(event) =>
        onUnavailable("whatsapp", event.currentTarget, localizedMessage)
      }
    >
      <CubeFaces>{children}</CubeFaces>
    </button>
  );
}

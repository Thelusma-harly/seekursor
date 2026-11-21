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
  appearance = "tactile",
}: {
  children: ReactNode;
  className: string;
  message?: string;
  onUnavailable: OpenAcquisition;
  onNavigate?: () => void;
  variant?: CubeVariant;
  appearance?: "tactile" | "velour";
}) {
  const t = useTranslations("WhatsApp");
  const localizedMessage = message ?? t("default");
  const href = createWhatsAppLink({ message: localizedMessage });
  const buttonClass = cn(
    appearance === "velour" ? "hero-velour-cta" : "cube-button tactile-button",
    className,
  );
  const content =
    appearance === "velour" ? children : <CubeFaces>{children}</CubeFaces>;
  if (href)
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        data-variant={variant}
        onClick={onNavigate}
        data-acquisition="whatsapp"
      >
        {content}
      </a>
    );
  return (
    <button
      type="button"
      className={buttonClass}
      data-variant={variant}
      data-acquisition="whatsapp"
      aria-haspopup="dialog"
      onClick={(event) =>
        onUnavailable("whatsapp", event.currentTarget, localizedMessage)
      }
    >
      {content}
    </button>
  );
}

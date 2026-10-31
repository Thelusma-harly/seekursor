import { siteConfig } from "../data/siteConfig";
import { cn } from "@/lib/utils";

const logoSources = (url: string) => [40, 80, 120, 256]
  .map(width => `${url.replace(".png", `-${width}.webp`)} ${width}w`).join(", ");

export function BrandLockup({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center gap-2.5", className)}
    >
      <img
        src={siteConfig.logo}
        srcSet={logoSources(siteConfig.logo)}
        sizes="(min-width: 640px) 40px, 36px"
        alt="Seekursor logo"
        width="40"
        height="40"
        decoding="async"
        className="block size-9 shrink-0 object-contain sm:size-10 dark:hidden"
      />
      <img
        src={siteConfig.logoDark}
        srcSet={logoSources(siteConfig.logoDark)}
        sizes="(min-width: 640px) 40px, 36px"
        alt="Seekursor logo"
        width="40"
        height="40"
        decoding="async"
        className="hidden size-9 shrink-0 object-contain sm:size-10 dark:block"
      />
      <span className="font-display text-lg font-semibold tracking-tight text-ink">
        Seekursor
      </span>
    </span>
  );
}

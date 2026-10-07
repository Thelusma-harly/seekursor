import { siteConfig } from "../data/siteConfig";
import { cn } from "@/lib/utils";

export function BrandLockup({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center gap-2.5", className)}
    >
      <img
        src={siteConfig.logo}
        alt=""
        width="54"
        height="36"
        className="h-9 w-[54px] shrink-0 object-contain"
      />
      <span className="font-display text-lg font-semibold tracking-tight text-ink">
        Seekursor
      </span>
    </span>
  );
}

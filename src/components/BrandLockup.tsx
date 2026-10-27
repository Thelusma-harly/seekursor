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
        width="76"
        height="40"
        decoding="async"
        className="h-9 w-16 shrink-0 rounded-lg bg-[#030615] object-contain p-1 max-[360px]:w-14 sm:h-10 sm:w-[76px]"
      />
      <span className="font-display text-lg font-semibold tracking-tight text-ink">
        Seekursor
      </span>
    </span>
  );
}

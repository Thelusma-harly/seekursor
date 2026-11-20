import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Glass Icon's layered, refractive treatment adapted to CSS for small repeated icons.
export function GlassIcon({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={cn("glass-icon", className)}>
      <span className="glass-icon-plate" />
      <span className="glass-icon-face">
        <Icon size={23} strokeWidth={1.6} />
      </span>
    </span>
  );
}

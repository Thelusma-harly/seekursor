"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

// The supplied Notched Project Card's concentric cut and two rounded fillets.
// A native button opens the site's existing project dialog, rather than a link
// to an invented project URL. Photos stay in color in every interaction state.
export function NotchedProjectCover({
  image,
  imageAlt,
  label,
  badge,
  onOpen,
}: {
  image: string;
  imageAlt: string;
  label: string;
  badge: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className="notched-project-cover"
      onClick={onOpen}
      aria-label={label}
      aria-haspopup="dialog"
    >
      <span className="notched-project-photo">
        <Image
          src={image}
          alt={imageAlt}
          loading="lazy"
          width={1024}
          height={768}
          sizes="(min-width: 1400px) 420px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, calc(100vw - 84px)"
        />
        <span className="notched-project-badge">{badge}</span>
      </span>
      <span className="notched-project-cut" aria-hidden="true" />
      <span
        className="notched-project-fillet fillet-right"
        aria-hidden="true"
      />
      <span
        className="notched-project-fillet fillet-bottom"
        aria-hidden="true"
      />
      <span className="notched-project-disc" aria-hidden="true">
        <ArrowUpRight size={23} />
      </span>
    </button>
  );
}

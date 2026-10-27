import { siteConfig } from "../data/siteConfig";

// Fail a misconfigured build rather than publishing HTTP or staging canonicals.
export function publicOrigin(value = siteConfig.domain): string {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password ||
      url.pathname !== "/" || url.search || url.hash) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTPS origin without a path, query or credentials.");
  }
  return url.origin;
}

// Update only when these pages materially change; never use the build/request time.
export const contentLastModified = "2026-10-26";

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const nextConfig: NextConfig = {
  devIndicators: false,
  // The root layout lives under [locale]; unmatched paths need a routing-level 404.
  experimental: { globalNotFound: true },
};
export default withNextIntl(nextConfig);

import { Inter, Space_Grotesk } from "next/font/google";

// Same families and weights as the original Google stylesheet, self-hosted at build time.
export const inter = Inter({
  subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"],
  display: "swap", variable: "--font-inter",
});
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"],
  display: "swap", variable: "--font-space-grotesk",
});

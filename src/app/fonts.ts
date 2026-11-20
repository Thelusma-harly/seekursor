import localFont from "next/font/local";

// Same families and weights, vendored as WOFF2. No Google request during builds.
// The Latin subset includes French / Haitian Creole accents and punctuation.
export const inter = localFont({
  src: "../assets/fonts/inter-latin-variable.woff2",
  weight: "400 600",
  display: "swap",
  variable: "--font-inter",
});
export const spaceGrotesk = localFont({
  src: "../assets/fonts/space-grotesk-latin-variable.woff2",
  weight: "400 700",
  display: "swap",
  variable: "--font-space-grotesk",
});

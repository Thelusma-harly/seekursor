// Public business values are shared by metadata and client components.
export const siteConfig = {
  name: "Seekursor",
  logo: "/brand/seekursor-mark-light.png",
  logoDark: "/brand/seekursor-mark-dark.png",
  founderName: "Harly Thelusma",
  phoneLabel: "+509 47 10 94 01",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
  // Public brand identities are versioned here so an old deployment env value cannot restore a personal profile.
  instagramUrl: "https://www.instagram.com/seekursor/",
  tiktokUrl: "https://www.tiktok.com/@seekursor",
  domain: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://seekursor.vercel.app",
};

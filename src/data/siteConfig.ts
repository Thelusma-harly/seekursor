// Public business values are shared by metadata and client components.
export const siteConfig = {
  name: "Seekursor",
  logo: "/brand-symbol.png",
  founderName: "Harly Thelusma",
  phoneLabel: "+509 47 10 94 01",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || "",
  domain: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "",
};

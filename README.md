# Seekursor

French, English and Haitian Creole landing page for a founder-led digital solutions agency, built with Next.js App Router, next-intl, React, TypeScript and Tailwind CSS.

The page introduces Seekursor through the customer journey, five service categories, scope-based pricing, examples, approach, four working principles and the founder. Social media planning and publishing is scoped as one-time or recurring support; AI is a capability used when appropriate. The complete localized copy is exported in `docs/copy/`.

## Local development

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:3000. First visits redirect to `/fr`, regardless of browser language. Explicit selections persist through next-intl's `NEXT_LOCALE` cookie. `/fr`, `/en` and `/ht` share the same page and components.

## Validation

```sh
npm run lint
npm run build
npm run test:acquisition
npm run test:i18n
npm run test:seo
```

See [the technical SEO audit](docs/seo-audit.md) for all 27 checks, measured results, missing owner inputs and manual indexing steps. With the production server running, verify the served output using `node scripts/verify-seo.mjs http://localhost:3000`.

## Acquisition channels

WhatsApp is the primary route, Cal.com handles discovery-call booking and Tally handles project inquiries. The supplied public destinations are configured in `.env.local` and `.env.example`. Missing values still open clear availability dialogs.

See [acquisition setup](docs/acquisition-setup.md) for configuration, account setup, Tally fields and final live checks. Run `npm run test:acquisition` to check destination validation, message encoding and attribution privacy.

## Brand and presentation

The approved circular aperture-and-cursor mark comes from `LastVersionLogo.png`. The shared brand lockup uses transparent black/light-mode and white/dark-mode variants in `public/brand/seekursor-mark-{light,dark}.png`; CSS follows the site's existing manual theme preference before paint. The blue iris is retained in both modes, with no background badge. Dedicated `seekursor-icon-*` PNGs, `seekursor-favicon.ico` and an Apple touch icon use the same mark. Root favicon aliases are also updated. Headings use Space Grotesk; body and UI use Inter. Theme tokens are in `src/index.css`. Translation files supply content through `src/data/seekursorConfig.ts` and next-intl.

Original-size transparent exports and their imagegen prompts are saved beside the approved source in the agency project's `output/imagegen/` folder as `LastVersionLogo-light-transparent.png`, `LastVersionLogo-dark-transparent.png` and `LastVersionLogo-variants.prompt.json`. The original file is preserved. Web exports can be regenerated from the checked-in PNG pair with `node scripts/prepare-brand-assets.cjs public/brand/seekursor-mark-light.png public/brand/seekursor-mark-dark.png`; the existing Sharp dependency applies one shared crop, lossless responsive WebP encoding and icon sizing.

The official Instagram (`https://www.instagram.com/seekursor/`) and TikTok (`https://www.tiktok.com/@seekursor`) contact references are maintained in `src/data/siteConfig.ts` and shared by footer links and Organization schema. Historical `NEXT_PUBLIC_INSTAGRAM_URL` environment values no longer override these public brand identities. WhatsApp, booking and project inquiry destinations retain their existing configuration and hierarchy.

The footer uses one icon-only contact row (Instagram, TikTok, phone and WhatsApp), with 48px circular targets, 28px local SVGs and hover/keyboard tooltips. `SocialTooltip` follows the supplied rising-color design, with explicit image filtering so icons turn white correctly in either theme. The same row appears in a fixed bottom-right panel; an IntersectionObserver hides it whenever the footer intersects the viewport and restores it when the footer leaves. The hidden panel is inert, and project/acquisition dialogs suspend it. Floating tooltips open upward to stay inside the viewport; Escape dismisses tooltips and reduced-motion preferences are honored. WhatsApp still uses the centralized localized helper and its unavailable-dialog fallback. Platform SVGs are vendored from Simple Icons (CC0); the phone SVG is the existing Lucide icon.

Regenerate the three localized 1200×630 share cards with `node scripts/prepare-social-images.cjs`. Metadata and the Organization/WebSite graph share `src/lib/seo.ts`; the graph appears once in the locale layout head. Only known public business facts are included. No verification tags are emitted without supplied Google/Bing tokens.

`next/font` self-hosts the original Inter/Space Grotesk families with `display: swap`; browsers no longer wait for an external font stylesheet. Founder/example photos use `next/image` for responsive WebP delivery and retain their existing dimensions, loading behavior and cropping. The small above-fold logo remains eager and uses lossless WebP size variants, with the original PNG as fallback.

Light mode is the default. A manual preference persists under `seekursor-theme` and is applied before first paint. Locale and theme operate independently. The Cobe 0.6.5 globe retains the supplied onRender and pointer-drag rendering model. Reduced motion stops automatic grid and globe movement.

## Translations and production

Approved French copy is stored in `messages/fr.json`; English and Haitian Creole are in matching files. All page copy, accessibility labels, metadata and WhatsApp messages use these local messages. No translation service runs in the browser. Third-party Cal.com and Tally interfaces retain their provider-managed language and account settings.

`src/i18n/routing.ts`, `navigation.ts`, `request.ts` and `src/proxy.ts` configure next-intl. The locale layout/page use Next.js 16.4 root params and `generateStaticParams` to prerender all three landing pages. The language control uses an animated, keyboard-accessible dropdown, with compact FR/EN/HT indicators and native language names.

`NEXT_PUBLIC_SITE_URL` defaults to the verified production origin, `https://seekursor.vercel.app`, including when the environment value is empty. Override it only with a verified HTTPS origin (no path or query). Canonicals, language alternates, schema, robots and the sitemap share this value. Keep the other public destinations in `.env.local`; the prefix is `NEXT_PUBLIC_`, replacing Vite's `VITE_` prefix. Never put secrets in public environment variables.

Next.js generates `/robots.txt` and `/sitemap.xml`. Only `/fr`, `/en` and `/ht` are canonical pages; `/` redirects to a locale, and section anchors are not separate pages. Update `contentLastModified` in `src/lib/seo.ts` when page content or structured data materially changes, not on every build. A routing-level 404 supports the dynamic locale root layout.

Language alternate URLs are emitted by the Metadata API and sitemap. next-intl's request-host-derived `Link` response header is disabled to keep one consistent canonical origin and `x-default` destination.

After `npm run build`, run `npm run start` to serve the production build on port 3000. Development also uses only port 3000; Next.js exits if it is already occupied.

The lockfile pins next-intl's compatible SWC compiler dependency to 1.16.0. Later compressed Windows native carriers rejected this computer's shared-cache permissions. This pin avoids changing security permissions; Next.js and next-intl themselves use their current compatible releases.

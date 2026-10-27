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

The approved eye-and-cursor logo is stored in `public/brand/seekursor-eye.png`, trimmed and encoded losslessly from the supplied transparent PNG. The shared brand lockup gives its white cursor a compact navy backing for contrast in both themes. Dedicated PNG/ICO favicons and an Apple touch icon live in the same folder. Regenerate these assets with `node scripts/prepare-brand-assets.cjs <path-to-approved-transparent-png>`; this uses the existing Sharp dependency and preserves the source logo colors. Headings use Space Grotesk; body and UI use Inter. Theme tokens are in `src/index.css`. Translation files supply content through `src/data/seekursorConfig.ts` and next-intl.

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

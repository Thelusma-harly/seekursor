# Seekursor

French, English and Haitian Creole landing page for a founder-led digital solutions studio, built with Next.js App Router, next-intl, React, TypeScript and Tailwind CSS.

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
```

## Acquisition channels

WhatsApp is the primary route, Cal.com handles discovery-call booking and Tally handles project inquiries. The supplied public destinations are configured in `.env.local` and `.env.example`. Missing values still open clear availability dialogs.

See [acquisition setup](docs/acquisition-setup.md) for configuration, account setup, Tally fields and final live checks. Run `npm run test:acquisition` to check destination validation, message encoding and attribution privacy.

## Brand and presentation

The supplied symbol is kept unchanged in `public/brand-symbol.png`. Headings use Space Grotesk; body and UI use Inter. Theme tokens are in `src/index.css`. Translation files supply content through `src/data/seekursorConfig.ts` and next-intl.

Light mode is the default. A manual preference persists under `seekursor-theme` and is applied before first paint. Locale and theme operate independently. The Cobe 0.6.5 globe retains the supplied onRender and pointer-drag rendering model. Reduced motion stops automatic grid and globe movement.

## Translations and production

Approved French copy is stored in `messages/fr.json`; English and Haitian Creole are in matching files. All page copy, accessibility labels, metadata and WhatsApp messages use these local messages. No translation service runs in the browser. Third-party Cal.com and Tally interfaces retain their provider-managed language and account settings.

`src/i18n/routing.ts`, `navigation.ts`, `request.ts` and `src/proxy.ts` configure next-intl. The locale layout/page use Next.js 16.4 root params and `generateStaticParams` to prerender all three landing pages. The language control uses an animated, keyboard-accessible dropdown, with compact FR/EN/HT indicators and native language names.

`NEXT_PUBLIC_SITE_URL` is intentionally empty until the public domain is decided. Set it to the verified production origin before deployment so canonical and alternate URLs resolve to that domain and social preview images are enabled. Keep the other public destinations in `.env.local`; the prefix is now `NEXT_PUBLIC_`, replacing Vite's `VITE_` prefix. Never put secrets in public environment variables.

After `npm run build`, run `npm run start` to serve the production build on port 3000. Development also uses only port 3000; Next.js exits if it is already occupied.

The lockfile pins next-intl's compatible SWC compiler dependency to 1.16.0. Later compressed Windows native carriers rejected this computer's shared-cache permissions. This pin avoids changing security permissions; Next.js and next-intl themselves use their current compatible releases.

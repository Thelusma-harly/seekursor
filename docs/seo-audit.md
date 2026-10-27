# Seekursor technical SEO audit

Audited 26 October 2026 (America/Port-au-Prince). Work is local on `seo-audit`; nothing was pushed, deployed or changed in Vercel. This improves crawlability and identity signals; it cannot guarantee a Google ranking, favicon display or knowledge panel.

## Discovery and verified inputs

- Next.js **16.4.0**, App Router, React 19, TypeScript and next-intl 4.14.9. `generateStaticParams` prerenders the landing page in French (`/fr`), English (`/en`) and Haitian Creole (`/ht`). Client components hydrate existing interactions; main content is already in initial HTML.
- Those three URLs are the only public indexable pages. `/` redirects once to French for new visitors, or to the language selected in the existing locale cookie. Section anchors, dialogs, provider forms and 404 pages are not extra canonical pages.
- Metadata uses `src/app/[locale]/page.tsx` and `src/lib/seo.ts`; the root locale layout is `src/app/[locale]/layout.tsx`. It sets HTML language, font variables, theme initialization and the head JSON-LD graph. No generic head manipulation or rendering migration was needed.
- Production origin: **https://seekursor.vercel.app**. No custom domain assumed. Empty `NEXT_PUBLIC_SITE_URL` now uses this verified origin; a nonempty override must be a valid HTTPS origin.
- Known facts reused: Seekursor, digital solutions agency for businesses, founder Harly Thelusma, Haiti service context, telephone **+50947109401**, and the site's supplied Instagram URL **https://www.instagram.com/th_harly2.0/**. Email and verification tokens were not supplied and are omitted. No street address, reviews, ratings, awards or additional social identities were invented.

## All 27 checks

`PASS` means the requirement was already satisfied; `FIXED` means a targeted local change was made. `NEEDS INPUT` means information was not supplied. All successful new HTTP checks refer to the local **production build**, not an already updated live deployment.

| # | Status | Finding / change | Files changed for this check |
|---|---|---|---|
| 1 | PASS | Repository/config scan and HTML/header checks found no production indexing block. Framework 404 `noindex` is correct and retained. | None |
| 2 | PASS | All three locales contain the complete main content in initial HTML; existing SSG preserved. | None for rendering |
| 3 | FIXED | Root robots route allows crawling and declares the absolute production sitemap. Previously 404 locally and live. | `src/app/robots.ts` |
| 4 | FIXED | Native sitemap includes exactly three absolute HTTPS canonical URLs, reciprocal language alternates and stable lastmod `2026-10-26`. It excludes root redirects and utilities. Previously 404. | `src/app/sitemap.ts`, `src/lib/seo.ts` |
| 5 | FIXED | Missing URLs retain real HTTP 404 and now offer helpful return links in the three languages. Routing-level handling supports the dynamic locale root layout. | `src/app/global-not-found.tsx`, `next.config.ts` |
| 6 | PASS | Canonical routes return 200 directly. Root and trailing-slash variants normalize in one hop; no loops/chains on audited URLs. | None |
| 7 | PASS | Navigation uses real anchors. Every internal page/fragment destination in the three initial HTML responses resolves. Booking/inquiry controls remain dialog buttons. | None |
| 8 | FIXED | Three distinct localized brand titles, all below 60 characters. English uses `Seekursor \| Digital Solutions Agency`. | `messages/{fr,en,ht}.json`, `src/app/[locale]/page.tsx`, `src/lib/seo.ts`, `docs/copy/landing-page.{fr,en,ht}.md` |
| 9 | FIXED | Natural localized descriptions are 157 / 150 / 147 characters (FR / EN / HT). Visible copy was not rewritten. | Same metadata/catalogue/export files as #8 |
| 10 | FIXED | Previously relative canonicals now resolve to the verified HTTPS origin. Configuration validates origin format. | `src/data/siteConfig.ts`, `src/lib/seo.ts`, `.env.example` |
| 11 | FIXED | Correct HTML language retained; absolute reciprocal hreflang links and `x-default` to `/fr` added. Duplicate request-host-derived middleware Link headers disabled. | `src/lib/seo.ts`, `src/i18n/routing.ts` |
| 12 | PASS | Next.js emits UTF-8 charset and the correct device-width/initial-scale viewport. | None |
| 13 | PASS | Exactly one H1 per canonical page, with the main topic and a logical H2/H3 hierarchy. | None |
| 14 | PASS | Seekursor is visible text; existing copy identifies the agency, business audience, Haiti context and contact routes. | None |
| 15 | FIXED | Complete localized OG metadata, absolute page/image URLs, site name and Twitter `summary_large_image`. | `src/lib/seo.ts`, `src/app/[locale]/page.tsx` |
| 16 | FIXED | Three crawlable localized 1200×630 PNG share cards created from the approved logo/palette. Dimensions and HTTP 200 verified. | `scripts/prepare-social-images.cjs`, `public/og/seekursor-{fr,en,ht}.png` |
| 17 | FIXED | One head JSON-LD graph with Organization + WebSite, stable absolute IDs, 512×512 logo, known telephone/founder/service area and only the existing linked Instagram identity. Missing email omitted. Previous incomplete body ProfessionalService graph removed. JSON round-trip and script escaping tested. | `src/lib/seo.ts`, `src/app/[locale]/{layout,page}.tsx`, `tests/seo.test.ts` |
| 18 | PASS | Existing ICO contains a 48×48 entry and Apple icon is valid. Their bytes are unchanged; metadata now explicitly references the existing 48px PNG as well. Assets return 200. | References centralized in `src/lib/seo.ts`; no icon asset changes |
| 19 | FIXED | Brand images now have the requested `Seekursor logo` alt. Existing meaningful photo descriptions remain localized; decorative globe/icons retain their existing decorative semantics. | `src/components/BrandLockup.tsx` |
| 20 | NEEDS INPUT | No Google/Bing token supplied; no empty or fabricated verification tag added. | None |
| 21 | PASS | Existing footer Instagram is a real anchor and matches schema `sameAs`; public telephone matches schema. Additional profiles were not invented. | None for footer/social destination |
| 22 | PASS | Live HTTP → HTTPS 308 verified. No HTTP script/style/image resource in the three production HTML responses. Schema/metadata/sitemap URLs use HTTPS. | None for transport |
| 23 | FIXED | Founder, previews and opened project modal use responsive Next Image/WebP with explicit dimensions. Below-fold photos remain lazy; modal photo loads eagerly on opening. Header logo is eager with lossless responsive WebP copies and PNG fallback. Existing cropping/sizing retained. | `src/components/{FounderSection,SelectedWorkSection,ProjectModal,BrandLockup}.tsx`, `scripts/prepare-brand-assets.cjs`, `public/brand/seekursor-eye-{76,152,228,415}.webp` |
| 24 | FIXED | Original Inter/Space Grotesk families/weights self-hosted with next/font and swap. External render-blocking Google stylesheet/preconnects removed. Essential local CSS retained. | `src/app/fonts.ts`, `src/app/[locale]/layout.tsx`, `src/app/global-not-found.tsx`, `src/index.css` |
| 25 | PASS | No clearly unused heavy network script identified. Cal/Tally remain interaction-loaded. Cobe/Framer are used by existing visuals and deliberately retained. | No dependency removals/upgrades |
| 26 | PASS | Desktop 1280px and mobile 390px/320px checked; no horizontal overflow. Main body text 16px, mobile header controls 40px with spacing, primary CTAs at least 48px high. Theme, language picker, loaded photos and project modal verified. | No layout/UI changes |
| 27 | FIXED | Production build, TypeScript, 27 unit tests, full response checks and before/final Lighthouse completed. Remaining LCP/interaction risks are recorded below. | `tests/seo.test.ts`, `tests/i18n.test.ts`, `scripts/verify-seo.mjs`, `package.json`, this report |

## Measured results and remaining performance risks

Lighthouse **13.5.0**, Chrome headless, default mobile simulation/throttling, identical four-category CLI configuration, local production URL `http://localhost:3000/fr`. These are single-run lab measurements, not live Vercel/CrUX field results; normal variance applies. The final run had no Lighthouse warnings. An intermediate run before the logo right-sizing scored 66 Performance; the table uses the actual final build.

| Category | Before | Final |
|---|---:|---:|
| Performance | 39 | 67 |
| SEO | 83 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |

| Lab metric | Before | Final | Interpretation |
|---|---:|---:|---|
| LCP | 5.5 s | 3.8 s | Improved; still needs improvement, not a field CWV pass. |
| CLS | 0 | 0 | No layout shift measured in these runs. |
| Total Blocking Time | 2,670 ms | 960 ms | Improved; remaining main-thread work is an interaction responsiveness risk. **TBT is not INP.** |

The top three safe optimizations applied were (1) self-host the same fonts to remove the external blocking stylesheet, (2) use responsive framework optimization for content photos, and (3) right-size the small brand mark losslessly. The browser selected the 11,866-byte 152px WebP on the tested desktop, compared with the previous 60,391-byte PNG. Lower-density screens can use the 4,602-byte 76px variant.

Lighthouse still identifies client JavaScript/long tasks and some blocking local CSS. Cobe and Framer Motion are used, not proven removable dead dependencies. Further hydration/animation work needs profiling and broader review rather than deleting existing design behavior. INP requires representative real-user interaction/field data; it was not measured by this navigation audit. Review Search Console/CrUX after deployment and sufficient traffic.

## Production verification and preservation evidence

- `npm run build -- --webpack` completed successfully with `/fr`, `/en`, `/ht` as SSG and robots/sitemap as static metadata routes. The supported webpack bundler was used for this environment; the existing build script/dependencies were not changed. A prior local Turbopack worker problem is outside this audit's scope.
- `npm run lint`, `npm run test:acquisition`, `npm run test:i18n`, and `npm run test:seo` pass: 27 unit tests total.
- `node scripts/verify-seo.mjs http://localhost:3000` verifies the actual served HTML, headings, reciprocal absolute alternates, canonical/title/description, one valid head schema graph, OG/Twitter, linked social identity, internal anchors, loading/dimensions, no mixed content/indexing blockers, assets, robots/sitemap, redirect normalization and real helpful 404s. `curl.exe` separately saved production headers/source.
- Canonical locale pages, robots, sitemap, all three share cards, ICO/48/512/Apple icons and all four responsive brand assets return 200. Missing pages return 404 (one locale-negotiation redirect only for unprefixed paths); no blocking robots header/meta appears on canonical pages. Error pages correctly remain noindex.
- Representative responsive photo request returned `image/webp` with HTTP 200. Mobile example images and the eagerly loaded modal photo were observed loaded successfully.
- Every non-metadata catalogue value is identical to pre-audit commit `1061385`; the original full PNG, ICO and 512px identity icon are byte-for-byte unchanged. At 1280px, all 62 recorded heading/paragraph rectangles have **zero geometry delta** and main text is identical. Mobile light/dark, menu, language navigation and project modal work without overflow.

Raw evidence is saved outside the repository in `C:/Users/tthar/.codex/visualizations/2026/10/05/01a10e1a-7c01-7cd3-9b9b-886d202e477c/`: `seekursor-lighthouse-before.json`, `seekursor-lighthouse-final.json`, `seekursor-seo-http-before.json`, `seekursor-seo-http-after.json`, `seo-production-headers.txt`, `seo-production-after.html`, before/after layout JSON/screenshots and mobile screenshots. The live URL was audited read-only before changes; its robots/sitemap were 404 at that time. Local results must be rechecked live only after a separately approved deployment.

## Needs input

1. Public business email **if it should be published**. Currently omitted from schema/footer; no invented email.
2. Google Search Console HTML verification token's `content` value for the `https://seekursor.vercel.app/` URL-prefix property, if using the meta-tag verification method.
3. Bing Webmaster `msvalidate.01` verification token's `content` value, if using its meta-tag method.

No further location, phone, logo or OG image is needed for this implementation. Haiti is represented as service area, without implying a street address. Additional social profile URLs can be supplied later if real; only the existing linked Instagram was used.

## Recommended but not done

- **Security patch review:** a build surfaced a Next.js security recommendation; retry completed successfully without suppressing/patching the tool. Read-only `npm audit --omit=dev --json` independently reports Next 16.4.0 as one critical vulnerable dependency with three advisories: [SVG Image Optimization RCE](https://github.com/advisories/GHSA-2464-fhr4-w9xw), [Server Actions denial of service](https://github.com/advisories/GHSA-p3m5-59mp-jv5r), and [typed-array use-cache RCE](https://github.com/advisories/GHSA-673q-mjm6-r5xr). Review a patched Next.js upgrade promptly in separate approved work. Dependency upgrades were explicitly excluded here; no exploitability assessment is claimed. Lighthouse Best Practices 100 does **not** mean dependencies are free of advisories.
- Deeper client hydration/globe/animation profiling and splitting, preserving existing visuals. No wholesale library removal or behavior change performed.
- Separate Services, About and Contact pages only when they add useful distinct content and receive approval. Case studies only for real work with supported facts/results. No extra pages or invented reviews built.
- A distinct public agency social identity could strengthen consistency if the owner wants it. The supplied Instagram remains linked; no profiles were created/renamed, no messages/posts sent.
- No custom domain, Search Console/Bing account changes, Vercel changes, push or deployment performed.

## Manual owner steps after an approved deployment

1. Add/verify the **URL-prefix** property `https://seekursor.vercel.app/` in Search Console. Share the exact verification token if choosing the HTML-tag method; it must be present on the locale page reached by the homepage redirect. See [Google ownership verification](https://support.google.com/webmasters/answer/9008080).
2. Submit `https://seekursor.vercel.app/sitemap.xml` and inspect `/fr`, `/en` and `/ht`. Run a live test, confirm the Google-selected canonical and request indexing. Track indexing and CWV reports; requests do not guarantee inclusion or ranking. See [URL Inspection](https://support.google.com/webmasters/answer/9012289) and [recrawl requests](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).
3. Verify Bing Webmaster Tools using the owner's chosen verification method and submit the same sitemap.
4. Create/update only genuine social profiles, using consistent Seekursor naming, description and this website URL. Provide actual public URLs before adding them to `sameAs`.
5. Set up Google Business Profile **only if eligible for in-person customer contact**. Online-only businesses are not eligible; do not invent a storefront/address. See [Google eligibility](https://support.google.com/business/answer/13763036).

Organization/WebSite markup helps Google understand the entity and site name; display remains Google's decision. References: [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization), [site names](https://developers.google.com/search/docs/appearance/site-names), [localized URLs](https://developers.google.com/search/docs/specialty/international/localized-versions), [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

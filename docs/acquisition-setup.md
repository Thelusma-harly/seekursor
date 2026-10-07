# Seekursor acquisition setup

The website integration uses the public destinations supplied by Seekursor: WhatsApp 50947109401, https://cal.com/thelusma-harly/30min and https://tally.so/r/Gx2yBz. They are configured in `.env.local` and `.env.example`.

## Connect public destinations

Copy `.env.example` to `.env.local` and populate:

| Value | Required format |
| --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | International number including country code, 8–15 digits, no +, spaces, parentheses or dashes |
| `NEXT_PUBLIC_CAL_URL` | Published event: `https://cal.com/<account>/<event>` or `https://cal.com/team/<team>/<event>` |
| `NEXT_PUBLIC_TALLY_FORM_URL` | Published form: `https://tally.so/r/<form-id>` (standard /embed/ links also accepted) |

These are public identifiers. Never place API tokens, email-provider keys or webhook secrets in NEXT_PUBLIC variables. Invalid or missing destinations show a visitor-friendly availability dialog. The supplied URL must be a published public destination; its query string is discarded. Tracking is added from the explicit allowlist below. Custom provider domains are outside this first integration.

Optional existing `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_INSTAGRAM_URL` and `NEXT_PUBLIC_SITE_URL` remain supported. Restart `npm run dev` after changing environment values. Production deployments must rebuild with the public values present.

## WhatsApp

All conversation CTAs use one `createWhatsAppLink({ message })` helper. The default message is:

> Bonjour Seekursor, je viens de visiter votre site et j'aimerais discuter de mon projet.

Service and concept links carry a short contextual message. Normal anchors use official wa.me URLs; WhatsApp handles app/Web selection. The site never sends the message automatically.

## Cal.com account setup

In the actual account, publish one **Appel découverte — 30 min** event for a conversation about the business and its digital needs. Set availability in Cal.com, connect the appropriate Google Calendar for conflict checking and select Google Meet when creating the event. Preserve an existing event's configured meeting location.

Connection verified on 2026-10-07: the supplied event is named **Appel découverte**, lasts 30 minutes and offers both Cal Video and Google Meet. Cal Video is currently selected by default in the booking form. The connection preserves those account settings; select Google Meet as the default in Cal.com if automatic Meet selection is intended.

The official `@calcom/embed-react` scheduler loads inside the existing dialog system only after a booking CTA is clicked. Both embed config and supported UI settings receive the global site theme. Cal.com owns availability, confirmation, invitations and meeting links. No API key or custom backend is needed.

Official references: [React embed source](https://github.com/calcom/cal.com/tree/main/packages/embeds/embed-react), [Cal.com embeds](https://cal.com/embed).

## Tally account setup

Create and publish a short French project inquiry with these six fields:

| Field | Suggested type |
| --- | --- |
| Nom | Short text |
| Entreprise | Short text |
| WhatsApp / Téléphone | Phone |
| Email | Email |
| Type de projet | Choice: Présence digitale, Site web, Outil digital, Automatisation, Autre |
| Qu’aimeriez-vous améliorer ? | Short message |

Require a name, project type and brief need. Choose the required contact field according to the agency's workflow. Add a simple thank-you message in Tally itself. Configure submission notifications in Tally if needed. No website success screen, local copy/paste form, database, email backend or webhook is added.

In Tally's Customize panel, use Inter, a restrained light background, dark readable text and Seekursor blue `#2563EB` for buttons/accents. The surrounding dialog follows the website theme. Tally controls its form palette; its public embed documentation does not provide a runtime theme-switch parameter. The iframe keeps the selected form palette so controls stay readable in both site themes. No CSS injection, inversion/filter or unsupported theme query is used.

The supported standard iframe embed uses a viewport-sized dialog with internal scrolling. The form title appears in the Seekursor dialog; `hideTitle=1` and `alignLeft=1` are supported flags. Fixed height keeps long forms scrollable without dynamic-height widget scripts.

Official references: [Embedding](https://tally.so/help/embed-your-form), [Form styling](https://tally.so/help/customize-your-form), [Hidden fields](https://tally.so/help/hidden-fields).

## Attribution

Cal.com receives supported UTM tags. Add matching hidden fields to the actual Tally form:

`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `originPage`, `referral`, `project_context`.

Only these fields are forwarded. originPage excludes queries/fragments; referral contains only the referring origin; project_context contains the selected public concept/message. UTM/context values are bounded to 200 characters. Arbitrary query parameters, internal tokens and full referrers are excluded. Tally's automatic query-forwarding script is unnecessary for this fixed-height iframe.

## Validation

```sh
npm run lint
npm run test:acquisition
npm run build
```

The supplied WhatsApp destination and prefilled message, Cal event and available time slots, Tally form and contextual iframe parameters were verified in the browser. Connected embeds were checked at mobile, tablet and desktop sizes in both site themes. No message, booking or form response was submitted. Actual-phone app handoff, calendar conflict detection, confirmation/meeting-link delivery and submission notifications still require their respective live end-to-end checks.

The shared dialog hook restores scroll/focus, traps parent-page keyboard navigation and makes the page inert. Cross-origin iframe keystrokes stay inside the provider; use persistent close controls while focused inside an embed. Escape closes the parent dialog when focus is in Seekursor UI. Both providers have a direct hosted link for content blockers or embed/network failure.

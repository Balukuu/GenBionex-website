# GenBionex — Handover

Plain HTML/CSS/JS site, four pages, no build step. This document is the practical
"how do I..." reference. For design rationale and open client questions, see
`../PROJECT.md`.

## File map

```
genbionex/
├── index.html          Home
├── services.html        Our Services
├── about.html            About Us
├── contact.html          Contact Us
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── css/style.css     the entire design system — tokens, base, layout, components
│   ├── js/main.js        menu, scroll reveal, contact form
│   ├── fonts/            3 self-hosted woff2 files (1 family, 3 weights — see PROJECT.md)
│   └── img/               favicon, 4 OG images, 2 licensed photos (see PROJECT.md "Photography")
├── server/
│   ├── server.js          Express + nodemailer, POST /api/contact
│   ├── package.json
│   └── .env.example        copy to .env and fill in real SMTP credentials
├── PROJECT.md              design plan, decisions, open client questions
└── docs/HANDOVER.md        this file
```

There is no build tool anywhere in this project. Every file is shipped exactly as
written. Edit the HTML/CSS/JS directly and refresh the browser.

## Editing text

Each page's copy lives directly in its `.html` file, inside `<main id="main">`.
There's no CMS or template layer — find the sentence in the file and change it.

**Header and footer are duplicated across all four HTML files** (`site-header`,
`menu-sheet`, `site-footer`, `bottom-bar`). If you change a nav label, the footer
company blurb, or the email address shown in the footer/bottom bar, **you must make
the same edit in all four files** — `index.html`, `services.html`, `about.html`,
`contact.html`. The one place they're intentionally *not* identical is the
`aria-current="page"` attribute on the nav link matching the current page, and the
`aria-current="page"` in the mobile sheet — leave those as-is per file.

The nine services and their grouping live only in `services.html` (and are echoed as
one-line teasers in the "What we do" cards on `index.html` — those two need to stay
in sync if a service's name or grouping changes). The exact wording of the nine
services and the About statement are fixed facts from the client brief — see
`PROJECT.md` §2 before rewording them.

## Adding a button — which class to use

The site was rebuilt to match a client-supplied reference (see `PROJECT.md` "Design
pivot") — pill-shaped buttons, lime accent used freely. Unlike the earlier design,
there's **no** "one accent per viewport" restriction anymore — use `.btn--accent`
(lime fill) as often as fits the page; matching the reference means using it liberally,
the same way the reference does.

- `.btn--accent` — solid lime fill, dark text. The primary action anywhere.
- `.btn--solid-dark` — solid dark-green fill, white text. Alternative primary style.
- `.btn--ghost-dark` — outline only, white text, for use on dark (`--dark`) sections.
- `.btn--ghost-light` — outline only, ink text/border, for use on light (`--cream`/
  `--white`) sections. Border colour is `var(--ink)` deliberately, not `var(--border)`
  — the lighter hairline border is invisible against `--cream` (see the contrast bug
  logged in `PROJECT.md`).
- `.call-badge` — not a button, but the circular phone-icon + number pattern next to
  the hero's primary CTA. Reuse it anywhere you want a "Call us" call-out.

## Updating phone / WhatsApp / address again

Phone and WhatsApp are both `+256 787 783670`; address is "Wakiso District, P.O. Box
748, Entebbe" — confirmed by the client and live everywhere as of this update. If a
number or the address changes again, touch it in every one of these places (all 4
files unless noted):

1. **Footer** Contact column — a `tel:` link and a `wa.me` link.
2. **Bottom bar** — the `Call` and `WhatsApp` items are plain `<a>` tags
   (`href="tel:+256..."` / `href="https://wa.me/256..."`).
3. **Contact page only** — the `contact-details` panel (`dd` values for Phone,
   WhatsApp, Address).
4. **Home only** — the contact band's WhatsApp button
   (`<a class="btn btn--ghost-dark" href="https://wa.me/...">`).
5. **JSON-LD** on `index.html` and `contact.html` — the `telephone` field and the
   `address` object (`PostalAddress`) on both the `Organization` and `LocalBusiness`
   blocks.

`tel:` hrefs use the clean E.164 form (no spaces: `tel:+256787783670`); `wa.me` hrefs
use digits only, no `+` (`https://wa.me/256787783670`) — that's WhatsApp's own
deep-link format, not a site convention you can vary. Visible text stays spaced
(`+256 787 783670`) for readability.

The remaining "pending"-styled placeholders are the ones the client hasn't confirmed
yet: the lab-partner note on the Genetic services card (`services.html`) and the team
section (`about.html`) — see `PROJECT.md` §9 for the full open list. Once a logo/brand
mark arrives (currently a type-only wordmark), replace the
`<a class="wordmark">Gen<span>Bionex</span></a>` markup with an `<img>`/inline SVG in
all four headers + footers, and update `assets/img/favicon.svg`.

## Photography

Two photos, used in three places: `hero-ankole-cattle.webp`/`.jpg` (Home hero, right
side) and `about-ankole-cattle.webp`/`.jpg` (the floating-chip split section on both
Home and About). Both are Ankole cattle — the breed most associated with Uganda —
sourced from Wikimedia Commons under CC BY licenses, **not** client-supplied (§9.7 is
still open). Full sourcing details and compression numbers are in `PROJECT.md` under
"Photography".

All three placements are real `<img>` tags inside a `<picture>` (WebP source + JPEG
`<img>` fallback) in a **contained, rounded-corner media box** — not a CSS
`background-image` like the hero used before the redesign. That makes swapping an
image simpler: no scrim/contrast tuning to redo, just drop in a new crop.

**Both are CC BY, which requires attribution — don't remove the credit captions**
(`.photo-credit`) without replacing the image itself. Note `.photo-credit` has two
colour variants: the default (muted dark) for use on light/white/cream sections, and
`.hero .photo-credit` / `.on-dark .photo-credit` (pale cream) for dark sections — pick
whichever matches where you place a new caption, or it'll be unreadable (this exact
mistake happened once already during the redesign, see `PROJECT.md`).

**When the client supplies their own farm/lab photos**, replacing these:

1. Crop to match the existing slot's aspect ratio (hero: 4:3, e.g. 1000×750; split
   section: ~4:3, e.g. 1100×825) so the `<img>` fills its rounded box without odd
   letterboxing — `object-fit: cover` isn't set on these, so mismatched aspect ratios
   will distort.
2. Save WebP + JPEG into `assets/img/`, set explicit `width`/`height` on the `<img>`
   tag (required by the performance budget). No AVIF encoder was available when this
   was built (see `PROJECT.md` tooling note) — worth adding if you have the tooling.
3. **Remove the CC BY credit caption once the photo is the client's own.**
4. **Compression matters less than it used to**, now that images sit in contained
   slots instead of a full-bleed hero background — quality 50–60 at these sizes lands
   well under 120KB each with no visible artifacting. Still worth checking Home's total
   page weight against the 350KB budget after any swap.

## Fonts

One family, three weights — Plus Jakarta Sans 400/600/800, self-hosted woff2, Latin
subset only, in `assets/fonts/`. If you need a different weight/style later, fetch it
the same way this project did: Google Fonts CSS2 API with an **old-Chrome** user-agent
string (forces static per-weight files instead of one large variable-range file — a
recent-Chrome UA will silently return the same variable-font URL for every weight
requested), then download the resulting `.woff2` URL directly. Keep it to a small,
deliberate number of files — the exact count matters less than not bloating it.

## The contact form and Node endpoint

**No Node.js runtime was available in the environment this was built in**, so
`server/` has not been run or `npm install`'d. Before relying on it in production:

```
cd server
cp .env.example .env      # fill in real SMTP_HOST / SMTP_USER / SMTP_PASS / TO_EMAIL
npm install
npm start
```

Then load the site at `http://localhost:3000` (the server also serves the static
site, via `express.static`) and submit the contact form to confirm mail actually
arrives at `info@genbionex.ug`.

**If genbionex.ug's hosting is cPanel-only with no Node process** (this is an open
question — see `PROJECT.md` §9.6): the front-end already degrades gracefully. The
form's native `action="mailto:info@genbionex.ug" method="get"` fires if `fetch()`
fails or JS is off. For a fully working *automated* submission without Node, point
`main.js`'s `fetch('/api/contact', …)` call at a hosted form service instead
(Formspree, Web3Forms, etc.) and keep `server/` in the repo unused, per the brief's
own fallback instruction.

**Rate limiting** is in-memory (a `Map` keyed by IP) and resets whenever the process
restarts — fine for a low-traffic contact form, not meant to survive a multi-instance
deployment. **Honeypot** field is `company_site`, hidden off-screen via `.hp-field` in
`assets/css/style.css`; the server returns `200 OK` without sending mail if it's
filled, so bots don't learn to retry with an empty value.

## Deploying

Static files (`*.html`, `assets/`, `robots.txt`, `sitemap.xml`) can be uploaded as-is
to any static host or cPanel `public_html`. There is no build step to run first.

If using the Node endpoint: deploy `server/` to a host that runs a persistent Node
process (not typical shared cPanel hosting), set the four `.env` variables there, and
point the domain at that process — it serves the static site *and* the API from one
port. Do not commit `server/.env` (already in `.gitignore`).

## What's verified vs. outstanding

Verified across both the original build and the later Biztop redesign (see
`PROJECT.md`'s two "QA results" sections for full detail): word budgets (scripted
count), all internal links resolve, single `<h1>` per page, landmark/aria structure,
contrast on every shipped colour pairing (recomputed by hand each time the palette
changed — this has caught real bugs both times, most recently an invisible button
border, `.lede` text unreadable on dark backgrounds, and a photo credit unreadable on
light backgrounds), content-first rendering with JavaScript entirely blocked (not just
"looks fine with JS on" — actually tested with JS disabled), and functional behaviour
(menu, scroll reveal, contact form validation/honeypot/fallback) driven through real
Chrome via the DevTools Protocol, not just read from the source. Visual rendering
checked at 320–1920px and via headless Chrome screenshots over a local HTTP server.

**Not run in this environment** (no Node.js, no Lighthouse CLI installed): an actual
Lighthouse report. Before launch, run `npx lighthouse http://localhost:3000 --view`
(or against the deployed URL) from a machine with Node, confirm the ≥95/100/≥95
targets in the brief, and commit the HTML report into `docs/`.

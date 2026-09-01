# GenBionex — Project Memory

Client: GenBionex Consulting Company Ltd · Domain: genbionex.ug · Email: info@genbionex.ug
Build: 4-page site, plain HTML/CSS/JS, Node only for the contact endpoint.

This file is the shared memory for the build: phase, decisions and why, open client
questions, and what was tried that failed. Read at session start, append at session end.

---

## Session note — tooling actually available

The brief names a two-agent workflow and several specialised skills
(`frontend-design`, `canvas-design`, `docx`, `pdf`, `xlsx`, `pptx`, `theme-factory`,
`skill-creator`, `product-self-knowledge`). In the session that built this repo, none of
those skills or a second agent were available — only general-purpose build tools. So:

- The design token plan, critique, and revision below were done in one pass,
  self-critiquing before coding, in place of the two-agent write/critique loop.
- Copy was drafted directly against the word budgets and fixed facts in the brief, not
  handed to a separate copy agent, then checked with a word-count script (see QA).
- Uganda fact-checking (breeds, districts, MAAIF / NAGRC&DB / Uganda Veterinary Board)
  could not be delegated. Where the brief touches this, copy stays generic and factual
  (e.g. "Uganda's livestock and veterinary regulatory framework") rather than naming a
  specific relationship that hasn't been confirmed. Flagged again below.
- The ancillary documents in §6 of the brief (one-page profile, service brochure, DNA
  sample template, capability deck) were **not** built — there is no `docx`/`pdf`/`xlsx`/
  `pptx` skill in this session to produce them well, and building them by hand as raw
  OOXML/PDF would be worse than not shipping them. The site itself (§1–§8 of the brief)
  is complete. This is a gap to close in a session that has those skills, not a scope cut
  made silently — flagging it here so it isn't mistaken for "done."
- OG images: no `canvas-design` skill. Built instead as static SVG (pedigree motif, on-
  brand, no text baked in that could drift from the page `<title>`) and rendered to PNG
  with headless Chrome, which was available on this machine.
- No Node.js runtime is installed in this environment, so `server/` could not be
  `npm install`'d or run here. The code was written carefully and reviewed by hand;
  `HANDOVER.md` says to run `npm install && npm start` and hit `/api/contact` before relying
  on it in production.

---

## Design pivot — full match to a client reference (post-launch, client-directed)

The client sent the "Biztop" business-consulting template screenshot **twice**: once at
the very start (as loose visual inspiration alongside the detailed written brief, which
then specified a *different* execution — ink/locus/serif+mono, reference sites "for
clarity and restraint only, copy nothing"), and again after the site was built, asking
first to remove the pedigree hero graphic ("remove these"), then the section dividers
("this too") — both read, correctly, as incremental convergence toward Biztop's plainer
look. Then explicitly: "redesign this so that it has this exact look. Match the colours
and fonts and card designs."

This is a direct, acknowledged conflict with the original brief: Biztop's palette (dark
green + acid/lime green, rounded pill buttons, rounded card blocks) is close to the
brief's own "do not produce: near-black + acid-green accent" line, and the brief said to
copy nothing from references. **Flagged this conflict explicitly before touching any
code** and asked the client to confirm; they confirmed "full switch to Biztop." Proceeding
on an explicit, informed override is different from silently drifting off-brief, so this
is logged here rather than treated as a quiet scope change.

**What did NOT change under the pivot** — the brief's factual hard rules are not a style
choice, so they survived the redesign untouched: no invented stats, testimonials, ratings,
team bios, or client numbers, even though Biztop's own template leans on exactly that kind
of content (a "4.9 ★★★★★ 5K+ Reviews" hero badge, a "10K+ Total Completed Works" stat
card, a named CEO with photo and quote). Every one of those Biztop patterns was adapted to
honest GenBionex content instead of copied with fabricated numbers substituted in — see
the "Current design system" section below for exactly how each one was re-purposed.

### What was rebuilt

Effectively the entire front-end design system, across all 4 pages:
- **Colour tokens** — full replacement (see "Current design system" below).
- **Typography** — Archivo Expanded / Source Serif 4 / IBM Plex Mono (serif+mono,
  restrained) replaced with Plus Jakarta Sans (400/600/800) as the single family for
  everything, matching Biztop's all-sans look. Old font files deleted, new ones fetched
  and self-hosted the same way (Google Fonts CSS2 API, static per-weight woff2, Latin
  subset) — see "Archivo Expanded — naming note" below for the fetch method, which is
  unchanged and reused for the new fonts too.
- **The pedigree signature system removed entirely** (not just the hero instance cut
  earlier) — squares/circles/lines replaced with a small set of custom line icons
  (clipboard, DNA-strand, flask, leaf) in rounded colour boxes, matching Biztop's
  icon-in-box card style. See icon set below.
- **Buttons** — rectangular/outline system replaced with fully-rounded pills
  (`--radius-pill`), plus a circular "call badge" (icon + phone number) matching
  Biztop's header call-out pattern — now populated with the client's real number.
- **Cards** — plain white/bordered cards replaced with the alternating white/lime/dark
  three-tone card pattern from Biztop's "Essential features" section, generalised to 4
  cards for GenBionex's 4 service areas (Biztop's example only needed 3).
- **Header** — added a top bar above the header (tagline + email), matching Biztop's
  thin announcement strip. No fake "5K+ Reviews" or social icons — GenBionex has neither
  confirmed social accounts nor a plausible review count, so the top bar carries only
  real content (tagline, email).
- **Hero** — from full-bleed background photo with dark scrim (the prior redesign) to
  Biztop's two-column layout: text + pill/call buttons left, contained rounded photo
  with a floating white capability-badge right. The badge reads "Farm-first — Advisory
  built around your herd," not a rating — see "no fabricated stats" note above.
- **Split section** (Home + About) — Biztop's image + floating dark chip + stat-card
  pattern, adapted: the floating chip shows a real capability line ("Written protocols
  you keep" / "Genetic rigour, working-farm scale") instead of a fabricated stat number,
  and the checkmark chip-list on Home reuses the existing, real "what working with us
  includes" content in pill form instead of a fake avg-rating block.
- **Images reprocessed** — same two licensed Ankole cattle photos (see "Photography"
  section, unchanged sourcing/licensing), but re-cropped for the new layout: the
  dramatic close portrait now sits in the hero's contained 4:3 media slot (was a hero
  full-bleed background), the aerial watering-point shot now sits in the split-section
  media slot (was the About page's standalone figure). Both compress much lighter in
  their new contained sizes than the old full-bleed hero background did — Home page
  total weight actually dropped, from 266KB to 154KB.

### Bugs found and fixed during the rebuild

Re-doing contrast math for every new token pairing (same discipline as the original
build) caught four real issues before they shipped:

1. **`.btn--ghost-light` border was effectively invisible** — `border-color: var(--border)`
   (`#E6E2D3`) against the `--cream` page background (`#F5F2E7`) computes to ~1.16:1,
   nowhere near the 3:1 non-text minimum. Two very-similar light neutrals, not something
   visible by eye in the design tool but obvious once computed. Fixed to a solid
   `var(--ink)` border (13.67:1).
2. **`.lede` hard-coded `color: var(--gray)`, unlike every other text component, which
   all route through `.on-dark` overrides.** Gray-on-cream is fine (~5.2:1) but the same
   rule also fires inside the dark intro bands on Services/About/Contact (`.lede` is
   used for the hero-band sub-line on all three), where gray-on-`--dark` computes to
   ~2.6:1 — badly failing, and would have made three of four pages' opening paragraph
   nearly unreadable. Added `.on-dark .lede { color: rgba(245,242,231,0.8); }`.
3. **`.photo-credit` was dark-mode-only** (`rgba(245,242,231,0.5)`, designed for the
   hero's dark background) but got reused verbatim under the About page's image, which
   sits on a **white** section — near-invisible pale-cream-on-white. Made the default
   variant a muted dark (`var(--gray)`) and scoped the pale variant to `.hero`/`.on-dark`
   contexts specifically.
4. **`right: -var(--space-3)` is invalid CSS** (you cannot negate a custom property with
   a bare unary minus — needs `calc(-1 * var(--space-3))`). The whole declaration was
   silently dropped, so the floating split-section chip fell back to static position
   instead of overlapping the image's bottom-right corner as designed. Fixed to
   `right: var(--space-3)` (the intended value was positive — overlap into the padding
   from the inside, not the negative/outside offset I'd first written).

All four were caught by actually rendering the pages and reasoning through the
computed contrast/layout, not by re-reading the CSS — consistent with the "read the
code vs. render the page" gap that caused the earlier no-JS content bug.

### Note on the "one accent colour per viewport" rule

The original design system had a hard QA rule limiting `--locus` (pink) to one visible
instance per viewport. **This rule does not carry over to the Biztop-matched system and
was deliberately dropped** — Biztop itself uses its lime accent liberally and
simultaneously (header button, hero highlighted word, a whole card's fill, checkmarks,
link arrows, badge icons all lime at once), and matching "the exact look" necessarily
means matching that density of accent use. The new system uses `--lime` freely by
design; this is not an oversight or a regression from the earlier standard.

---

## SUPERSEDED — original design token plan (kept for history, not current)

Everything from here to "## Photography" describes the *original* ink/locus/serif+mono
design system, built to the brief's literal spec before the client redirected to a full
Biztop match (see "Design pivot" above). **None of these tokens, fonts, or components are
in the shipped CSS anymore.** Kept rather than deleted because the reasoning (contrast
methodology, font-fetch method, WCAG exemption logic) is still accurate and was reused
for the current system — just applied to different hex values and a different font.

### v1 draft

Started from the six fixed brand colours and asked: what's the minimum semantic layer on
top that makes them usable without inventing a seventh colour?

- Backgrounds: `--paper` for page background, `--ink`/`--field` for dark sections.
- Text on paper: headings in `--field`, body in `--ink`.
- Text on ink/field: headings in `--paper`, body in `--bone`.
- Rules and borders: `--bone` on light sections, `--sward` at low opacity on dark ones.
- `--locus`: used as a **filled button background** (with `--paper` text on top), never
  as text colour on its own, never as a fill for shapes or large areas.

### Critique

1. **Locus-as-text-on-dark fails contrast.** `#C4147A` on `#0C1E19` computes to roughly
   2.2:1 — well under the 4.5:1 AA floor for text. The brief's "clears WCAG AA" rule is
   non-negotiable, so locus can never be the colour of a text glyph on the dark tokens.
   Fix: locus only ever appears as (a) a solid button fill with `--paper` text on it, or
   (b) a focus ring, never as running text or an icon stroke on `--ink`/`--field`.
2. **Focus ring visibility on dark backgrounds.** A `2px solid var(--locus)` outline
   against `--ink` has the same contrast problem as (1), this time against WCAG 2.2
   1.4.11 (non-text contrast, 3:1). Fix: pair the locus outline with a soft paper-tint
   halo (`box-shadow` in a translucent `--paper`) so the ring is visible regardless of
   what's behind it, while the outline colour itself still reads as locus.
3. **Six colours is tight for card-heavy layouts** (the reference screenshot leans on
   three card fills). Rather than adding a seventh colour, cards on `--paper` get a
   `--bone` hairline border and no fill — this also steers away from the banned "rounded
   card fills" look by construction, not by willpower.
4. **`--sward` as the only line/illustration colour risks looking flat on `--ink`.** Used
   at full value it's fine (mid-green on green-black has real contrast, ~4.7:1 for large
   graphic strokes); kept at full opacity for the pedigree lines rather than screened
   back, so the signature motif stays legible.
5. **Type scale wasn't specified beyond the three families.** Built a scale below and
   checked measure (62–70ch) at the 720px prose column with Source Serif 4 at 17–18px —
   confirmed it lands in range at both ends.

### v2 (shipped)

```css
:root {
  /* brand */
  --ink:    #0C1E19;
  --field:  #14463C;
  --sward:  #4E8C6A;
  --paper:  #F3F4F0;
  --bone:   #DEDDD3;
  --locus:  #C4147A;

  /* semantic */
  --bg:            var(--paper);
  --bg-inverse:     var(--ink);
  --heading-on-light: var(--field);
  --heading-on-dark:  var(--paper);
  --body-on-light:    var(--ink);
  --body-on-dark:     var(--bone);
  --rule-on-light:    var(--bone);
  --rule-on-dark:     var(--sward);
  --accent:           var(--locus);
  --accent-ink:       var(--paper); /* text/icon colour ON a locus fill */

  /* type */
  --font-display: 'Archivo Expanded', 'Helvetica Neue', Arial, sans-serif;
  --font-body:    'Source Serif 4', Georgia, 'Times New Roman', serif;
  --font-mono:    'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace;

  /* scale, spacing, radius, motion: see assets/css/style.css §1 TOKENS */
}
```

Full scale (sizes, spacing, radii, easing) is written once, as CSS, in
`assets/css/style.css` under the `TOKENS` section — not duplicated here, to avoid the two
drifting.

### Archivo Expanded — naming note

Google Fonts does not ship a separate "Archivo Expanded" family; expanded widths live on
the variable `Archivo` family via the `wdth` axis. The static instance at `wght 600,
wdth 125` (125% = OpenType "Expanded") was requested from the Fonts API and self-hosted as
`assets/fonts/archivo-expanded-600-latin.woff2`, declared locally under the family name
`'Archivo Expanded'` so the rest of the CSS can reference it exactly as the brief names it.
Latin-only subset (`U+0000-00FF` + punctuation/currency), matching the "self-hosted, Latin
subset, three files maximum" rule. Source Serif 4 400 and IBM Plex Mono 400 are the same
subset, fetched the same way. Total: 3 files, ~48KB combined.

### Signature: the pedigree line

Rendered as inline SVG, `--sward` stroke, 1.5px, no fill on the lineage shapes themselves.
Originally shipped in three places per the brief (hero background, section divider,
service marker); the hero and divider instances were both removed post-launch on
client feedback — see "Decisions log" below. One use remains:

1. **Service marker** — a small static square–line–circle mark beside each of the nine
   services (and the "What we do" cards / "How it works" steps on Home), replacing
   01/02/03 numbering, since a pedigree symbol *is* a relationship, which is what's
   being sold. Not yet flagged by the client — left as-is, but given the hero and
   divider were both cut, it's worth confirming this one still earns its place too
   before calling the signature system final.

No build step means no includes — the divider and marker SVGs are short enough (~4 lines
each) to hand-duplicate inline wherever they're used, same as header/footer.

---

## Current design system (Biztop match — what's actually shipped)

### Tokens

```css
:root {
  --dark:      #0E2A20;  /* top bar, header, hero, dark cards, footer */
  --lime:      #AEE352;  /* accent — buttons, highlights, icon fills, checkmarks */
  --lime-deep: #8FC93E;  /* hover state for lime fills */
  --cream:     #F5F2E7;  /* page background */
  --white:     #FFFFFF;
  --ink:       #12241C;  /* headings + primary text on light backgrounds */
  --gray:      #5B6577;  /* secondary / muted text on light backgrounds */
  --border:    #E6E2D3;  /* hairline borders on cream/white — NOT visible enough
                             to use as a button border, see bug #1 above */
}
```

Contrast verified by hand for every pairing actually used in the markup (not just the
raw tokens): lime-on-dark 10.15:1, ink-on-cream 14.47:1, dark-text-on-lime 10.75:1,
gray-on-cream 4.44:1 → intentionally darkened to `#5B6577` for a safer 5.24:1 margin.
Full workings are the same methodology as the original build's contrast section, just
against the new hex values.

### Type

Single family now, not three: **Plus Jakarta Sans**, self-hosted, Latin subset, 3 static
weight files (400 body, 600 subheads/buttons, 800 display headlines) —
`assets/fonts/plus-jakarta-sans-{400,600,800}-latin.woff2`, ~36KB combined (lighter than
the previous 3-family set). Fetched via the Google Fonts CSS2 API with an old-Chrome
user-agent string to force static (non-variable) per-weight files rather than one large
variable-range file — same method as the original build, documented in the (superseded)
"Archivo Expanded — naming note" above.

### Icon set

Custom line icons (24×24, `stroke="currentColor"`, 1.8px stroke, round caps/joins) —
hand-drawn SVG path data, not an icon library dependency:

- **Clipboard** — Advisory & Farm Systems
- **DNA strand** (two S-curves + three rungs) — Breeding & Genetics. This is a simple
  flat line glyph, not the banned "stock DNA helix" — the brief's ban was specifically
  about clichéd photographic/3D-render stock imagery, not a minimal icon appropriate to
  what the company actually does. Worth a second look if the client has an opinion on it.
- **Flask** — Laboratory & Equipment
- **Leaf** — Nutrition
- Plus: phone (call badge), arrow (card links / "Explore more"), shield-check (hero
  badge / split chip), checkmark (chip-list bullets), DNA-strand again at small size for
  the wordmark mark and favicon.

Favicon (`assets/img/favicon.svg`) and the 4 OG images were regenerated to match — same
headless-Chrome-screenshot method as the original build (no `canvas-design` skill this
session either), same reasoning logged in the "Session note" above.

### Components not otherwise obvious from the CSS

- **Call badge** (`.call-badge`) — circular lime icon + "CALL US" / phone number,
  sitting next to the hero's pill CTA. Matches Biztop's header phone call-out pattern,
  moved to the hero since that's where the brief's own copy plan put the phone number.
- **Feature card** (`.feature-card--white/--lime/--dark`) — the alternating 3-tone card.
  Cycle order on Home's 4 cards is white/lime/dark/white; extend the same cycle if a 5th
  card is ever added rather than inventing a new pattern.
- **Split chip** (`.split__chip`) — the floating dark card overlapping an image's
  bottom-right corner. Requires `.split__media` to be `position: relative` (already is)
  and the chip's `right`/`bottom` to be plain token values, not `calc()`-free negation
  (see bug #4 above — this exact spot broke once already).

---

## Photography

Added post-launch on client request ("add images that are heavily related to the
website"). No `canvas-design` skill this session and no client-supplied photos yet
(§9.7 still open), so this meant sourcing real, properly-licensed photography rather
than generating or inventing it.

**Source: Wikimedia Commons, via the Openverse API** (`api.openverse.org`), filtered to
`cc0,pdm,by` licenses only — commercial use and modification both need to be
unambiguously permitted, so anything NC (non-commercial) or ND (no-derivatives) was
excluded from every search. Searched broadly first ("dairy cattle farm", "veterinarian
cattle", "cattle herd" — mostly Western/generic stock photography, inconsistent
quality, several archival/vintage-style results that didn't fit a modern site) before
narrowing to "ankole cattle" and "uganda cattle" specifically. That narrower search is
what actually paid off: Ankole cattle (the long-horned breed most closely identified
with Uganda) turned up multiple high-resolution, professionally shot, Uganda-located
photos — a much stronger fit than generic cattle-anywhere stock imagery, and it reads
as intentional rather than stock-photo-generic precisely because it's specific to the
subject the client's business is actually about.

**Images used (both CC BY, attribution required — not CC0, so both carry a visible
credit on-page, not buried in a docs file). Same two photos as the original photography
pass; only the crops/placements changed for the Biztop-matched layout (see "Current
design system" above):**

1. **Ankole cattle close portrait**, by flowcomm, CC BY 2.0.
   [Source](https://commons.wikimedia.org/w/index.php?curid=132683936).
   `assets/img/hero-ankole-cattle.webp` (+ `.jpg` fallback) — now cropped 4:3 at
   1000×750 for the Home hero's **contained** media slot (was a 16:9 1600×900 full-bleed
   background before the redesign; the old crop is gone, this is a fresh crop from the
   original source, not a resize of the old file).
2. **Aerial watering-point shot** — "Traditional Ankole long horned cattle at a
   watering point in Kazo District, Western Uganda," by Tusk media, CC BY 4.0.
   [Source](https://commons.wikimedia.org/w/index.php?curid=145771321).
   `assets/img/about-ankole-cattle.webp`/`.jpg` — now cropped to 1100×825 and used in
   **two** places: the Home page's "What working with us includes" split section, and
   the About page's "Why GenBionex" split section. Deliberate reuse across two pages
   (only 2 licensed images total exist) rather than sourcing a third — flagged in case
   the client would rather see a different image on one of the two pages.

**Processing:** downloaded originals (up to 6000px wide), center-cropped to the target
aspect ratio, resized, and re-encoded with Pillow (no ImageMagick/cwebp available in
this environment). No AVIF encoder was available either (checked; not installed, no
apt access to add one) — every `<img>` use ships WebP + JPEG via `<picture>` (all three
image placements post-redesign are real `<img>` tags in **contained** media slots, not
CSS `background-image`, so all three keep the JPEG fallback rather than the hero's old
WebP-only treatment). Still a deliberate substitution for the brief's "avif + webp"
asset spec, same reasoning as the OG images (§ tooling note at top) — flagging in case a
later session gets AVIF tooling and wants to backfill it.

**Compression is far lighter now that both images sit in contained slots instead of a
full-bleed hero background.** The original full-bleed hero needed aggressive
compression (quality 45 at 1600×900, 177KB) just to fit the page budget; the redesign's
contained 1000×750 hero image and 1100×825 split image both compress comfortably at
higher quality (58 and 50 respectively) while landing smaller in absolute terms —
69KB and 116KB WebP. Home page total dropped from 266KB to **154KB**, nearly 200KB of
headroom under the 350KB budget.

**Attribution is on-page, not just in this file.** CC BY requires it, and hiding it in
a docs file nobody but the dev team reads wouldn't satisfy the license. Both images
carry a small caption credit linking back to the Commons source — under the hero photo
on Home, and under the split image wherever it appears (Home, About). The credit
component (`.photo-credit`) needed a light/dark-aware fix after the redesign — see bug
#3 in "Design pivot" above.

**Only 2 images, deliberately.** The brief's whole design language is restraint ("one
idea per screen," generous whitespace, three banned "busy" looks). Two well-chosen,
high-quality photos do more for the site than five or six would — happy to add more
(e.g. a Services page banner) if the client wants further imagery, but didn't do it
unasked to avoid working against the site's own design principles.

---

## Decisions log

- **Hero pedigree graphic removed (client feedback, post-launch).** The client viewed
  the live hero and flagged the pedigree fan as visually overlapping/cluttering the
  headline text rather than reading as a subtle backdrop, and asked for it to be
  removed. Removed the `.pedigree-hero` markup from `index.html`, its CSS (§6 in
  `style.css`, including the `draw-line`/`draw-node` keyframes and the now-unused
  `--dur-draw` token), and `initPedigree()` from `main.js` (was the largest function in
  the file; JS is now smaller and simpler). The hero is now solid `--ink` with just
  type — consistent with the brief's own reference standard ("clarity and restraint").
  This also removes the one animated moment the "Motion" section of the brief called
  for (`stroke-dash` draw-in, ~1.4s, first load only) — motion is now scroll-reveal and
  hover only, which still satisfies "one moment, then stillness" in spirit, just with a
  smaller "moment."
- **Section divider removed too (same client feedback pass, immediately after).**
  Same shape (square–line–circle), same complaint in effect — asked to remove "this
  too." Removed all `<div class="divider">` instances (1 on Home, 3 on Services, 2 on
  About) and the corresponding `.divider` CSS rules. Section spacing didn't need any
  compensating change: every section/block already carries its own
  `padding-block`/`margin-bottom` independent of the divider (`--space-7`/`--space-8`
  on `.section`/`.service-group`, an explicit inline `margin-bottom: var(--space-7)` on
  the About prose blocks), so removing the divider still leaves generous, intentional
  gaps between sections — verified by screenshot, not just by reading the CSS.
- **"No stock photography" reversed (client request, post-launch) — see the dedicated
  section below for the full sourcing/licensing writeup.** The original reasoning
  (avoid the banned "stock DNA helixes" crutch, avoid claiming imagery of GenBionex's
  own farm before §9.7 is answered) still holds for GENERIC stock photography. What's
  now on the site is neither: it's specifically Ankole cattle, the breed most
  identified with Ugandan livestock, sourced and captioned as illustrative rather than
  claimed as GenBionex's own operation.
- **Contact channels confirmed (client-supplied, post-launch).** §9.1–2 are resolved:
  phone and WhatsApp are both `+256 787 783670`; address is "Wakiso District, P.O. Box
  748, Entebbe". Replaced every "pending confirmation" placeholder site-wide — contact
  page detail panel, both footers' Contact column, the mobile bottom bar's Call/WhatsApp
  buttons (were `<button disabled>`, now real `tel:`/`wa.me` links), and Home's contact
  band WhatsApp button. Also added `telephone` and a full `PostalAddress` (PO box,
  locality, region) to the Organization/LocalBusiness JSON-LD on Home and Contact, which
  previously only had `addressCountry`. `tel:` links use the clean E.164 form
  (`tel:+256787783670`); `wa.me` links use the digits-only form
  (`https://wa.me/256787783670`) per WhatsApp's own deep-link spec. Visible text stays
  spaced (`+256 787 783670`) for readability. Service area copy ("serving livestock
  enterprises across Uganda") is unchanged — client didn't ask to narrow it to a
  district, so it stays general rather than inventing a claim.
- **Service #6 heading shortened to "Genetic services."** The full brief wording is
  "Genetic services — DNA collection, genotyping, evaluation of breeding values"; the
  card format (heading + one-line outcome + 3 five-word bullets) already surfaces DNA
  collection, genotyping, and breeding-value evaluation as the three bullets, so the
  full clause would be redundant repeated in the heading. Meaning is unchanged, wording
  is split across heading + bullets rather than kept as one long string — flagging in
  case the client prefers the full title verbatim in the heading itself.
- **Genetic services, in-house vs partner labs (§4 instruction).** Not confirmed (§9.5).
  The services card for "Genetic services" states DNA collection happens on-farm and
  labels laboratory processing as "processing partner: to be confirmed" — a visible,
  honest placeholder rather than a guess at whether GenBionex runs its own lab.
- **Team section (About).** "Team profiles publishing shortly" placeholder, styled as a
  real section (not greyed-out or apologetic), per the brief's exact instruction.
- **Standards paragraph (About).** Written to describe operating context, not claimed
  certification: references Uganda's livestock/veterinary regulatory environment in
  general terms (MAAIF, NAGRC&DB, Uganda Veterinary Board named only as the bodies that
  define that environment) rather than asserting a specific registration, membership, or
  partnership that hasn't been confirmed.
- **Hosting.** Unconfirmed whether genbionex.ug supports a Node process (§9.6). Shipped
  the Node/Express/nodemailer endpoint as specified, with the client-side fallback
  (`mailto:` GET-action form) working with zero server present. `HANDOVER.md` flags this
  as the first thing to confirm before go-live, with the cPanel/hosted-form-service
  fallback path noted per the brief's own instruction.
- **Link underlines removed on Contact.** Client flagged the underlines under the
  `contact-details` panel links (Email/Phone/WhatsApp) and under "blactec.ug" in the
  footer credit. Removed `text-decoration`/`border-bottom` from `.contact-details a`
  and `.site-footer__bottom a` in `style.css`, and added an inline
  `style="text-decoration: none;"` to the bare "email us directly" link in the contact
  form (it had no class, so it was picking up the browser default underline via the
  base `a` reset). All three now render as plain coloured text, no line.
- **Footer credit line.** Client asked to remove the plain `genbionex.ug` domain label
  from the footer's bottom row and replace it with "designed by blactec.ug". Shipped as
  "Designed by [blactec.ug]" with the domain linking to `https://blactec.ug` (standard
  build-credit convention) — all 4 pages.
- **Contact form gained an Email field not listed in brief §4.** The brief specifies
  "name, organisation, district, enterprise, service interest, message" — no way to
  reach the sender back. Since the page copy (and the brief's own tone) promises a
  reply, a form with no return address doesn't do its job. Added `email` as a required
  field; everything else matches the brief exactly. Flagging this as a deliberate,
  scoped addition rather than silent scope creep.

---

## Open questions for the client (brief §9 — do not guess, ship placeholders)

1. ~~Phone and WhatsApp numbers~~ — **confirmed**: `+256 787 783670` (both), live
   site-wide as of the post-launch update.
2. ~~Physical address~~ — **confirmed**: "Wakiso District, P.O. Box 748, Entebbe", live
   on the Contact page and in JSON-LD. Service area copy is still the general
   "livestock enterprises across Uganda" — client didn't ask to state a narrower public
   service area, so that half of §9.2 is still technically open if they want one.
3. Logo and any existing brand colours — if none, is a wordmark in scope? (Shipped: a
   type-only wordmark in Archivo Expanded, no logotype/mark — treat as placeholder until
   confirmed otherwise.)
4. Team names, roles, qualifications, photos
5. Which genetic services are in-house vs partner laboratories, and may partners be named?
6. Hosting: does genbionex.ug support a Node process, or is it cPanel-only?
7. Can they supply farm/laboratory photos, or does the illustration system carry the site?
   (Shipped assuming: illustration system carries the site — revisit if photos arrive.)

---

## Post-build functional review (critical fix)

A follow-up review actually drove the live pages instead of only reading the code —
opening `index.html` directly by double-clicking it (`file://`, no server) showed a
**broken page: the hero and every other section below the header rendered empty.**

Root cause: `.reveal` elements (used on nearly every section, including the hero) had
`opacity: 0` as their CSS *default*, becoming visible only once `main.js` added
`.is-visible` via `IntersectionObserver`. Browsers block `type="module"` scripts from
executing over `file://` (a CORS restriction on module loading, not a bug in the
module itself) — so on a `file://` open, main.js never ran, and every `.reveal`
element stayed invisible forever. The same failure mode would hit anyone with
JavaScript disabled or blocked, and any no-JS crawler. The pedigree hero graphic had
the identical defect (`stroke-dashoffset: 240` / node `opacity: 0` by default,
visible only once JS added `.is-drawing`/`.is-drawn`).

This had passed earlier automated checks because those checks loaded pages over a
real local HTTP server, where modules load fine — the failure only shows up with
`file://` or JS genuinely unavailable, which is exactly how a client previewing the
site locally would open it.

**Fix — inverted the dependency direction** (`assets/css/style.css` §6 and §15,
`assets/js/main.js`): content is now visible by CSS default, full stop. JS only ever
*adds* a hidden pre-state, and only for elements confirmed off-screen at load time
(`.reveal-pending`, checked via `getBoundingClientRect()`) or for the hero pedigree on
its animated first draw (`.is-drawing`, which starts undrawn and animates back to the
same default-visible resting state). If JS never runs, nothing is ever hidden in the
first place — no flash, no dependency, no failure mode.

Re-verified with a hand-built CDP test harness (pure Python stdlib WebSocket client —
no Node/Puppeteer available; see "Session note" above) driving real Chrome: all 4
pages fully visible with `Emulation.setScriptExecutionDisabled` genuinely disabling
JS (a stricter test than `file://`), reveal-pending never applied to above-the-fold
elements (no flash for real users), full scroll-through still reveals every section
with fresh JS, reduced-motion leaves nothing hidden, and `--locus` confirmed to render
as exactly one visible element at a time across desktop, mobile-closed, and
mobile-menu-open states on every page. Also load-bearing but easy to miss: the same
browser instance silently served a *cached* pre-fix `main.js` to a couple of early
re-test runs — `Network.setCacheDisabled` is required for trustworthy iteration when
testing against a long-lived headless Chrome instance.

## Build phase log

- [x] Phase 1 — repo, tokens, fonts, header/footer pattern, pedigree SVGs
- [x] Phase 2 — Home
- [x] Phase 3 — Our Services
- [x] Phase 4 — About Us, Contact Us
- [x] Phase 5 — Node contact endpoint + form wiring
- [x] Phase 6 — OG images (headless-Chrome-rendered PNG, since no `canvas-design` skill
      this session); the one-page profile / brochure / DNA template / capability deck
      were **not** built — no `docx`/`pdf`/`xlsx`/`pptx` skill available (see tooling
      note at top)
- [x] Phase 7 — QA + HANDOVER.md

## QA results (original ink/locus build — predates the Biztop redesign)

The `--locus`/pedigree/serif+mono specifics below no longer exist in the shipped site
(see "Design pivot" and "Current design system" above) — kept for the verification
*methodology*, which was reused as-is for the redesign (see "QA results — Biztop
redesign" at the end of this file for the current, applicable results).

- **Word counts** (scripted, `<main>` text only, form fields excluded from Contact
  since they're UI chrome not prose): Home 199/250, Services 349/400, About 236/250,
  Contact 39/80 (prose only — form itself adds required functional fields per brief §4
  plus the added Email field, see decisions log).
- **Links**: every internal `href` resolves to an existing file; all four
  `services.html` anchor ids (`#advisory #breeding #laboratory #nutrition`) match the
  Home "What we do" card links; no duplicate `id` attributes on any page.
- **Structure**: exactly one `<h1>` per page; `header`/`main`/`footer` present on
  every page; three `<nav>` landmarks per page (primary, mobile sheet, bottom bar),
  each with a distinct `aria-label`.
- **Contrast — two real bugs found and fixed by hand-computing WCAG ratios for every
  token pairing actually used in the markup** (not just the six raw tokens in the
  abstract):
  1. `--sward` text/border on `--ink` computes to ~4.35:1 (fails the 4.5:1 text
     minimum) and on `--field` to ~2.7:1 (fails even the 3:1 non-text minimum). Fixed
     by moving all small dark-background text (eyebrows, `.pending` badges, footer
     bottom row, contact-detail `dt`s) to `--bone`, and moving the one sward-stroked
     decorative section (Home "How it works") from `--field` to `--ink`.
  2. The hero `<h1>` had no dark-background override and was inheriting the global
     `h1{color:var(--heading-on-light)}` rule — i.e. dark-green text on a near-black
     background, effectively invisible. Fixed in `style.css` (`.hero h1`) and by
     adding the `on-dark` class to the hero section.
  `--sward` remains as-is inside the wordmark logotype (`Gen<span>Bionex</span>`) —
  WCAG's SC 1.4.3 explicitly exempts logotype text from contrast requirements.
- **`--locus` "at most once per viewport" (QA §8) — found and fixed a real violation.**
  The header's "Talk to us" is `position:sticky` and persists through every scroll
  position, so it's visible at the same time as whatever section is in view. The brief's
  own Home spec calls the hero's first button "(accent)" too, which would put a second
  locus-filled button on screen alongside the sticky header's — literally two accents in
  one viewport. Resolved by treating the sticky header CTA as the one sitewide accent,
  and giving every other "primary" in-page action (hero CTA, both contact-band CTAs, the
  contact form's submit button) a new solid, non-locus treatment instead —
  `.btn--solid-dark` (paper fill / ink text, for dark sections) and `.btn--solid-light`
  (field fill / paper text, for the paper-background contact form) in `style.css`. Also
  caught two smaller repeat-offenders: the contact form's required-field asterisks were
  all locus-coloured (four visible at once) — moved to `--field`; and
  `.form-status.is-error`'s border was locus — moved to `--ink`. `--locus` now appears
  in exactly one place in the rendered UI: the header/mobile-sheet "Talk to us", which
  are themselves mutually exclusive by responsive/open-state, so never both visible at
  once either. Focus rings stay locus — by definition only one element is focused at a
  time, so that usage can never double up.
- **Rendering**: screenshot-verified via headless Chrome at 320/375/768/1024/1440/
  1920px, and over a real local HTTP server (not `file://`, which silently blocks ES
  module loading — a test-methodology trap, not a site bug) to confirm the hero
  pedigree draw-in, scroll reveal, and contact form actually execute.
- **Not run in this environment**: Lighthouse (no Node/npm installed — see
  `docs/HANDOVER.md` for the exact command to run once Node is available), a live
  send-through of the contact form (no Node runtime to `npm install` the server),
  and manual screen-reader/keyboard-only passes (no AT tooling in this environment).

---

## QA results — Biztop redesign (this session, current)

Same verification methodology as the original build, re-run after the full redesign:

- **Word counts** (scripted, `<main>` text, Contact's form fields excluded as UI chrome
  not prose): Home 248/250, Services 349/400, About 250/250 (exactly at the limit — see
  the "elsewhere" trim in the About paragraph), Contact 45/109 (45 prose-only, 109
  including form labels). All within budget, About with effectively no margin — worth
  knowing before adding so much as one more word to that page.
- **Links / structure**: every internal `href` resolves; all four `services.html`
  anchor ids still match Home's card links; no duplicate `id` attributes; exactly one
  `<h1>` per page; unchanged from the original build (markup structure, not just
  styling, carried over — only classes/tokens changed).
- **Contrast**: four real bugs found and fixed — see "Bugs found and fixed during the
  rebuild" above (ghost-light button border, `.lede` on dark backgrounds, `.photo-credit`
  on light backgrounds, plus the invalid-CSS `right: -var()` layout bug). All four
  verified fixed by screenshot, not just by re-reading the changed CSS rule.
- **No-JS / content-first architecture re-verified after the rewrite.** The critical
  fix from the earlier functional review (content must be visible by default, JS only
  ever adds a hidden pre-state) was a property of the CSS contract
  (`.reveal { opacity: 1 }` by default), not of the removed pedigree-specific code, so it
  needed to survive a full CSS rewrite to still be true. Confirmed via `file://` screenshot
  (blocks ES modules the same way a broken/blocked JS environment would) — all sections
  on Home render fully with zero JS execution.
- **Functional (CDP-driven, real Chrome, not static reading)**: mobile menu opens on
  click; contact form honeypot fires a fake-success without a network call; a real
  submit attempt with no backend present correctly shows an error state and offers a
  working `mailto:` fallback with properly encoded fields; scroll-triggered reveal still
  fires for all elements when scrolled through incrementally; all 4 pages load with
  exactly one `<h1>` each.
- **Budget**: CSS 27.5KB (was 22–23KB pre-redesign; more components, still under the
  30KB ceiling), JS unchanged at 4.4KB (no JS logic changed, only class names it
  manipulates — `.reveal`/`.reveal-pending`/`.is-visible` are still exactly what
  `main.js` expects). Home page total weight **154KB**, well under the 350KB budget
  (see "Photography" above for why this dropped from 266KB).
- **The "one accent per viewport" QA rule from the original build no longer applies** —
  see "Note on the 'one accent colour per viewport' rule" above. Not re-tested because
  it's not a rule of the current design.
- **Not run, same gaps as before**: Lighthouse, a live contact-form send-through, and
  screen-reader/keyboard-only passes — still blocked on the same missing tooling
  (no Node/npm, no AT software) documented in the "Session note" at the top of this file.

---

## Post-redesign tweak — top bar removed (client feedback)

Client flagged the thin announcement strip above the header (tagline + email) and
asked to remove it. Removed the `.top-bar` markup from all 4 files and the
corresponding CSS (`style.css` §7) — it's fully gone, not hidden. `.site-header`
(`position: sticky; top: 0`) now sits flush at the very top of the viewport with
nothing above it. No other layout changes needed; the header didn't depend on the top
bar's height for anything.

---

## Mobile responsiveness audit + UI bug fixes (client request: "more mobile responsive, fix UI bugs")

Rather than guess, audited the live site across 16 widths (280–1920px) × 4 pages via a
CDP-driven headless Chrome, checking `scrollWidth` vs `clientWidth` for horizontal
overflow and screenshotting suspicious spots. Found and fixed two real bugs:

1. **Contact form caused horizontal overflow on every mobile width** (scrollWidth
   ~468px regardless of viewport, confirmed as low as 320px). Root cause: `.field
   input/select/textarea` had no `width`/`min-width` set, so the `<select>`'s longest
   `<option>` text ("Advice on setting up a breeding support laboratory") drove an
   intrinsic content width past the viewport — and because flex/grid children default
   to `min-width: auto` (which respects that intrinsic size), nothing shrank it back
   down. Fixed with `width: 100%; min-width: 0;` on all three. Re-verified desktop's
   2-column field-row layout still renders correctly (no regression) and the `<select>`
   is still functional, not just visually resized.
2. **Hero badge on the contained mobile photo covered most of the image and, at very
   narrow widths (320–360px), needed its subtitle to wrap to a 2nd/3rd line.** Not a
   clipping bug (`overflow: hidden` was working correctly — confirmed by measuring
   actual box geometry via CDP before assuming otherwise) but a real proportions
   problem: a 4:3 image at 320px viewport width is only 210px tall, and a 3-line badge
   eats over half of that, leaving almost no photo visible. Fixed three ways together:
   shortened the badge's subtitle ("Advisory built around your herd" → "Built around
   your herd", removing a redundant word since "Farm-first" already implies advisory),
   gave `.hero__badge` an explicit `max-width: 16rem` plus both `left`/`right` offsets
   (predictable shrink-to-fit sizing instead of relying on implicit containing-block
   math), and added `aspect-ratio: 1/1` for the hero image below 26rem (416px) so the
   image itself has more height to work with on the narrowest phones.

Both fixes verified three ways, not just visually: (a) `scrollWidth` swept across 64
width×page combinations post-fix — zero overflow anywhere; (b) functional CDP tests
re-run (menu toggle, honeypot, no-JS content visibility, `<select>` still accepts a
value) — all still pass; (c) screenshot comparison before/after at 320px showing the
badge fitting on one line with the image clearly visible again.

No other UI bugs found in the sweep — cards, steps, footer, mobile menu sheet, and the
`.split__chip` floating-card pattern (which already had a `max-width` + stack-below-
on-mobile fallback, unlike the hero badge before this fix) all held up cleanly across
every width tested.

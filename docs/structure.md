# Structure

Annotated tree, render pipeline, and update recipes for content edits.

## Tree

```
src/
  proxy.ts          # Locale routing: / → rewrite to /en (URL stays /), or redirect
                    # /id when browser language is Indonesian; /en → redirects to /;
                    # /id served as-is. Accept-Language parsed in detectLocale().
  app/
    [lang]/
      layout.tsx    # Root layout: fonts (Antonio, Plus Jakarta Sans) via CSS vars,
                    # <html lang={lang}>; generateStaticParams (en, id);
                    # generateMetadata per locale from dict.metadata (images unchanged)
      page.tsx      # Loads dict for lang, passes it to every section. Body wrapper
                    # owns the vertical rhythm (gap-20 / lg:gap-[120px], pb before
                    # footer) per the .pen Main artboard; sections carry no mb-*
    globals.css     # Tailwind import, theme tokens, custom utilities (see design.md)
    icon.png        # Favicon
    actions/
      contact.ts    # 'use server' sendContactMessage(prev, formData) — contact form
                    # endpoint: rate limit → time trap → honeypot → sanitize →
                    # validate → config check → owner mail (reply_to = visitor) →
                    # auto-reply (best effort). Returns i18n error KEYS, never raw
                    # errors; env vars read inside functions, literal key names.
    lib/
      constants/   # index.ts (GITHUB_URL, LINKEDIN_URL, CV_URL, NEXT_LOCALE_COOKIE —
                   # barrel, re-exports stack.ts), stack.ts (TECH_STACK, 30 items,
                   # sorted by name)
      contact/     # Contact form helpers (no deps, no I/O in validate.ts):
                   # validate.ts (LIMITS, INTERESTS, validateContact, isValidEmail,
                   # sanitizeText for single-line fields, sanitizeMessage — keeps
                   # \n so the email builders can make <p> per line) + rate-limit.ts
                   # (in-memory fixed-window IP limiter; env-driven via
                   # readRateLimitConfig, clamped 1..∞, resets per cold start)
      mail/        # Resend plumbing (server-only): resend.ts (lazy getResend()
                   # singleton, null when RESEND_API_KEY unset) + templates.ts
                   # (hand-rolled branded builders — fluid full-width table card, light
                   # inline base + dark-scheme class overrides, Plus Jakarta
                   # Sans @font-face (400–700), PNG wordmark swap pair; owner notification
                   # EN-only, escapeHtml on all user input, auto-reply copy
                   # has an en/id branch; see docs/design.md "Email templates")
      utils.ts     # cx() = clsx + tailwind-merge
      i18n/        # Locale infra: index.ts (hasLocale/getDictionary/locales),
                    # types.ts (Segment, Dictionary, ContactLabels), en.ts + id.ts
                    # (dictionaries)
    components/     # Sections (server components), all receive `dict: Dictionary`
      Header.tsx    # Sticky topbar (client): logo (tight 118.54×21.8 SVG in a
                    # p-[7.2px] container = the design's 133×36 logo slot) +
                    # SocialNav + LangSwitcher +
                    # AvailabilityStatus; bg-background/70 + backdrop-blur; scrolled
                    # state shrinks padding (py-6→py-2) and fades in 1px bottom line
      Hero.tsx      # Name, TypeAnimation, Statistic row, portrait Image.
                    # xl: 478px copy column beside a proportional, shrinkable portrait;
                    # positioned wrapper contains Image fill. At 2xl: 200px gap,
                    # 584×877 photo overhangs the 700px hero by 177px. Below xl
                    # photo stays absolute; lg uses a 480px-wide portrait in a
                    # 728px hero and 100px name type (xl: 116px)
      About.tsx     # Bio paragraphs via SegmentedText, .about-box-accent headline,
                    # centered CV CTA button (ui/Button + IconArrowUpRight);
                    # lg-only margin reduces the Hero → About gap to 64px
      TechStack.tsx # Heading + subline via SegmentedText + ToolsMarquee
      AiWorkflow.tsx # AI-native — Connected Workflow (Figma node 699-419): 48px two-tone
                     # headline + intro; 3 stage cols (PLAN/DESIGN/DEVELOP, Antonio 26px
                     # + 24px custom icon from ui/icons.tsx), stacked below lg; toolkit
                     # copy above the logo row through lg — card shells are code (bg/border
                     # per design); PLAN + DESIGN render animated inline SVG via
                     # ui/PlanIllustration / ui/DesignIllustration (7.2s scenery loops);
                     # DEVELOP via ui/DevelopIllustration — static composition + blinking
                     # caret on line 03 only (owner verdict: heavy text animation too
                     # fussy). Logo row: public/techstack/ai/*.svg. Copy in
                     # dictionaries (aiWorkflow key); stage shells/icons/images in STAGES const
      Portfolio.tsx # Redesigned per Figma node 681-441: heading band (wordmark +
                    # dict tagline + 1px white/15 divider, sticky from sm below topbar
                    # with scroll-fade) → one featured `wide` ProjectCard + two
                    # rows × 2 `compact` cards; per-project data in PROJECTS const
                    # (titles/tags/surface/image locale-independent), descriptions
                    # + tagline in dictionaries (dict.portfolio); takes `locale`
                    # AND `dict`; Indonesian heading is 64px below sm;
                    # #portfolio scroll margins clear the fixed header (design.md)
      Portfolio.legacy.tsx # Pre-redesign portfolio (CSS grid + weight-graded experiment);
                           # not imported anywhere — kept as reference only
      Testimonial.tsx # Heading + TestimonyCarousel
      Contact.tsx   # Contact panel (server) per the .pen "Precision Panel" frame:
                    # glass panel shell, gold ambient glows/pulses (aria-hidden +
                    # pointer-events-none), invitation heading + gold rule,
                    # two-col layout (interests | form) with hairline divider;
                    # renders ContactForm
      ContactForm.tsx # Client island: RHF v7 validation (onTouched + live revalidate;
                    # rules shared with lib/contact/validate.ts), interest select below
                    # 600px / radios from 600px (shared RHF value; the mounted checked
                    # radio submits `interest`), name/email/message via ui/Input +
                    # ui/Textarea; valid submit opens a 3s cancel window (Cancel
                    # trigger + #9747FF progress bar) before dispatching to
                    # sendContactMessage via useActionState (server fieldErrors →
                    # setError); success → form subtree exits (contact-form-exit)
                    # → full-width SentView (pen B2C6cA) enters; honeypot
                    # `company`, time-trap `startedAt`, `locale` hidden fields;
                    # form-level errors resolved from i18n keys into an
                    # aria-live region
      Footer.tsx    # Footer per the .pen Main artboard: root sits on bg-background
                    # with public/footer-aurora.png (neon wave, stretched
                    # 1886×672 → 1445×231) hugging the band's top edge + 1200px
                    # contact panel slot (renders `<Contact>`, `id="contact"`)
                    # + glass band section (bg-background/40 +
                    # backdrop-blur): brand column (logo.svg up to 435px wide,
                    # proportional height, white/15 via
                    # opacity — design's wordmark is a wider cut, reuse approved,
                    # copyright, LangSwitcher) | IN PAGE + SOCIAL link
                    # categories: equal columns at 600–1023px below the brand;
                    # desktop brand/link row begins at lg (details in design.md)
                    # masts (hairline rows, ↗ on external links only; anchors
                    # #about/#human-ai/#portfolio/#testimonials/#contact, section
                    # ids set on each section). Labels in dictionaries
                    # (dict.footer.mast); hrefs composed here from constants.
      ui/           # Shared UI primitives & client islands:
        Section.tsx             # Shared full-width section shell (docs/design.md): 1440 shell,
                                # 120px xl gutters; centered max-640px shell only at sm
                                # (640–767px), including contact/footer; topbar uses its own wrapper.
                                # `as` + className overrides
        Button.tsx              # Server-compatible button/<a> hybrid; variant 'primary' = gold fill,
                                # dark text; children compose label + trailing icon
        Input.tsx               # Underline text field (server-compatible): full native input
                                # passthrough (text/email/number/password/…); idle #292929,
                                # focus-empty white/65, typed → gold line, error #ed5440
                                # (docs/design.md); error?: string renders message row + aria wiring
        Textarea.tsx            # Underline textarea, same state mapping as ui/Input;
                                # min-h-[150px] resize-y
        Select.tsx              # Controlled select-only combobox using Popover + IconSelector;
                                # gold selected-radio trigger, trigger-width listbox, keyboard
                                # navigation/typeahead, focus retained on trigger; used for interests
        AvailabilityStatus.tsx  # Status enum; label text passed via `labels` prop
        LangSwitcher.tsx        # Client dropdown (IconLanguage + active code + IconSelector);
                                # options EN->'/', ID->'/id' full-name labels, gold active;
                                # full navigation + locale cookie, shared Popover behavior
        Popover.tsx             # Shared hook/panel/option styles for LangSwitcher and Select.
                                # Body portal escapes backdrop-filter ancestors; fixed triggers
                                # get viewport coordinates, others get document coordinates.
                                # Anchors to nearer viewport half, flips up near bottom edge,
                                # follows scrolling document triggers; dismisses on outside pointer,
                                # Escape, offscreen trigger, hidden trigger after resize, or disabled.
                                # Clears stale placement on close; optional trigger-width panel
        SegmentedText.tsx       # Renders Segment[] (tone: dim/gold/strong/goldUnderline)
        SocialNav.tsx           # GitHub + LinkedIn icon links (ui/icons brand marks)
        Statistic.tsx           # react-countup number
        icons.tsx               # Self-hosted inline icon library (no react-icons):
                                # Tabler-stroke icons (24×24, round-cap, currentColor,
                                # 2px stroke): IconPolygon, IconCircleSquare,
                                # IconIcosahedron (AI workflow stages), IconHash
                                # (portfolio tags, 1.25px stroke), IconLanguage,
                                # IconSelector, IconArrowUpRight, IconCheck;
                                # filled marks keep their native viewBox: IconCaretLeft/
                                # Right (Phosphor 256), IconBrandGithub/Linkedin
                                # (Ant Design 1024). Add new icons here.
        ProjectCard.tsx         # Reusable portfolio item (server): `wide` (featured,
                                # full-width 40:17 preview) / `compact` (half-column,
                                # 73:45 preview) variants from md; both use 5:3 below md.
                                # Ratios keep the 2xl sizes at 1200×510 / 584×360.
                                # Preview is edge-to-edge below sm, within section gutters
                                # at sm (592px wide), rounded from sm; `href?` —
                                # circular arrow link hidden when omitted; image =
                                # webp→png optimized <picture> chain (image +
                                # imageFallback props, explicit per-variant sizes)
        TypeAnimation.tsx       # exports ClientTypeAnimation (takes `roles` prop)
        ToolsMarquee.tsx        # react-fast-marquee, 2 rows from TECH_STACK split in half
                                # Viewport-wide below md; at sm, rows break out of the
                                # centered 640px section while its heading stays capped
        TestimonyCarousel.tsx   # Swiper carousel; testimony data via `testimonies` prop
public/
  photo.png logo.svg footer-aurora.png quote.svg opengraph-card.png twitter-card.png
  ai-native-plan.{png,svg} ai-native-design.{png,svg} ai-native-dev.{png,svg}
                                                             # svg = vector card exports
                                                             # (374×132, owner-provided),
                                                             # png = @4x fallback/backup
  projects/  *.webp
  people/    *.jpeg / *.jpg.webp
  techstack/ *.svg (lowercase, dashes for non-alphanumerics, e.g. "next-js.svg")
  techstack/ai/  opencode.svg figma.svg openai.svg gemini.svg (196×60 pre-composed cells)
```

## Render pipeline

1. `src/proxy.ts` routes locale URLs: `/` → rewrite to `/en` (URL stays `/`, English is
   canonical), redirect `/` → `/id` when `Accept-Language` prefers Indonesian, redirect
   `/en/*` → unprefixed. `/id/*` renders directly. Matcher excludes `_next`, `api`, paths with dots.
2. `page.tsx` resolves `lang`, `getDictionary(lang)`, and renders sections in order,
   passing `dict` to each. Sections are server components; interactive bits are client
   islands loaded with `next/dynamic` + `'use client'` (TypeAnimation, Statistic,
   ToolsMarquee, TestimonyCarousel) that receive translated text via props. The contact
   form is a client island too (`ContactForm`), but it submits through the
   `sendContactMessage` Server Action (`actions/contact.ts`) via `useActionState` —
   no route handler, no `src/app/api/`.
3. Styling is Tailwind-4-only via `globals.css` — no `tailwind.config` file. Class order enforced by Biome (`useSortedClasses`).
4. Path alias: `@/*` → `src/*`.
5. Both locales are statically prerendered (`generateStaticParams` on the layout).

## i18n

- Locales: `en` (canonical `/`), `id` (`/id`). Language switcher: Header only (`LangSwitcher`, labels `EN` / `ID`).
- Dictionaries live in `lib/i18n/en.ts` + `id.ts`; both typed as `Dictionary` from
  `types.ts`, so the ID file must stay structurally complete. Copy is plain data —
  strings + `Segment[]` (`tone`: `dim` / `gold` / `strong` / `goldUnderline`) rendered by
  `SegmentedText`; styling stays in components. Spacing between segments is part of the
  segment text (rendered verbatim).
- Hero stat labels use `{ short, long }` per locale (small-screen vs. large-screen text),
  rendered in `Hero.tsx` with breakpoint-hidden spans.
- `html lang`, canonical, hreflang alternates (`en` → `/`, `id` → `/id`), OG/Twitter text
  and `og:locale` all follow the URL locale; OG images stay English-only as before.

## Update recipes

- **Edit any visible copy**: `lib/i18n/en.ts` and `id.ts` (keep both in sync — the
  `Dictionary` type enforces shape, not wording). Translations are drafts; owner revises.
- **Add a locale**: add dictionary file + entry in `lib/i18n/index.ts`, prefix rule in
  `src/proxy.ts`, hreflang pair in `[lang]/layout.tsx`, link in `ui/LangSwitcher.tsx`.
- **Add/edit testimonial**: `testimonial.testimonies` in `en.ts`/`id.ts`. Requires
  `photo` (exact path under `public/people/`), `name`, `title` (role + org combined),
  `quotes` (`Segment[]`, gold `<b>` emphasis via `tone: 'gold'`). Both dictionaries must
  contain the person in the same order (array order = carousel order).
- **Add tool to marquee**: add `{ name, image }` to `TECH_STACK` in `lib/constants/stack.ts`
  (keep name-sorted) + lowercase-dashed SVG in `public/techstack/`. Marquee rows split list
  in half automatically.
- **Edit AI workflow copy**: `aiWorkflow.*` in `en.ts`/`id.ts` (headline pair rendered by
  the component: line 1 plain, line 2 gold+bold; intro/toolkit are `Segment[]`; stage
  descriptions + their illustration alts in `aiWorkflow.stages.*`). Stage card visuals
  (shell bg/border, icon component, SVG paths) live in the `STAGES` const in
  `AiWorkflow.tsx`.
  Card illustrations are vector `public/ai-native-*.svg` exports (374×132, from Figma
  nodes 699:459 / 699:489 / 699:534); PNG variants kept as backup. When re-exporting,
  update the Image `width`/`height` to the new intrinsic size (display is
  `h-auto w-full`).
- **Edit portfolio copy**: `portfolio.tagline` + `portfolio.projects.*` in `en.ts`/`id.ts`
  (keys must match the `key` fields in `Portfolio.tsx` `PROJECTS`). Titles/tags stay in
  `PROJECTS` (proper nouns, locale-independent).
- **Swap/add project image**: replace webp/png pair under `public/projects/` keeping the
  filename (flat single-image export of the full preview panel). `ProjectCard` re-imports
  them by path — no code change. Per-variant `sizes` live in `ui/ProjectCard.tsx`.
- **Add project link**: pass `href` to the `card` call in `Portfolio.tsx`; without a link
  the circular arrow button is hidden.
- **Add/edit footer mast link**: label in `footer.mast.links.*` / `footer.mast.socialLinks.*` (en + id); target/external flag composed in `Footer.tsx` (`inPageLinks` / `socialLinks` arrays). In-page links need a matching section `id`.
- **Change hero stats**: numbers in `Hero.tsx` (`value`), labels in dictionaries (`hero.stats`).
- **Change availability**: `variant={Status.X}` in `Header.tsx`; statuses defined in `ui/AvailabilityStatus.tsx`, labels in dictionaries (`header.status`).
- **Change typed roles / location**: `hero.roles` / `hero.location` in dictionaries.
- **Change bio**: `about.bio` segments in dictionaries.
- **Edit contact form copy**: `contact.*` in `en.ts`/`id.ts` (heading, prompt, choice
  labels, field labels/placeholders, submit/success, error texts). The server action
  returns error KEYS (`contact.errors.*`) that the client resolves — keep those key
  names stable. Email copy (subject + body of both messages) is colocated in
  `lib/mail/templates.ts` — the owner notification is EN-only regardless of the
  visitor's locale; the auto-reply has an en/id branch — not in the dictionaries.
- **Change contact sender/recipient**: root `.env` — `CONTACT_FROM_EMAIL`
  (shared sending address, required valid email) and per-email-type display
  names `CONTACT_NOTIFICATION_FROM_NAME` / `CONTACT_AUTO_REPLY_FROM_NAME`
  (optional; header falls back to the bare address), `CONTACT_TO` (owner
  inbox). Resend requires the sending domain to be verified in the Resend
  dashboard.
- **Tune abuse throttling**: root `.env` — `CONTACT_RATE_LIMIT` (submissions per
  window) and `CONTACT_RATE_WINDOW_MIN` (window in **minutes**). Optional; invalid
  or 0 values fall back to defaults (5 / 10 min), clamped to a minimum of 1 — never
  disables the limiter. In-memory per process (resets on cold start); no Redis.
- **Change contact rate-limit or mail behavior**: `lib/contact/rate-limit.ts`
  (limiter + env parsing), `lib/contact/validate.ts` (field limits, sanitization),
  `lib/mail/` (Resend client + email builders), `actions/contact.ts` (submission
  flow). Env vars must be read inside functions with literal key names.

## Asset conventions

- `logo.svg` is the tight wordmark (118.54×21.8, paths white) traced from the .pen
  Main artboard (node o2Uk3m). Header wraps it in `p-[7.2px]` to reproduce the
  design's 133×36 logo slot; footer renders it up to 435px wide (about 80px tall),
  capped to its column with automatic height and `opacity-15` for the design's
  white/15. `footer-aurora.png` is the "Golden
  ambience — neon aurora" export (1886×672; rendered at its natural aspect
  ratio with `object-cover` — full width, no distortion, no clipping).
  In `Footer.tsx` the aurora layer lives in the band's `z-10` wrapper as an
  absolute `bottom-full` sibling BEFORE the band glass, so it paints behind
  BOTH footer content sections (the contact `Section` runs `z-20`); the band's
  `backdrop-blur-md` reads it through the glass, per the .pen Footer root
  (node lze4B, aurora spans mid-contact-section → band top). The contact wrapper's
  `mb-[-216px]` pulls the band upward; 220px band top padding at every breakpoint
  plus 56px inner padding keeps the wordmark below the contact panel.

- People photos referenced by exact filename — mixed formats (`*.jpeg`, `*.jpg.webp`), no rename guarantees. Copy filename exactly.
- Techstack SVG filenames are lowercase, `-` for non-alphanumeric characters (`react-router.svg`, `next-js.svg`).
- Projects are webp, `object-cover`, `fill` + explicit `sizes`.

<!-- verified against: d873926b789176a37298874c76d3eb11d72a1793 + working tree, 2026-10-26 (responsive layouts; lg Hero uses a 480px portrait, 728px minimum height, and 64px gap before About) -->

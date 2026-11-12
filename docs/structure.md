# Structure

Annotated tree, render pipeline, and update recipes for content edits.

## Tree

```
src/
  proxy.ts          # Locale routing: / → rewrite to /en (URL stays /, English is
                    # canonical); redirect / → /id when the visitor's NEXT_LOCALE_COOKIE
                    # pick (LangSwitcher) is a non-default locale, else when
                    # Accept-Language prefers Indonesian; /en/* → redirects to /;
                    # /id served as-is. Accept-Language parsed in detectLocale().
  app/
    [lang]/
      layout.tsx    # Root layout: fonts (Antonio, Plus Jakarta Sans) via CSS vars,
                    # <html lang={lang}>; generateStaticParams (en, id);
                    # generateMetadata per locale from dict.metadata (images unchanged)
      page.tsx      # Loads dict for lang, resolves availability (lib/availability),
                    # passes both to every section (Header/Hero take the badge).
                    # Body wrapper
                    # owns the vertical rhythm (gap-20 / lg:gap-[120px], pb before
                    # footer) per the .pen Main artboard; sections carry no mb-*
    globals.css     # Tailwind import, theme tokens, custom utilities (see design.md)
    icon.png        # Favicon set (icon.png + icon2/3/4.png + apple-icon.png
                    # siblings) — app icons from the .pen icon family
                    # (arvi-brand-ui.pen — design source lives outside this repo
                    # and is untracked; frame "Website icon assets — Alert day",
                    # node nvy4Z; 2026-11-03 owner pass): icon.png 512
                    # (from android-chrome-512, rjbaC), icon2/3/4.png 48/32/16
                    # (xXevm/qBIRb/sdfYm), apple-icon.png 180 (rPGe8) — all
                    # exported 1:1 at scale 1, gold ground #E9B63C + mark
                    # #3F2411. File conventions auto-emit the <link>s; no
                    # favicon.ico, no manifest
    actions/
      contact.ts    # 'use server' sendContactMessage(prev, formData) — contact form
                    # endpoint: rate limit → time trap → honeypot → sanitize →
                    # validate → config check → owner mail (reply_to = visitor) →
                    # auto-reply (best effort). Returns i18n error KEYS, never raw
                    # errors; env vars read inside functions, literal key names.
    lib/
      availability.ts  # Env-driven status resolver: AVAIL_* booleans read at render time —
                       # getAvailability() fail-closed chain (AVAIL_IS_CLOSED forced red >
                       # AVAIL_LOOKING_FOR_JOB green, label ignores the toggles > any
                       # toggle → yellow, composed label lists the active ones >
                       # nothing → red, empty list composes '' so no open label ever
                       # renders); readFlag truthiness (empty/false/0 off);
                       # called from [lang]/page.tsx, passed down as serializable props
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
                    # types.ts (Segment, Dictionary — header.status.open typed by
                    # lib/availability's OpenLabelStrings, ContactLabels), en.ts + id.ts
                    # (dictionaries)
    components/     # Sections (server components), all receive `dict: Dictionary`
      Header.tsx    # Sticky topbar (client): logo (138×32 — the full lockup
                    # traced from .pen node Zybny as /logo.svg) + 18px gap +
                    # SocialNav (24×24 anchors with 18px glyphs from .pen
                    # node gj6H2) + LangSwitcher +
                    # AvailabilityStatus; bg-background/70 + backdrop-blur; scrolled
                    # state shrinks padding (py-6→py-2) and fades in 1px bottom line
      Hero.tsx      # Mobile-only availability badge (sm:hidden, above the name —
                    # the topbar has no room at uSM); both badge spots receive the
                    # same resolved availability from page.tsx. Name, TypeAnimation,
                    # Statistic row, portrait Image (photo.avif, fill +
                    # object-contain, priority). From xl: 478px copy column beside
                    # a proportional, shrinkable portrait; positioned wrapper
                    # contains Image fill. From 1440px: 200px gap, fixed 584×877
                    # photo overhanging the 700px hero by 177px. Below lg photo
                    # stays absolute, fully opaque (the 0.33 phone dim is gone,
                    # 2026-11-01): on phones the 437×656 box centers in the
                    # 100dvh − 92px hero, top = max(calc((100dvh − 92px − 656px)/2),
                    # −38px) — the −38px floor is the glass topbar ceiling
                    # (iPhone SE measured); placement right from 600px (viewport
                    # x318/top11, bleeding 115px off the right edge until 672px,
                    # then frozen at x350 through md — the pen @MD x415/y25 is
                    # waived); lg rows a 484px portrait flush right in a 640px
                    # hero (726px tall, ~86px past the hero bottom). Name type
                    # 76px below lg, 112px from lg. Below 600px the hero fills
                    # the viewport below the fixed topbar (min-h calc(100dvh -
                    # 92px)); copy packs to the hero bottom (justify end, 32px
                    # min gap), pads pt-0 pb-12 (48px → 88px to the About
                    # heading). From 600px until sm it mirrors the md look
                    # (2026-11-03): pt-12 pb-0, natural height, copy unpacked at
                    # the 48px gap, photo top-11. Body rhythm 72px at uSM, 40
                    # from sm, 80 lg, 120 xl. 3 stats in one row every width
                    # (gap 16 at uSM, 32 from sm, 20 at lg); only sm+ keeps pb-0
      About.tsx     # Bio paragraphs via SegmentedText, .about-box-accent headline;
                    # CV CTA button (ui/Button structured label + icon) centered on uSM,
                    # left from sm; greeting 'Hi, buddy.' (en) above the headline;
                    # side-by-side from lg (headline col shrink-0 + bio, 72px gap);
                    # sm/md 24px margin extends the Hero → About gap to 64px;
                    # uSM: bio gap 24, gold box per PeTso (2026-11-02): square
                    # pinned left 132px, w 161.5/h 155, one composition for
                    # uSM/SM/MD (legacy carriers from lg), bio gap reservation,
                    # pt 38 rows at uSM, lh 1.25, stroke 2px (owner override);
                    # right-border strip EN-only below lg (ID: max-lg:hidden)
      TechStack.tsx # Heading + subline via SegmentedText + ToolsMarquee (uSM: rows
                    # h-9, heading→rows 48, per the 2026-11-02 pen pass)
      AiWorkflow.tsx # AI-native — Connected Workflow (Figma node 699-419): 48px two-tone
                     # headline + intro; 3 stage cols from lg (PLAN/DESIGN/DEVELOP, Antonio
                     # 26px + 24px custom icon from ui/icons.tsx); stage rows are
                     # horizontal (narrative ∥ artwork, equal halves, 24px gap) from sm
                     # (@SM artboard mpHpG 2026-11-02), stacked below sm; toolkit row
                     # side-by-side from lg (centered label + logos wrapping 2×2 at lg,
                     # single row at xl, label left in the 320px column); uSM+SM tighten:
                     # block joints 32, stage gap 16, title→desc 4 (uSM), centered toolkit
                     # label below md (desc leading 22, headline tracking −0.048em)
                     # + closing thought row; card shells are code (bg/border
                     # per design); PLAN + DESIGN render animated inline SVG via
                     # ui/PlanIllustration / ui/DesignIllustration (7.2s scenery loops);
                     # DEVELOP via ui/DevelopIllustration — static composition + blinking
                     # caret on line 03 only (owner verdict: heavy text animation too
                     # fussy). Logo row: public/techstack/ai/*.svg. Copy in
                     # dictionaries (aiWorkflow key); stage shells/icons/images in STAGES const
      AiNativeToolkit.tsx # AI-native — Floating Introduction + Four-Stage Toolkit (Unified
                     # Narrative), .pen node T9rslD (2026-11-12 penhand handoff,
                     # checksum 14f6c7b4789c…). Rendered BELOW AiWorkflow (both live).
                     # Intro: 460px narrative (two-tone 48px headline + three
                     # $text-secondary paragraphs) beside a 676×463 floating collage —
                     # the three stage cards reused from ui/PlanIllustration /
                     # ui/DesignIllustration / ui/DevelopIllustration inside rotated
                     # shells (−3°/+3°/−2°, border #30302B, shadow 0 12px 28px
                     # #00000066), %-positioned in an aspect-locked canvas so the
                     # collage scales as one unit (design is @1440-only; documented
                     # adaptation). Toolkit band: two ambient ribbon arcs (inline SVG,
                     # gradients + blur, bleeding above the glass) behind a glass
                     # matrix (bg #0A0A08CC, border #292924, backdrop-blur 20, 2px
                     # horizontal trace gradient) with 4 instrument stations
                     # (overline/logo stage/model strip/narrative): 4-up at xl
                     # (design exact), 2×2 from md, 1 column below md. Overlines,
                     # strip labels and model chips are design labels in the
                     # STATIONS const; titles + descriptions in dictionaries
                     # (aiToolkit.stations). Logos: public/ai-native/*.svg. The pen's
                     # disabled nodes (Anchored header band cCTFV, Conduit telemetry
                     # bar eMYZ9) are intentionally not rendered
      Portfolio.tsx # Redesigned per Figma node 681-441: heading band (wordmark +
                    # dict tagline + 1px white/15 divider, sticky from sm below topbar;
                    # rows fade behind it via ui/PortfolioItemFade) → one featured
                    # `wide` ProjectCard + two
                    # rows × 2 `compact` cards; per-project data in PROJECTS const
                    # (titles/tags/surface/image locale-independent), descriptions
                    # + tagline in dictionaries (dict.portfolio); takes `locale`
                    # AND `dict`; Indonesian heading is 64px below sm;
                    # #portfolio scroll margins clear the fixed header (design.md)
      Testimonial.tsx # Heading + IconQuote mark (48px gold, ui/icons.tsx) + TestimonyCarousel
                      # inside ui/HydrateInView (static CarouselFallback until the
                      # section nears the viewport — 2026-11-02 mobile-load fix)
      Contact.tsx   # Contact panel (server) per the .pen "Contact panel" component (gQvrX):
                    # glass panel shell, TWO gold ambient glows (top-left/top-right,
                    # aria-hidden + pointer-events-none — bottom-right removed with the
                    # 2026 design update; pulses disabled in the pen file), invitation
                    # heading + gold rule, two-col layout (interests | form) with
                    # hairline divider; renders ContactForm
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
      Footer.tsx    # Footer per the .pen Footer frame (node lze4B), relative-flow
                    # content at every width (no contact pull, no band clear-out —
                    # the panel and band never overlap); decoration = aurora strip
                    # (231px box, footer-aurora.avif windowed by Image fill +
                    # objectFit: cover — see Asset conventions) + absolute background (GcP61:
                    # bg-background/40 + border-t + backdrop-blur) as a flex-column
                    # pair inside the z-10 band wrapper — strip's bottom edge ≡
                    # background top edge; key `-top-[395px]` universal (164px
                    # overhang + 231px strip, panel flush on the band edge). Band
                    # pads: uSM pt-0 pb-8; sm+ pt-12 pb-16, xl pb-12; inner
                    # band py-14 below xl / py-10 at xl; glass fill/border/blur all
                    # on the GcP61 layer (crystal wrapper positions content only).
                    # Contact: section uSM pt-12 / md pt-16, xl pt-0 = 80px content
                    # top pad (xl:pt-20) + px-12, no bottom pad. + 1200px
                    # contact panel slot (renders `<Contact>`, `id="contact"`) +
                    # band content row: brand column (logo.svg 274×64 solid white,
                    # w-[274px] capped to its column, copyright,
                    # LangSwitcher) | IN PAGE + SOCIAL link categories: equal columns
                    # at 600–1023px below the brand; desktop brand/link row begins
                    # at lg (details in design.md) masts (full-width below 600px
                    # per pen WYfOW 2026-11-02; hairline rows, ↗ on
                    # external links only; anchors
                    # #about/#human-ai/#portfolio/#testimonials/#contact, section
                    # ids set on each section). Labels in dictionaries
                    # (dict.footer.mast); hrefs composed here from constants.
      ui/           # Shared UI primitives & client islands:
        Section.tsx             # Shared section shell (docs/design.md): fluid gutters (24/32)
                                # only below sm; fixed containers from md — 672/896/1200 content;
                                # topbar caps the same way; root overflow-x clip kills page
                                # hscroll. `as` + className overrides
        Button.tsx              # Server-compatible button/<a> hybrid; sharp glass (variant D):
                                # structured label/icon/iconOnly content, morphogram loading,
                                # exports ButtonFrame + LoaderSlot (custom-loader escape hatch)
        Input.tsx               # Underline text field (server-compatible): full native input
                                # passthrough (text/email/number/password/…); idle #292929,
                                # focus-empty white/65, typed → gold line, error #ed5440
                                # (docs/design.md); error?: string renders message row + aria wiring
        Textarea.tsx            # Underline textarea, same state mapping as ui/Input;
                                # min-h-[150px] resize-y
        Select.tsx              # Controlled select-only combobox using Popover + IconSelector;
                                # gold selected-radio trigger, trigger-width listbox, keyboard
                                # navigation/typeahead, focus retained on trigger; used for interests
        AvailabilityStatus.tsx  # Status enum; labels (incl. composed `open`) passed via `labels` prop
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
                                # (portfolio tags, 1.25px stroke), IconQuote
                                # (testimonial mark), IconLanguage,
                                # IconSelector, IconArrowUpRight, IconCheck;
                                # filled marks keep their native viewBox: IconCaretLeft/
                                # Right (Phosphor 256), IconBrandGithub (ui/Button
                                # `brand-github`) + IconGithubMark/IconLinkedinMark
                                # (SocialNav), IconBrandLinkedin (Ant Design 1024).
                                # Add new icons here.
        PlanIllustration.tsx    # Animated PLAN stage-card illustration (Figma 699:459):
                                # inline SVG traced from the export, 7.2s CSS keyframe
                                # loop (.plan-* in globals.css); reduced motion = static
        DesignIllustration.tsx  # Animated DESIGN stage-card illustration (Figma 699:489):
                                # same inline-SVG + keyframes approach, 7.2s loop;
                                # reduced motion = static
        DevelopIllustration.tsx # DEVELOP stage-card illustration (Figma 699:534): static
                                # composition, only the line-03 caret blinks; reduced
                                # motion hides it
        ProjectCard.tsx         # Reusable portfolio item (server): `wide` (featured,
                                # full-width 40:17 preview) / `compact` (half-column,
                                # 73:45 preview) variants from md; both use 5:3 below md.
                                # Heights derive from the column width — at the 1440 shell
                                # they render 1200×510 / 584×360.
                                # Preview is edge-to-edge below sm, within section gutters
                                # from sm (576px at the 640px viewport), rounded from sm; `href?` —
                                # webp→png optimized <picture> chain (image +
                                # imageFallback props, explicit per-variant sizes)
        TypeAnimation.tsx       # exports ClientTypeAnimation (takes `roles` prop)
        ToolsMarquee.tsx        # Pure CSS transform marquee (server component — the
                                # 2026-11-02 mobile-load fix replaced react-fast-marquee);
                                # 2 rows from TECH_STACK split in half, opposite
                                # directions. Viewport-wide below lg; content-width
                                # from lg (896) / xl (1200); CSS-mask row fade
        TestimonyCarousel.tsx   # Swiper at every width (pen row dimensions: 330 wrapper
                                # / 250px viewport below lg, 464 / 336px at lg; 80px slides,
                                # neighbors scale 0.6 = the pen's 48px dimmed avatars);
                                # testimony data via `testimonies` prop
        HydrateInView.tsx       # Defers hydrating heavy, below-the-fold client components
                                # (Swiper carousel) until the section nears the viewport;
                                # static fallback until ready, rootMargin pre-render
                                # lead (2026-11-02 mobile-load fix)
        PortfolioItemFade.tsx   # Fades portfolio rows as they scroll behind the sticky
                                # heading (imperative scroll listener + rAF, no state)
public/
  photo.avif logo.svg footer-aurora.avif opengraph-card.png twitter-card.png
  ai-native-plan.svg ai-native-design.svg ai-native-dev.svg
                                                             # svg = static export twins
                                                             # of the ui/*Illustration
                                                             # inline components
                                                             # (374×132, owner-provided)
  ai-native/  obsidian.svg pen-dev.svg openchamber.svg fallow.svg
                                                             # brand lockups traced
                                                             # from the .pen tree
                                                             # (node T9rslD handoff:
                                                             # D5ETw/S62Vk/nukhj/
                                                             # abz0R) — white marks,
                                                             # exact path geometry,
                                                             # viewBox = frame size
  logo-raster-dark.png logo-raster-light.png                 # email wordmarks (mail
                                                             # templates, absolute URLs)
  photo.png footer-aurora.png                                # full-res masters, kept
                                                             # unreferenced by code
  projects/  *.webp + *.png                                  # webp served, png <picture> fallback
  people/    *.jpeg / *.jpg.webp
  techstack/ *.svg (lowercase, dashes for non-alphanumerics, e.g. "next-js.svg")
  techstack/ai/  opencode.svg figma.svg openai.svg gemini.svg (196×60 pre-composed cells)
```

## Render pipeline

1. `src/proxy.ts` routes locale URLs: `/` → rewrite to `/en` (URL stays `/`, English is
   canonical), redirect `/` → `/id` when the visitor's `NEXT_LOCALE_COOKIE` pick
   (LangSwitcher) is a non-default locale, else when `Accept-Language` prefers
   Indonesian; `/en/*` → unprefixed. `/id/*` renders directly. Matcher excludes
   `_next`, `api`, paths with dots.
2. `page.tsx` resolves `lang`, `getDictionary(lang)`, and the availability badge
   (`lib/availability`), then renders sections in order, passing both to each. Sections
   are server components; interactive bits are client islands loaded with
   `next/dynamic` + `'use client'` (TypeAnimation + Statistic in Hero, TestimonyCarousel
   in Testimonial — the carousel also hydrates in-view via `ui/HydrateInView` with a
   static fallback). The contact form is a client island too (`ContactForm`), but it
   submits through the `sendContactMessage` Server Action (`actions/contact.ts`) via
   `useActionState` — no route handler, no `src/app/api/`.
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
  Card illustrations are animated inline SVGs: ui/PlanIllustration /
  ui/DesignIllustration (7.2s keyframe loops — `.plan-*` / `.design-*` in
  globals.css) and ui/DevelopIllustration (blinking line-03 caret only). The
  `public/ai-native-*.svg` exports (374×132, from Figma nodes 699:459 / 699:489 /
  699:534) are the static source twins — not rendered; reduced motion shows the
  static composition. When re-animating, re-trace the component + keyframes from
  the new export.
- **Edit AI toolkit copy**: `aiToolkit.*` in `en.ts`/`id.ts` (headline pair, the three
  paragraphs, card alt texts, station titles + descriptions). Station overlines, strip
  labels and model chips live in the `STATIONS` const in `AiNativeToolkit.tsx`
  (design labels, locale-independent); the floating cards reuse
  ui/PlanIllustration / ui/DesignIllustration / ui/DevelopIllustration inside the
  rotated shells — restyle the shells there. The four lockups
  (`public/ai-native/*.svg`) were traced from the .pen tree (node T9rslD:
  frames D5ETw/S62Vk/nukhj/abz0R) — replace the SVG files to swap a logo.
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
- **Change availability**: no code edit — set root `.env` vars (`.env.example` lists
  every var with comments; Vercel project envs in prod):
  `AVAIL_IS_CLOSED` (forced red) > `AVAIL_LOOKING_FOR_JOB` (green; the label ignores the
  open-type toggles) > `AVAIL_FREELANCE` / `AVAIL_PARTNERSHIP` / `AVAIL_OPEN_TO_OFFER`
  (any one → yellow; the yellow label lists the active ones). All boolean
  (empty/false/0 = off); nothing set → red (the composed open label is '' and never
  renders). Resolver
  `lib/availability.ts` runs at render time in `[lang]/page.tsx` (Header is a client
  component — envs must stay server-side) and is passed to `Header.tsx` + `Hero.tsx` as
  props; both badges stay in sync automatically. Yellow label parts live in dictionaries
  (`header.status.open` — prefix/comma/and + one noun per toggle). Status change requires a
  redeploy (envs are baked into the prerendered HTML).
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

- Design sources (`arvi-brand-ui.pen`, brand exports, full-res masters) live outside
  this repo and are untracked. `.pen` node/frame references in this doc are provenance
  notes, not in-repo paths; runtime assets are the copies under `public/`.
- `logo.svg` is the full logo lockup (mark + wordmark, paths white, viewBox
  2525.804×587.277) traced from the .pen file (node Zybny — all-white variant,
  transparent background). Header renders it at 138×32 (the design's Navigation
  slot, node COKOj/gj6H2); the footer renders it at 274×64 solid white, capped
  to its column with automatic height. `footer-aurora.avif` is the "Golden
  ambience — neon aurora" export (node aIybe in the 2026 pen Home @ XL frame,
  `LAhVl`): 1886×674 @1x AVIF (q50) of the blurred .pen art — opacity and blur
  bleed are baked into the export, so no code-level opacity applies. Rendered
  `fill` + `objectFit: cover` + `sizes="100vw"` inside the strip's 231px box
  (a center window onto the art; the 2026-11-02 mobile-load fix replaced a
  1.4MB @2x PNG drawn at natural aspect). The full-res `footer-aurora.png`
  master (3762×1345) stays unreferenced, as does `photo.png` (1752×2631 —
  the served portrait is `photo.avif`).

  In `Footer.tsx` the aurora strip + background live inside the band's
  `z-10` wrapper as a flex-column pair at every width: aurora strip box
  `h-[231px]` (Image fill + objectFit: cover — a center window onto the art),
  then the background layer (`bg-background/40 border-t border-white/15
  backdrop-blur-md flex-1`) filling to the wrapper's bottom edge (= footer
  bottom). The pair keys `-top-[395px]` on the band wrapper at every width:
  164px design overhang + 231px strip — the content is relative flow everywhere,
  so the panel bottom is flush on the band edge and the hairline always reads
  164px above the panel bottom. The band's former glass layer carries no fill
  of its own anymore (the pair's ground IS the glass); it only positions its
  content above the pair.

- People photos referenced by exact filename — mixed formats (`*.jpeg`, `*.jpg.webp`), no rename guarantees. Copy filename exactly.
- Techstack SVG filenames are lowercase, `-` for non-alphanumeric characters (`react-router.svg`, `next-js.svg`).
- Projects are webp, `object-cover`, `fill` + explicit `sizes`.

<!-- verified against: 3a513b8 + working tree, 2026-11-13 (doc refresh: tree, recipes and asset list reconciled with the squashed availability commit; availability badge env-driven via AVAIL_* + lib/availability.ts; design sources moved outside the repo; .pen references documented as provenance, not paths; AiNativeToolkit (pen T9rslD handoff) added below AiWorkflow with public/ai-native/*.svg lockups) -->

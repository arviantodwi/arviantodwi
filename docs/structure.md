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
      page.tsx      # Loads dict for lang, passes it to every section
    globals.css     # Tailwind import, theme tokens, custom utilities (see design.md)
    icon.png        # Favicon
    lib/
      constants/   # index.ts (GITHUB_URL, LINKEDIN_URL, CV_URL, NEXT_LOCALE_COOKIE —
                   # barrel, re-exports stack.ts), stack.ts (TECH_STACK, 30 items,
                   # sorted by name)
      utils.ts     # cx() = clsx + tailwind-merge
      i18n/        # Locale infra: index.ts (hasLocale/getDictionary/locales),
                    # types.ts (Segment, Dictionary), en.ts + id.ts (dictionaries)
    components/     # Sections (server components), all receive `dict: Dictionary`
      Header.tsx    # Sticky topbar (client): logo + SocialNav + LangSwitcher +
                    # AvailabilityStatus; bg-background/70 + backdrop-blur; scrolled
                    # state shrinks padding (py-6→py-2) and fades in 1px bottom line
      Hero.tsx      # Name, TypeAnimation, Statistic row, portrait Image
      About.tsx     # Bio paragraphs via SegmentedText, .about-box-accent headline,
                    # centered CV CTA button (ui/Button + TbArrowUpRight)
      TechStack.tsx # Heading + subline via SegmentedText + ToolsMarquee
      AiWorkflow.tsx # AI-native — Connected Workflow (Figma node 699-419): 48px two-tone
                     # headline + intro; 3 stage cols (PLAN/DESIGN/DEVELOP, Antonio 26px
                     # + 24px custom icon from ui/icons.tsx) — card shells are code (bg/border
                     # per design); PLAN + DESIGN render animated inline SVG via
                     # ui/PlanIllustration / ui/DesignIllustration (7.2s scenery loops);
                     # DEVELOP via ui/DevelopIllustration — static composition + blinking
                     # caret on line 03 only (owner verdict: heavy text animation too
                     # fussy). Logo row: public/techstack/ai/*.svg. Copy in
                     # dictionaries (aiWorkflow key); stage shells/icons/images in STAGES const
      Portfolio.tsx # Redesigned per Figma node 487-67: PORTFOLIO wordmark (Antonio, per-
                    # locale) + gold bar; 5 project rows — title/tags column (300px) +
                    # gold-bordered 850:540 media panel; data in PROJECTS const (proper
                    # nouns, locale-independent); takes `locale`, not `dict`
      Portfolio.legacy.tsx # Pre-redesign portfolio (CSS grid + weight-graded experiment);
                           # not imported anywhere — kept as reference only
      Testimonial.tsx # Heading + TestimonyCarousel
      Footer.tsx    # Copyright + SocialNav (mobile only)
      ui/           # Shared UI primitives & client islands:
        Button.tsx              # Server-compatible button/<a> hybrid; variant 'primary' = gold fill,
                                # dark text; children compose label + trailing icon
        AvailabilityStatus.tsx  # Status enum; label text passed via `labels` prop
        LangSwitcher.tsx        # Client dropdown (TbLanguage + active code + TbSelector);
                                # options EN->'/', ID->'/id' full-name labels, gold active
        SegmentedText.tsx       # Renders Segment[] (tone: dim/gold/strong/goldUnderline)
        SocialNav.tsx           # GitHub + LinkedIn icon links
        Statistic.tsx           # react-countup number
        icons.tsx               # Custom inline icons (Tabler conventions: 24×24, 2px
                                # round-cap stroke, currentColor) — IconPolygon,
                                # IconCircleSquare, IconIcosahedron (AI workflow stages)
        TypeAnimation.tsx       # exports ClientTypeAnimation (takes `roles` prop)
        ToolsMarquee.tsx        # react-fast-marquee, 2 rows from TECH_STACK split in half
        TestimonyCarousel.tsx   # Swiper carousel; testimony data via `testimonies` prop
public/
  photo.png logo.svg quote.svg opengraph-card.png twitter-card.png
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
   ToolsMarquee, TestimonyCarousel) that receive translated text via props.
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
- **Swap/add project image**: webp in `public/projects/`, add `<Image>` cell in `Portfolio.tsx` grid (grid spans are hand-tuned per breakpoint — follow existing pattern).
- **Change hero stats**: numbers in `Hero.tsx` (`value`), labels in dictionaries (`hero.stats`).
- **Change availability**: `variant={Status.X}` in `Header.tsx`; statuses defined in `ui/AvailabilityStatus.tsx`, labels in dictionaries (`header.status`).
- **Change typed roles / location**: `hero.roles` / `hero.location` in dictionaries.
- **Change bio**: `about.bio` segments in dictionaries.

## Asset conventions

- People photos referenced by exact filename — mixed formats (`*.jpeg`, `*.jpg.webp`), no rename guarantees. Copy filename exactly.
- Techstack SVG filenames are lowercase, `-` for non-alphanumeric characters (`react-router.svg`, `next-js.svg`).
- Projects are webp, `object-cover`, `fill` + explicit `sizes`.

<!-- verified against: 28d8aec, 2026-09-30 (AiWorkflow section added in-session; move SHA on next commit) -->

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
    libs/
      constants.ts  # GITHUB_URL, LINKEDIN_URL, TECH_STACK (32 items, sorted by name)
      utils.ts      # cx() = clsx + tailwind-merge
      i18n/         # Locale infra: index.ts (hasLocale/getDictionary/locales),
                    # types.ts (Segment, Dictionary), en.ts + id.ts (dictionaries)
    components/     # Sections (server components), all receive `dict: Dictionary`
      Header.tsx    # Sticky, logo + SocialNav + LangSwitcher + AvailabilityStatus
      Hero.tsx      # Name, TypeAnimation, Statistic row, portrait Image
      About.tsx     # Bio paragraphs via SegmentedText, .about-box-accent headline
      TechStack.tsx # Heading + subline via SegmentedText + ToolsMarquee
      Portfolio.tsx # Heading + subline + 4 project Images in hand-tuned CSS grid
      Testimonial.tsx # Heading + TestimonyCarousel
      Footer.tsx    # Copyright + SocialNav (mobile only)
      ui/           # Client islands ('use client'), all loaded via next/dynamic:
        AvailabilityStatus.tsx  # Status enum; label text passed via `labels` prop
        LangSwitcher.tsx        # Client dropdown (TbLanguage + active code + TbSelector);
                                # options EN->'/', ID->'/id' full-name labels, gold active
        SegmentedText.tsx       # Renders Segment[] (tone: dim/gold/strong/goldUnderline)
        SocialNav.tsx           # GitHub + LinkedIn icon links
        Statistic.tsx           # react-countup number
        TypeAnimation.tsx       # exports ClientTypeAnimation (takes `roles` prop)
        ToolsMarquee.tsx        # react-fast-marquee, 2 rows from TECH_STACK split in half
        TestimonyCarousel.tsx   # Swiper carousel; testimony data via `testimonies` prop
public/
  photo.png logo.svg quote.svg opengraph-card.png twitter-card.png
  projects/  *.webp
  people/    *.jpeg / *.jpg.webp
  techstack/ *.svg (names may contain spaces, e.g. "Next.js.svg")
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
- Dictionaries live in `libs/i18n/en.ts` + `id.ts`; both typed as `Dictionary` from
  `types.ts`, so the ID file must stay structurally complete. Copy is plain data —
  strings + `Segment[]` (`tone`: `dim` / `gold` / `strong` / `goldUnderline`) rendered by
  `SegmentedText`; styling stays in components. Spacing between segments is part of the
  segment text (rendered verbatim).
- Hero stat labels use `{ short, long }` per locale (small-screen vs. large-screen text),
  rendered in `Hero.tsx` with breakpoint-hidden spans.
- `html lang`, canonical, hreflang alternates (`en` → `/`, `id` → `/id`), OG/Twitter text
  and `og:locale` all follow the URL locale; OG images stay English-only as before.

## Update recipes

- **Edit any visible copy**: `libs/i18n/en.ts` and `id.ts` (keep both in sync — the
  `Dictionary` type enforces shape, not wording). Translations are drafts; owner revises.
- **Add a locale**: add dictionary file + entry in `libs/i18n/index.ts`, prefix rule in
  `src/proxy.ts`, hreflang pair in `[lang]/layout.tsx`, link in `ui/LangSwitcher.tsx`.
- **Add/edit testimonial**: `testimonial.testimonies` in `en.ts`/`id.ts`. Requires
  `photo` (exact path under `public/people/`), `name`, `title` (role + org combined),
  `quotes` (`Segment[]`, gold `<b>` emphasis via `tone: 'gold'`). Both dictionaries must
  contain the person in the same order (array order = carousel order).
- **Add tool to marquee**: add `{ name, image }` to `TECH_STACK` in `libs/constants.ts` (keep name-sorted) + SVG in `public/techstack/`. Marquee rows split list in half automatically.
- **Swap/add project image**: webp in `public/projects/`, add `<Image>` cell in `Portfolio.tsx` grid (grid spans are hand-tuned per breakpoint — follow existing pattern).
- **Change hero stats**: numbers in `Hero.tsx` (`value`), labels in dictionaries (`hero.stats`).
- **Change availability**: `variant={Status.X}` in `Header.tsx`; statuses defined in `ui/AvailabilityStatus.tsx`, labels in dictionaries (`header.status`).
- **Change typed roles / location**: `hero.roles` / `hero.location` in dictionaries.
- **Change bio**: `about.bio` segments in dictionaries.

## Asset conventions

- People photos referenced by exact filename — mixed formats (`*.jpeg`, `*.jpg.webp`), no rename guarantees. Copy filename exactly.
- Techstack SVG filenames contain dots and spaces (`React Router.svg`, `Next.js.svg`) — quote in paths.
- Projects are webp, `object-cover`, `fill` + explicit `sizes`.

<!-- verified against: 28d8aec, 2026-09-30 -->

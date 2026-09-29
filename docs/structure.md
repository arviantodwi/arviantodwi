# Structure

Annotated tree, render pipeline, and update recipes for content edits.

## Tree

```
src/app/
  layout.tsx        # Root layout: fonts (Antonio, Plus Jakarta Sans) via CSS vars,
                    # full metadata block (title/description/OG/Twitter)
  page.tsx          # Composes sections; wraps main content in .blurred-circle-accent
  globals.css       # Tailwind import, theme tokens, custom utilities (see design.md)
  icon.png          # Favicon
  libs/
    constants.ts    # GITHUB_URL, LINKEDIN_URL, TECH_STACK (32 items, sorted by name)
    utils.ts        # cx() = clsx + tailwind-merge
  components/       # Server components (sections, default)
    Header.tsx      # Sticky, logo + SocialNav + AvailabilityStatus
    Hero.tsx        # Name, TypeAnimation, Statistic row, portrait Image
    About.tsx       # Bio paragraphs, .about-box-accent headline
    TechStack.tsx   # Heading copy + ToolsMarquee
    Portfolio.tsx   # 4 project Images in hand-tuned CSS grid
    Testimonial.tsx # Heading + TestimonyCarousel
    Footer.tsx      # Copyright + SocialNav (mobile only)
    ui/             # Client islands ('use client'), all loaded via next/dynamic:
      AvailabilityStatus.tsx  # Status enum: AVAILABLE | OPEN | UNAVAILABLE
      SocialNav.tsx           # GitHub + LinkedIn icon links
      Statistic.tsx           # react-countup number
      TypeAnimation.tsx       # exports ClientTypeAnimation (rotating text)
      ToolsMarquee.tsx        # react-fast-marquee, 2 rows from TECH_STACK split in half
      TestimonyCarousel.tsx   # Swiper carousel + inline testimony data array
public/
  photo.png logo.svg quote.svg opengraph-card.png twitter-card.png
  projects/  *.webp
  people/    *.jpeg / *.jpg.webp
  techstack/ *.svg (names may contain spaces, e.g. "Next.js.svg")
```

## Render pipeline

1. `page.tsx` renders sections in order. Sections are server components; interactive bits are client islands loaded with `next/dynamic` + `'use client'` (TypeAnimation, Statistic, ToolsMarquee, TestimonyCarousel).
2. Styling is Tailwind-4-only via `globals.css` — no `tailwind.config` file. Class order enforced by Biome (`useSortedClasses`).
3. Path alias: `@/*` → `src/*`.

## Update recipes

- **Add/edit testimonial**: edit `testimony` array in `ui/TestimonyCarousel.tsx`. Requires `photo` (exact path under `public/people/`), `name`, `role`, optional `org`, JSX `testimony` (gold `<b>` for emphasis spans pattern). Upper half of the array = top marquee is unrelated; array order = carousel order.
- **Add tool to marquee**: add `{ name, image }` to `TECH_STACK` in `libs/constants.ts` (keep name-sorted) + SVG in `public/techstack/`. Marquee rows split list in half automatically.
- **Swap/add project image**: webp in `public/projects/`, add `<Image>` cell in `Portfolio.tsx` grid (grid spans are hand-tuned per breakpoint — follow existing pattern).
- **Change hero stats**: JSX in `Hero.tsx` (`value` + text).
- **Change availability**: `variant={Status.X}` in `Header.tsx`; statuses defined in `ui/AvailabilityStatus.tsx`.
- **Change typed roles / location**: sequences in `ui/TypeAnimation.tsx`; location string in `Hero.tsx`.
- **Change bio**: direct JSX in `About.tsx`.

## Asset conventions

- People photos referenced by exact filename — mixed formats (`*.jpeg`, `*.jpg.webp`), no rename guarantees. Copy filename exactly.
- Techstack SVG filenames contain dots and spaces (`React Router.svg`, `Next.js.svg`) — quote in paths.
- Projects are webp, `object-cover`, `fill` + explicit `sizes`.

<!-- verified against: 28d8aec, 2026-09-30 -->

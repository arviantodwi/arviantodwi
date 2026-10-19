# Design

Theme tokens, custom CSS, layout patterns. Source of truth: `src/app/globals.css`.

## Theme (`@theme inline` in globals.css)

| Token                 | Value                                             | Usage                          |
| --------------------- | ------------------------------------------------- | ------------------------------ |
| `--color-gold`        | `oklch(79.48% 0.1624 90.32)`                      | Accent (underlines, text, dot) |
| `--color-neutral-900` | `oklch(22.21% 0 0)`                               | Page background (`body`)       |
| `--color-emerald-600` | `oklch(80.28% 0.2227 149.71)`                     | "Available" status             |
| `--color-rose-600`    | `oklch(65.32% 0.2427 8.87)`                       | "Unavailable" status           |
| `--font-headline`     | Antonio 700 (`--font-antonio`)                    | Hero h1, AiWorkflow stage titles |
| `--font-general`      | Plus Jakarta Sans 300–700 (`--font-plus-jakarta`) | Everything else                |

- Fonts loaded in `layout.tsx` via `next/font/google`, injected as CSS vars, mapped in `@theme`.
- `:root` defines `--background`/`--foreground` (`#040404`/white); dark is the only real theme (`prefers-color-scheme` block is identical defaults). `bg-background` on the page wrapper.
- Tailwind 4: no config file; tokens above are the config.

## Custom utilities (globals.css)

| Class                    | Effect                                                               | Used in                  |
| ------------------------ | -------------------------------------------------------------------- | ------------------------ |
| `.blurred-circle-accent` | Fixed giant gold blur circle behind content (`::before`)             | `page.tsx` wrapper       |
| `.about-box-accent`      | Gold corner frame on About headline (`::before`), responsive offsets | `About.tsx`              |
| `.status-dot-ripple`     | Radiating ping on availability dot (`::before` + `ripple` keyframes) | `AvailabilityStatus.tsx` |
| `.people-carousel`       | Swiper slide dimming (inactive 0.33 opacity, scaled-down img)        | `TestimonyCarousel.tsx`  |
| `.plan-marker`           | PLAN card gold dot: 3× discrete blink (~288ms per state) at cycle start | `PlanIllustration.tsx` |
| `.plan-line-1/2/3`       | PLAN card idea bars: sequential scaleX 0→1 growth, wipe-out at cycle end | `PlanIllustration.tsx` |
| `.plan-note`             | PLAN card direction note: fade-in + rise after bars, fade-out at cycle end | `PlanIllustration.tsx` |
| `.design-dot-1/2/3`      | DESIGN card palette dots: staggered fade+scale-in (gold→cream→grey) | `DesignIllustration.tsx` |
| `.design-line`           | DESIGN card supporting line: scaleX 0→1 growth, starts with dot 2 | `DesignIllustration.tsx` |
| `.design-panel`          | DESIGN card gradient square: fade + slight rise | `DesignIllustration.tsx` |
| `.design-ring`           | DESIGN card gold ring: stroke-dashoffset self-draw, rotated -90° | `DesignIllustration.tsx` |
| `.design-core`           | DESIGN card center dot: soft pop (scale overshoot 1.05) | `DesignIllustration.tsx` |
| `.design-seq`            | DESIGN card transient set: fade-out wipe at cycle end | `DesignIllustration.tsx` |
| `.dev-caret`             | DEVELOP card: gold caret, discrete blink (~530ms) on the 03 line; otherwise static | `DevelopIllustration.tsx` |

## Recurring visual conventions

- **Gold underline headline pattern**: `<span className="underline decoration-1 decoration-gold underline-offset-[5px]">` on highlighted h1/h2 phrase (Hero, TechStack, Portfolio, Testimonial).
- **Section shell**: shared `ui/Section.tsx` — `px-6 md:mx-auto md:max-w-2xl lg:max-w-4xl xl:max-w-[1440px] xl:px-30` (1440px shell, 120px gutters, content caps at 1200px; matches the .pen Main artboard). Render with `as="div"` for inner containers. Per-section overrides go through `className` (tailwind-merge resolves tiers — e.g. Portfolio passes `md:max-w-none md:px-18 lg:max-w-none xl:pb-20` for its full-bleed grid).
- **Vertical rhythm**: sections get their spacing from the `page.tsx` Body wrapper (`gap-20 lg:gap-[120px]`, `pb-20 lg:pb-[120px]` before the footer) — per-section `mb-*` is gone. Sections keep their own design pad-y (`py-20` on TechStack/AiWorkflow, `pt-20` Testimonial) so xl totals match the artboard's 120px section gap + 80px inner padding.
- **Muted body text**: `opacity-75` on regular copy, `opacity-60` for tertiary, gold `text-gold` / `<strong>` for emphasis.
- **Numbers**: `tabular-nums` on `Statistic` count-up.
- **Buttons**: `ui/Button.tsx` — neo-brutalism: sharp corners, `border-2 border-black`, offset solid black shadow that presses in on hover (`transition-all`). `<a>` when `href` passed, `<button>` otherwise. `primary` variant = gold fill + `text-background` dark label; sizes `md` (4px shadow) / `lg` (6px shadow, larger padding + text). Icons placed as trailing children (e.g. `TbArrowUpRight size={18}`).
- **Form fields** (ContactForm.tsx): bare inputs on `bg-transparent` — ALL fields are underline-only per the .pen frame (`h-11 border-b border-white/65 px-0 pt-2 pb-3`; message `<textarea>` same idiom, `min-h-[150px] resize-y border-b border-white/15`), `focus:border-gold focus:outline-none`, `placeholder:text-white/35`, `font-general text-base text-white`. Errors: `text-sm text-rose-600` paragraph under the field, wired via `aria-invalid` + `aria-describedby` (sr-only labels via `htmlFor`).
- **Contact submit button** is a flat gold block (`bg-gold px-[18px] py-3 font-bold`, `TbSend` icon, flush right in the 70px row) — deliberately NOT the neo-brutal `ui/Button` idiom; the .pen frame shows no border/offset shadow.
- Hero portrait + project images: `next/image` with `fill` + explicit `sizes` prop. Exception: ToolsMarquee uses raw `<img>` (Biome override, see tooling.md). AiWorkflow illustrations/logos: `next/image` with explicit `width`/`height` + `loading="lazy"` — card shells are code (one-sided border colors per stage), inner composition is a flattened PNG (`public/ai-native-*.png`, exact 2× of the 373×132 design card, so `w-full` reproduces the design height at desktop widths).

## Class merging

`cx()` in `src/app/lib/utils.ts` (clsx + tailwind-merge). Use it for conditional classes, e.g. `cx('base', conditional && 'extra')`.

<!-- verified against: working tree, 2026-10-20 (contact form fields row; move SHA on next commit) -->

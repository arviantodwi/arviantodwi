# Design

Theme tokens, custom CSS, layout patterns. Source of truth: `src/app/globals.css`.

## Theme (`@theme inline` in globals.css)

| Token                 | Value                                             | Usage                          |
| --------------------- | ------------------------------------------------- | ------------------------------ |
| `--color-gold`        | `oklch(79.48% 0.1624 90.32)`                      | Accent (underlines, text, dot) |
| `--color-neutral-900` | `oklch(22.21% 0 0)`                               | Page background (`body`)       |
| `--color-emerald-600` | `oklch(80.28% 0.2227 149.71)`                     | "Available" status             |
| `--color-rose-600`    | `oklch(65.32% 0.2427 8.87)`                       | "Unavailable" status           |
| `--font-headline`     | Antonio 700 (`--font-antonio`)                    | Hero h1                        |
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

## Recurring visual conventions

- **Gold underline headline pattern**: `<span className="underline decoration-1 decoration-gold underline-offset-[5px]">` on highlighted h1/h2 phrase (Hero, TechStack, Portfolio, Testimonial).
- **Containers per breakpoint**: content sections follow `px-6 md:mx-auto md:max-w-2xl lg:max-w-4xl xl:max-w-7xl xl:px-18` (varies slightly per section — copy nearest sibling).
- **Muted body text**: `opacity-75` on regular copy, `opacity-60` for tertiary, gold `text-gold` / `<strong>` for emphasis.
- **Numbers**: `tabular-nums` on `Statistic` count-up.
- **Buttons**: `ui/Button.tsx` — neo-brutalism: sharp corners, `border-2 border-black`, offset solid black shadow that presses in on hover (`transition-all`). `<a>` when `href` passed, `<button>` otherwise. `primary` variant = gold fill + `text-background` dark label; sizes `md` (4px shadow) / `lg` (6px shadow, larger padding + text). Icons placed as trailing children (e.g. `TbArrowUpRight size={18}`).
- Hero portrait + project images: `next/image` with `fill` + explicit `sizes` prop. Exception: ToolsMarquee uses raw `<img>` (Biome override, see tooling.md).

## Class merging

`cx()` in `src/app/libs/utils.ts` (clsx + tailwind-merge). Use it for conditional classes, e.g. `cx('base', conditional && 'extra')`.

<!-- verified against: 28d8aec, 2026-09-30 -->

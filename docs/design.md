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
- **Form fields** (`ui/Input.tsx`, `ui/Textarea.tsx`): reusable underline fields per the .pen "Drawer — Input fields" (`uKTB8`) / "Drawer — Text areas" (`azLph`) state system — idle line `#292929`, focus-empty `white/65`, typed value → gold line, error `#ed5440` with a 13px message row below (`gap-2` wrapper). Native prop passthrough (`type="email|number|password|…"`, `min/max/step`, `autoComplete`, `ref`); `error?: string | null` prop wires the message + `aria-invalid`/`aria-describedby`; `scheme-dark` keeps native pickers dark. Line mapping reads `:placeholder-shown`, so pass a `placeholder` for empty fields. Labels stay caller-owned (sr-only in ContactForm). ContactForm consumes both.
- **Form validation** (ContactForm.tsx): React Hook Form v7 client rules mirror the server's `validateContact` — limits imported from `lib/contact/validate.ts` (`LIMITS`, `isValidEmail`), trim semantics identical, messages from `dict.contact.errors.*` (no new keys). `mode: 'onTouched'` (first validation on blur, then live re-validation on change), `reValidateMode: 'onChange'`; uncontrolled `register()` on all fields (interest radios registered with no client rule — server whitelist is the authority). Valid submit dispatches FormData through the existing `useActionState(sendContactMessage)` — server stays authoritative; server field errors merge via `setError(type: 'server')`, success calls `reset()` (RHF-idiomatic, no remount). Error copy carries `{min}`/`{max}` placeholders filled from `LIMITS` at render via `fillLimits` (Intl `NumberFormat` per locale → `1,000` / `1.000`); ranges never appear in error copy — only in the name placeholder hint (`placeholders.nameRange`, composed: `"(2–100 characters)"`). Message limit lives only in `LIMITS` (max 1000).
- **Contact submit button** is a flat gold block (`bg-gold px-[18px] py-3 font-bold`, send-plane icon, flush right in the 70px row) — deliberately NOT the neo-brutal `ui/Button` idiom; the .pen frame shows no border/offset shadow. **3s cancel window**: a valid submit is held 3s before dispatching — an outline `Cancel` trigger (dict `contact.cancel`, `border-foreground/70` matching its text color) sits beside the button, which is **disabled** during the window/pending (cursor `not-allowed`, no hover) while a flat 3px `#9747FF` progress bar (`@keyframes send-progress`, scaleX origin-left, no track) sweeps below it; both unmount when the window elapses and the server action dispatches (hidden inputs `startedAt`/`locale`/honeypot untouched). Under `prefers-reduced-motion` the bar is hidden (`display: none`) — Cancel + the `Sending...` label carry the state.
- **Contact sent state** (pen node `B2C6cA`): on success the whole form subtree (interest radios + divider + fields + send row) animates out (`@keyframes contact-form-exit` — 250ms fade + lift) while keeping its values, then a full-width centered `SentView` (40px gold badge + `TbCheck` in `text-background`, 36px bold heading, 16px `text-white/75` subtext, gap 5, h-372) animates in (`@keyframes contact-sent-enter` — 350ms rise); `reset()` runs when the exit ends so fields never visibly blank mid-animation. `role="status"` on the SentView announces it — the old form-level aria-live region now carries form errors only. Reduced motion: exit hides instantly, enter shows instantly.
- Hero portrait + project images: `next/image` with `fill` + explicit `sizes` prop. Exception: ToolsMarquee uses raw `<img>` (Biome override, see tooling.md). AiWorkflow illustrations/logos: `next/image` with explicit `width`/`height` + `loading="lazy"` — card shells are code (one-sided border colors per stage), inner composition is a flattened PNG (`public/ai-native-*.png`, exact 2× of the 373×132 design card, so `w-full` reproduces the design height at desktop widths).

## Class merging

`cx()` in `src/app/lib/utils.ts` (clsx + tailwind-merge). Use it for conditional classes, e.g. `cx('base', conditional && 'extra')`.

<!-- verified against: working tree, 2026-10-25 (form fields + RHF v7 validation + sent-state row; move SHA on next commit) -->

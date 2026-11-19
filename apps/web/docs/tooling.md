# Tooling

Commands, lint rules, config pointers for the web app. Workspace-level behavior
(pnpm-only rule, vp, git policy) lives in the root `AGENTS.md`.

## Commands

| Cmd                  | What                                                                                                                               |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev` (root)    | Dev server — **always port 3001** (baked into this package's `dev` script: `next dev -p 3001`). User's local dev server owns 3000. |
| `pnpm build` (root)  | `next build` via `vp -C apps/web run build`                                                                                        |
| `pnpm start` (root)  | Serve production build                                                                                                             |
| `pnpm lint` (root)   | `vp lint` — Oxlint only (no write)                                                                                                 |
| `pnpm format` (root) | `vp fmt` — Oxfmt (writes)                                                                                                          |
| `pnpm check` (root)  | `vp check` — Oxfmt + Oxlint + type-check, the one static gate                                                                      |

Equivalent direct forms from the repo root: `vp check`, `vp -C apps/web run dev`.
**pnpm only** — see the root `AGENTS.md` workspace section for the workspace rule
(`packageManager: pnpm@12.21.0`, `pnpm-workspace.yaml`, `pnpm-lock.yaml` committed).

## Vite+ toolchain (`vite.config.ts`, repo root) — sole linter+formatter

One root config governs all packages; nested lint/fmt configs are disabled in
Vite+ mode, and per-file/per-package settings live in the root `overrides`.

- Oxfmt style ported from the old Biome setup (2026-11-19): 2-space, width 100,
  LF, semicolons, single quotes, trailing commas `all`, double JSX quotes
  (Oxfmt defaults cover everything except `singleQuote: true`).
- `sortImports` on (`newlinesBetween: false`) — replaces Biome's import
  organizer; default `internalPattern` already covers the `@/*` alias.
- `sortTailwindcss` on (`stylesheet: apps/web/src/app/globals.css`,
  `functions: ['cx', 'clsx']`) — replaces Biome's nursery
  `useTailwindSortedClasses`; Tailwind class order is enforced by the formatter.
  Run `pnpm format` after class edits.
- `sortPackageJson: false` (kept unsorted, matching the old behavior).
- Ignores: `.next`, `node_modules`, `public/`, `.agents`, `.fallow`,
  `.openchamber`, `tmp`.
- Oxlint plugins: `eslint`, `typescript`, `react`, `nextjs`, `jsx-a11y`;
  categories `correctness` + `suspicious` at `error` approximate Biome's
  `recommended`. Deliberate deviations from that baseline (documented in the
  root `vite.config.ts`): `react/react-in-jsx-scope` (React 19 automatic
  runtime), `jsx-a11y/prefer-tag-over-role`, `eslint/no-underscore-dangle`,
  `eslint/no-shadow`, and the type-aware trio
  (`typescript/no-unsafe-type-assertion`, `typescript/consistent-return`,
  `typescript/no-misused-spread`) — all off for Biome parity.
- React Compiler analysis rules (`react/refs`, `react/purity`,
  `react/set-state-in-effect`) are also off for parity. Findings existed when
  first enabled (render-time ref reads in `ui/LangSwitcher` / `ui/Select` /
  `ui/Popover` / `ContactForm`, `Date.now` during render in `ContactForm`,
  synchronous setState in effects in `ContactForm` / `ui/Popover`) — enabling
  them is a deliberate follow-up, not part of the toolchain swap.
- ToolsMarquee raw `<img>`: the old Biome `performance/noImgElement` override is
  now `nextjs/no-img-element` off for `ui/ToolsMarquee.tsx` via `lint.overrides`.
- `lint.options: { typeAware: true, typeCheck: true }` — `vp check` type-checks
  via tsrs against this package's tsconfig.
- Biome and its config are gone; no eslint/prettier remnants either.

## TypeScript (`apps/web/tsconfig.json`, TypeScript 7)

- Strict, bundler resolution, ES2017 target, alias `@/*` → `./src/*`.
- Includes `.next/types` + `.next/dev/types` (generated) — `vp check` reports
  `PageProps`/`LayoutProps` errors until the first `next build`/`dev` generates
  them.
- TS 7: stricter types (compile-time only); asset side-effect imports still need
  declarations — Swiper ships its own for `swiper/css`, no local shim required.

## Swiper

`TestimonyCarousel.tsx` uses `swiper/react` with custom caret navigation (no
Navigation module); slide dimming via `.swiper-slide`/`.swiper-slide-active`
selectors in `globals.css`. Core API is stable across majors (11 → 14 drop-in).

## Next.js 16

- `next.config.ts` is minimal; `output: 'export'` commented out (not
  static-exported currently).
- **Breaking vs. older Next:** read the relevant guide under
  `node_modules/next/dist/docs/` (resolved from this package) before writing
  Next-specific code. The agent file (`apps/web/AGENTS.md` Next block)
  regenerates on `next dev` — never delete it from diffs; commit it to keep the
  tree clean.
- React 19. App Router, server components default, `next/dynamic` for client
  islands.

<!-- verified against: working tree, 2026-11-19 (monorepo migration: site moved to apps/web, npm → pnpm via Vite+, Biome 2.6 → Oxfmt/Oxlint 1.7.0 with documented parity deviations, .npmrc/package-lock.json removed) -->

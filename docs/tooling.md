# Tooling

Commands, lint rules, config pointers.

## Commands

| Cmd              | What                                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| `npm run dev`    | Dev server — **always use port 3001** (`npm run dev -- -p 3001`). User's local dev server owns 3000. |
| `npm run build`  | Production build                                                                                     |
| `npm run start`  | Serve production build                                                                               |
| `npm run lint`   | Biome check (no write)                                                                               |
| `npm run format` | Biome check --write                                                                                  |

No test runner, no CI config.

## npm configuration

Root `.npmrc` sets `legacy-peer-deps=false` so npm resolves peer dependencies for this project, overriding any user-level setting. This keeps dependency classification consistent across machines, including `devOptional` for packages shared by development dependencies and optional production peers.

## Git workflow rules

- **Never commit unless the user explicitly instructs it.** No auto-commit after each change, no batch commits at task end, no "I'll commit for you" — leave changes uncommitted in the working tree and wait for the user's instruction.
- This checkout uses repository-local `user.name=Arvianto D. Wicaksono` and `user.email=dev@arvian.to`, matching `opencode-discord-bridge`. These overrides live in `.git/config` and must be configured separately in new clones; commit signing inherits the user's global configuration.

## Biome (`biome.json`, Biome 2.6) — sole linter+formatter

- Style: 2-space, width 100, LF, single quotes, semicolons, trailing commas all, JSX double quotes.
- Nursery rule `useTailwindSortedClasses: on` (renamed from `useSortedClasses` in Biome 2.6) — Tailwind class order is enforced; run `npm run format` after class edits.
- Import organizer on; VCS-aware (respects .gitignore).
- Excludes `.next`, `node_modules`, `public/`, `.agents/skills`.
- Also formats Markdown (Biome 2.6+) — sole Markdown formatter; Prettier removed. One-time reformat realigned table columns in docs/.
- One override: `ui/ToolsMarquee.tsx` disables `performance/noImgElement` (raw `<img>` needed by marquee).
- ESLint was replaced by Biome (git history) — no eslint config exists.

## TypeScript (`tsconfig.json`, TypeScript 7)

- Strict, bundler resolution, ES2017 target.
- Alias: `@/*` → `./src/*`.
- Includes `.next/types` + `.next/dev/types` (generated).
- TS 7: stricter types (compile-time only); asset side-effect imports still need declarations — Swiper ships its own for `swiper/css`, no local shim required.

## Swiper

`TestimonyCarousel.tsx` uses `swiper/react` with custom caret navigation (no Navigation module); slide dimming via `.swiper-slide`/`.swiper-slide-active` selectors in `globals.css`. Core API is stable across majors (11 → 14 drop-in).

## Next.js 16 Swiper ships its own TS declarations for CSS side-effect imports — no local shim needed.

- `next.config.ts` is minimal; `output: 'export'` commented out (not static-exported currently).
- **Breaking vs. older Next:** read the relevant guide under `node_modules/next/dist/docs/` before writing Next-specific code. The agent file (`AGENTS.md` Next block) regenerates on `next dev` — never delete it from diffs.
- React 19. App Router, server components default, `next/dynamic` for client islands.

<!-- verified against: fad1627537e746d4446b90e1c5ae40a5b3dcc82a + working tree, 2026-10-26 (project .npmrc overrides legacy-peer-deps; repository-local Git identity configured) -->

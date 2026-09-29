# Tooling

Commands, lint rules, config pointers.

## Commands

| Cmd                 | What                                                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| `npm run dev`       | Dev server — **always use port 3001** (`npm run dev -- -p 3001`). User's local dev server owns 3000. |
| `npm run build`     | Production build                                                                                     |
| `npm run start`     | Serve production build                                                                               |
| `npm run lint`      | Biome check (no write)                                                                               |
| `npm run format`    | Biome check --write                                                                                  |
| `npm run format:md` | Prettier for `**/*.md` only                                                                          |

No test runner, no CI config.

## Biome (`biome.json`, Biome 2.5) — sole linter+formatter

- Style: 2-space, width 100, LF, single quotes, semicolons, trailing commas all, JSX double quotes.
- Nursery rule `useSortedClasses: on` — Tailwind class order is enforced; run `npm run format` after class edits.
- Import organizer on; VCS-aware (respects .gitignore).
- Excludes `.next`, `node_modules`, `public/`.
- One override: `ui/ToolsMarquee.tsx` disables `performance/noImgElement` (raw `<img>` needed by marquee).
- ESLint was replaced by Biome (git history) — no eslint config exists.

## TypeScript (`tsconfig.json`)

- Strict, bundler resolution, ES2017 target.
- Alias: `@/*` → `./src/*`.
- Includes `.next/types` + `.next/dev/types` (generated).

## Next.js 16

- `next.config.ts` is minimal; `output: 'export'` commented out (not static-exported currently).
- **Breaking vs. older Next:** read the relevant guide under `node_modules/next/dist/docs/` before writing Next-specific code. The agent file (`AGENTS.md` Next block) regenerates on `next dev` — never delete it from diffs.
- React 19. App Router, server components default, `next/dynamic` for client islands.

## Prettier

Only for Markdown (`format:md` script). Code formatting is Biome's.

<!-- verified against: 28d8aec, 2026-09-30 -->

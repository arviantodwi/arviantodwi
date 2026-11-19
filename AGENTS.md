## Agents language

Always give response in English. Sometimes I see a Chinese/Mandarin response, and I don't understand it. Keep it clear by using only English on every response.

## Project docs (scope-owned)

Docs belong to their own scope: `apps/web/docs/` documents the web app, `apps/<app>/docs/` documents that app, `packages/<pkg>/docs/` documents that package. Before working in a scope, read that scope's `docs/index.md`; when your changes touch anything documented there, update that scope's docs in the same task and move its `verified against` comment to the new commit SHA and date. Never edit another scope's docs from here.

This root file is the router and holds only repo-wide behavior:

| Scope             | Docs                                 |
| ----------------- | ------------------------------------ |
| Web app           | `apps/web/docs/index.md`             |
| Activity worker   | `apps/activity-worker/docs/index.md` |
| Activity plugin   | `apps/activity-plugin/docs/index.md` |
| (future apps)     | `apps/<app>/docs/index.md`           |
| (future packages) | `packages/<pkg>/docs/index.md`       |

## Workspace tooling (Vite+ / pnpm)

- pnpm-workspaces monorepo managed by Vite+ (project-local `vite-plus`, `vp` CLI; global install also present). `packageManager: pnpm@12.21.0` — `vp install` / `vp add` / `vp remove` drive pnpm underneath.
- One root `vite.config.ts` governs format (Oxfmt), lint (Oxlint), and type-check for every package. Vite+ disables nested lint/fmt configs — package-specific settings go in the root config's `overrides`.
- **pnpm only.** npm is gone from this repo; running npm installs here would recreate `package-lock.json` and an npm `node_modules` layout on top of the workspace. Manage deps with `vp install` / `vp add` / `vp remove` (or plain `pnpm`).
- Repo-root scripts (`pnpm dev` / `build` / `start` / `lint` / `format` / `check`) are thin aliases over vp; equivalent direct forms: `vp check`, `vp -C apps/web run dev`, `vp fmt`, `vp lint`.
- **After every change to files the toolchain supports** (currently TS/TSX, CSS, JSON/JSONC, Markdown in this repo), agents run `vp check --fix` from the repo root before ending the task, and fix anything it still reports. Clean format + lint is part of every change, not a commit-time step.

## Pencil MCP (design → code)

When doing design → code work with the pencil MCP, do not test the implementation results in pencil's built-in browser.

## Browser verification

Verify in a browser only when explicitly asked. When asked, use the Chrome DevTools MCP for browser verification.

When there is a need to run the dev server, always use port 3001 instead of 3000 so local dev server won't be killed.

## Git policy

Never commit after every change. Commit only when the user explicitly instructed.

- This checkout uses repository-local `user.name=Arvianto D. Wicaksono` and `user.email=dev@arvian.to` (in `.git/config`; configure separately in new clones — commit signing inherits the user's global configuration).

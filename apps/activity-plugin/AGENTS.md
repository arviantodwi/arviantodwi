# Activity Plugin — agent rules

## Scope

`apps/activity-plugin` is the OpenCode server plugin that captures per-turn agent activity and pushes it to the activity worker. It runs **inside the OpenCode server** (loaded globally via `plugins` in `~/.config/opencode/opencode.json`, pointing at this directory). Repo-wide rules live in the root `AGENTS.md`.

## Tooling

- **pnpm only** — deps via `vp add` from this directory (`@opencode/plugin` is the one runtime dependency).
- Run `vp check --fix` from the repo root after every change.
- Turn-slicing tests are dependency-free and run under Node type-stripping: `pnpm exec node test/turn.test.ts` from this directory (or plain `node test/turn.test.ts`). Keep `src/turn.ts` free of imports so this stays possible.

## Behavior rules (do not break silently)

- One POST per closed turn — the plugin **never accumulates across turns**. Trigger set: `session.idle` (primary) + `session.execution.failed` / `session.execution.interrupted`.
- Subagent sessions (`parentID`) and empty slices are skipped.
- The plugin must **never throw into the session loop**: every failure is caught and logged; a failed POST leaves the durable cursor untouched, so the next event retries naturally.
- Idempotency: turn key = opening message id; cursor persisted in plugin storage (`turn/<sessionID>`), surviving service restarts.
- Config: `AGENT_ACTIVITY_URL` / `AGENT_ACTIVITY_TOKEN` from the environment or `{ url, token }` plugin options. Missing → dormant with a one-time warning, no crashes, no data sent.
- No secrets in this scope — the token lives outside the repo (owner-managed).

## Config & secrets (owner)

- Recommended: the global config passes credentials via `{file:}` substitution — plugin options `{ url: "https://api.arvian.to/activity/turns", token: "{file:~/.agent-activity.token}" }` in `~/.config/opencode/opencode.json`; the owner keeps the raw token in `~/.agent-activity.token` (600 perms, outside any repo). OpenCode substitutes the file contents at config load; nothing secret lives in config.
- Alternatives that also work: env vars `AGENT_ACTIVITY_URL` / `AGENT_ACTIVITY_TOKEN` in the OpenCode service process env (spawn-time only — a service restarted without them stays dormant), plugin options `{ token: "{env:VAR}" }`, or a literal `token` (plaintext in config — avoid).
- Config changes hot-reload; note `{file:}` contents are re-read at config (re)load — after rotating the token, touch the global config or restart the service.
- Missing/unset → dormant with a one-time warning: no crashes, no data sent.
- No secrets in this scope — the token lives outside the repo (owner-managed).

## Live verification (owner, after filling env)

1. Set `AGENT_ACTIVITY_URL` (e.g. `http://localhost:8787/activity/turns` for local dev, or the deployed URL) and `AGENT_ACTIVITY_TOKEN` in the environment that owns the OpenCode service, or as plugin options in the global config.
2. Restart the service if env vars changed (`opencode service restart` — the service process only reads env at launch).
3. Run any agent turn, then check `GET /activity/health`-backed worker logs / `GET /activity/days` for the new turn.

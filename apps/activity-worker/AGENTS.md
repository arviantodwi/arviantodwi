# Activity Worker — agent rules

## Scope

This is `apps/activity-worker`: the agent-activity backend (Cloudflare Worker + D1). Rules here apply only to this scope; repo-wide rules live in the root `AGENTS.md`, web-app rules in `apps/web/AGENTS.md`.

## Tooling

- **pnpm only** — `vp add` / `vp remove` / `vp install` from this directory. npm would break the workspace layout.
- After every change to files the toolchain supports (TS, JSON/JSONC, Markdown), run `vp check --fix` from the **repo root** and fix anything it reports. Clean format + lint is part of every change, not a commit-time step.
- Local dev: `pnpm dev` (wrangler dev, http://localhost:8787). Migrations: `pnpm db:migrate:local` (local) / `pnpm db:migrate` (remote). Read local data: `pnpm exec wrangler d1 execute agent-activity --local --command "…"`.

## Secrets & env (hard rule)

- **No secret or env file is ever created/committed in this scope.** Only `.env.example` with placeholders ships in git; the owner fills real values manually.
- Real values: production → `wrangler secret put AGENT_ACTIVITY_TOKEN` / `wrangler secret put JEV_API_KEY`; local → gitignored `.dev.vars`, created manually by the owner.
- Never log, echo, or copy secret values.

## Data contracts (do not break silently)

- Timestamps in D1 are **ISO 8601 UTC (`…Z`)** — source of truth. `day` is a derived projection in `ACTIVITY_TZ`, recomputable from UTC at any time.
- Ingest is **idempotent** by `(source, session_id, turn_id)`: same key = overwrite with latest values. Batch ≤ 50 turns, ≤ 64 KB per turn.
- The public read API returns **numbers only** — never titles, projects, or prose. `title` stays internal (Jev digest + re-classification).
- Category enum: `planning | design | coding | test_review | other`; `category_source`: `manual | jev | heuristic`. Jev accepted at ≥ 0.7 self-reported confidence, else the tool-mix heuristic stands; no `JEV_API_KEY` → heuristic-only mode. Provider is a LiteLLM gateway (see `JEV_BASE_URL`): Jev is a **decision model** served on `POST /v1/decisions` (chat/completions is unmapped for TypeSafe models — HTTP 400) — `jev-1.14.0` primary with automatic fallback to `jev-1.13.0`. Verified live: `category_source=jev` with a full probability distribution.

## Verification

- Curl-test every endpoint against `wrangler dev` before committing (auth fail, validation fail, happy path, idempotent re-post).
- MCP endpoint: verify initialize / tools/list / tools/call / notification 202 / unknown method −32601.

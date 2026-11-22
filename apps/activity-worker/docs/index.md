# Index

Agent-activity backend (Cloudflare Worker `activity-worker` + D1 `agent-activity`, served at `api.arvian.to/activity/*`). Hono router, three routes: ingest (`POST /activity/turns`, Bearer), public read (`GET /activity/days`), read-only MCP (`POST /activity/mcp`, Bearer). Jev (TypeSafe decision model via the owner's LiteLLM gateway — `jev-1.14.0` primary, `jev-1.13.0` fallback, native `POST /v1/decisions` route) categorizes each turn at ingest; tool-mix heuristic is the fallback. Consumed by the OpenCode plugin (`packages/activity-plugin`) and — later, when built — the site grid page.

**Read this file first. Read only the doc your task needs.**

## Router

| Task                         | Doc                                      |
| ---------------------------- | ---------------------------------------- |
| Endpoints, auth, env, schema | this file                                |
| Capture side (plugin)        | `packages/activity-plugin/docs/index.md` |
| Repo-wide behavior           | root `AGENTS.md`                         |

## Routes

| Route                  | Auth                          | Behavior                                                                                                                                                                                                              |
| ---------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /activity/turns` | `Bearer AGENT_ACTIVITY_TOKEN` | Single turn object, top-level array, or `{ turns: [...] }` (≤ 50; ≤ 64 KB/turn). Upsert by `(source, session_id, turn_id)` — idempotent, latest values win. Rejects malformed batches whole (400, per-index details). |
| `GET /activity/days`   | public                        | `{ days, turns, generatedAt }`; `?range=` absent \| `last12` \| `YYYY`. Numbers only. CORS via `ALLOWED_ORIGINS`; `Cache-Control: public, max-age=300`.                                                               |
| `POST /activity/mcp`   | `Bearer AGENT_ACTIVITY_TOKEN` | Stateless streamable-HTTP MCP (JSON responses, no SSE). Tools: `get_activity_stats` (`range`: `"last12"` \| `"YYYY"`, default full history). `submit_agent_activity` deferred.                                        |
| `GET /activity/health` | public                        | `{ ok: true }` readiness probe.                                                                                                                                                                                       |

## Source layout

| Concern                                                            | File                       |
| ------------------------------------------------------------------ | -------------------------- |
| Bindings + TZ resolution                                           | `src/env.ts`               |
| UTC normalization + day projection                                 | `src/time.ts`              |
| Category enum, tool families, heuristic                            | `src/heuristic.ts`         |
| Turn validation (limits, timestamp normalization)                  | `src/validate.ts`          |
| Jev classification (LiteLLM gateway, native `/v1/decisions` route) | `src/jev.ts`               |
| Categorization pipeline + D1 upsert                                | `src/ingest.ts`            |
| Daily aggregation (pivot by day×category)                          | `src/days.ts`              |
| MCP JSON-RPC handler                                               | `src/mcp.ts`               |
| Route wiring                                                       | `src/index.ts`             |
| D1 schema                                                          | `migrations/0001_init.sql` |

## Data model (D1 `agent_turns`)

One row per agent **turn**. Key: `(source, session_id, turn_id)` unique. Timestamps (`started_at`, `ended_at`, `created_at`, `updated_at`) are ISO 8601 UTC `…Z` — source of truth; `day` = `'YYYY-MM-DD'` projection of `ended_at` in `ACTIVITY_TZ` (default `Asia/Jakarta`). Metrics: `prompts` (user messages, 1+ with steering), `tool_calls`, token breakdown (`tokens_input/output/reasoning/cache_read/cache_write/total`), `cost_usd` (internal), `model`, `agent`, `title` (internal only). Categorization: `category`, `category_source` (`jev` ≥ 0.7 confidence, else `heuristic`; `manual` accepted for forward compat), `category_probs` (full distribution JSON), `category_mix` (tool counts per family JSON — the re-classification evidence).

## Env

| Var                    | Scope                                                                                   | Secret | Handling                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------- |
| `AGENT_ACTIVITY_TOKEN` | ingest + MCP auth                                                                       | yes    | `.env.example` placeholder; prod `wrangler secret put`; local `.dev.vars` (owner-filled) |
| `JEV_API_KEY`          | Jev classification                                                                      | yes    | same; absent → heuristic-only mode                                                       |
| `JEV_BASE_URL`         | Jev provider base (LiteLLM gateway; Jev lives on `/v1/decisions`, NOT chat/completions) | no     | wrangler var, default `https://ai.sumopod.com`                                           |
| `ACTIVITY_TZ`          | day projection                                                                          | no     | wrangler var, default `Asia/Jakarta`                                                     |
| `ALLOWED_ORIGINS`      | CORS on `/days`                                                                         | no     | wrangler var, default `https://arvian.to`                                                |

## Deploy checklist (owner)

1. `pnpm db:create` → replace the placeholder `database_id` in `wrangler.jsonc`.
2. `wrangler secret put AGENT_ACTIVITY_TOKEN` and `wrangler secret put JEV_API_KEY`.
3. Uncomment the `routes` block in `wrangler.jsonc` (`api.arvian.to/activity/*`, zone already in Cloudflare), then `pnpm deploy`.
4. `pnpm db:migrate` (remote), then verify `GET https://api.arvian.to/activity/health`.

## Releases

The worker ships as one half of the agent-activity pair: **one version, one tag** — `activity-vX.Y.Z`, applied by CI (`release-tag.yml`) when the release PR `release/next` → `main` merges with a **merge commit** (never squash). `pnpm deploy` runs from `main` at that tag — deploy = release, never from an untagged commit; hotfixes are patch releases. Flow, bump rules, and exclusions: root `AGENTS.md` → "Versioning & releases".

<!-- verified against: d9448ab (release flow), 2026-11-23 (worker v1: turns/days/mcp routes, Jev via LiteLLM gateway jev-1.14.0→jev-1.13.0, UTC time policy, secrets policy) -->

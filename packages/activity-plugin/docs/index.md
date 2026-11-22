# Index

OpenCode server plugin (`agent-activity`) that captures per-turn agent activity and pushes it to the activity worker (`apps/activity-worker`). Loaded globally via `plugins` in `~/.config/opencode/opencode.json` → git semver spec `github:arviantodwi/arviantodwi#semver:^1.0.0::path:packages/activity-plugin`. One POST per closed turn; idempotent by turn key + durable cursor; dormant until configured.

**Read this file first.**

## Where things live

| Concern                                                               | Location                                                                                                                           |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Plugin entrypoint (event loop, POST, cursor)                          | `src/index.ts`                                                                                                                     |
| Pure turn slicing + metrics (no imports — Node-type-strippable tests) | `src/turn.ts`                                                                                                                      |
| Tests (run: `node test/turn.test.ts`)                                 | `test/turn.test.ts`                                                                                                                |
| Global registration                                                   | `~/.config/opencode/opencode.json` → `plugins` array (outside the repo)                                                            |
| Secret config (URL/token)                                             | Global config plugin options with `{file:~/.agent-activity.token}` substitution — token file owner-managed (600), outside any repo |

## Mechanics (verified against the V2 API spec, 2026-11-20)

- Subscription: `ctx.event.subscribe({ types: ["session.execution.succeeded", "session.execution.failed", "session.execution.interrupted"] })` — **verified empirically 2026-11-22 (v2.3.2): `session.idle` never fires in the runtime stream even though the API spec lists it; execution-terminal events mark turn completion.** Payloads carry `data.sessionID` and `location.directory`; instances scope themselves to their own location.
- Turn slicing: cursor-first tail slice per execution-terminal event (a `session.execution.succeeded` tail = the complete turn, final metrics verified in production). Idle-marker fallbacks retained for transcript shapes that carry them.
- Metrics per turn: prompts (user messages), tool-call parts (names → `toolCounts`), token totals (input/output/reasoning/cache read/write) from assistant messages, cost, model, agent, session title, first-prompt excerpt (Jev digest material). Numbers only beyond that.
- Subagent sessions (`parentID`) are skipped. Sessions with no metrics produce nothing.

## Payload shape (to `POST /activity/turns`)

`{ source: "opencode", sessionId, turnId, startedAt, endedAt, durationMs, prompts, toolCalls, toolCounts, tokens: { input, output, reasoning, cacheRead, cacheWrite, total }, costUsd, model, agent, title, firstPrompt }` — timestamps ISO 8601 UTC.

## Releases

The plugin ships as one half of the agent-activity pair: **one version, one tag** — `activity-vX.Y.Z`, applied by CI (`release-tag.yml`) when the release PR `release/next` → `main` merges with a **merge commit** (never squash). The tag prefix changed from `activity-plugin-v*` to `activity-v*` at 1.1.0; client pickup of the new prefix via the global spec `github:arviantodwi/arviantodwi#semver:^1.0.0::path:packages/activity-plugin` is **pending verification** — if instances stay on 1.0.2 after the first release, adjust the global spec per OpenCode's tag-resolution behavior. Flow, bump rules, and exclusions: root `AGENTS.md` → "Versioning & releases".

<!-- verified against: 6b99b23 (release flow), 2026-11-23 (plugin live in production: execution-terminal triggers, location scoping, {file:} token config, diagnostic trail; first real captures verified via /activity/days) -->

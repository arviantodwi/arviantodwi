# Index

OpenCode server plugin (`agent-activity`) that captures per-turn agent activity and pushes it to the activity worker (`apps/activity-worker`). Loaded globally via `plugins` in `~/.config/opencode/opencode.json` → this directory. One POST per closed turn; idempotent by turn key + durable cursor; dormant until configured.

**Read this file first.**

## Where things live

| Concern                                                               | Location                                                                                                            |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Plugin entrypoint (event loop, POST, cursor)                          | `src/index.ts`                                                                                                      |
| Pure turn slicing + metrics (no imports — Node-type-strippable tests) | `src/turn.ts`                                                                                                       |
| Tests (run: `node test/turn.test.ts`)                                 | `test/turn.test.ts`                                                                                                 |
| Global registration                                                   | `~/.config/opencode/opencode.json` → `plugins` array (outside the repo)                                             |
| Secret config (URL/token)                                             | Service process env, or plugin options referencing env vars via `{env:VAR}` — never plaintext in `opencode.json(c)` |

## Mechanics (verified against the V2 API spec, 2026-11-20)

- Subscription: `ctx.event.subscribe({ types: ["session.idle", "session.execution.failed", "session.execution.interrupted"] })`; payloads carry `data.sessionID`.
- Idle markers are persisted transcript messages (`Session.Message.Idle`, includes `outcome`); an idle event slices **between the previous idle marker and the newest one**. If the newest marker is not persisted yet (racy), a tail slice from the cursor is sent instead — same turn key, so the worker's upsert stays idempotent.
- Metrics per turn: prompts (user messages), tool-call parts (names → `toolCounts`), token totals (input/output/reasoning/cache read/write) from assistant messages, cost, model, agent, session title, first-prompt excerpt (Jev digest material). Numbers only beyond that.
- Subagent sessions (`parentID`) are skipped. Sessions with no metrics produce nothing.

## Payload shape (to `POST /activity/turns`)

`{ source: "opencode", sessionId, turnId, startedAt, endedAt, durationMs, prompts, toolCalls, toolCounts, tokens: { input, output, reasoning, cacheRead, cacheWrite, total }, costUsd, model, agent, title, firstPrompt }` — timestamps ISO 8601 UTC.

<!-- verified against: 7ef52da + working tree, 2026-11-20 (plugin v1: idle+execution triggers, bounded idle slices, durable cursor, dormant config path) -->

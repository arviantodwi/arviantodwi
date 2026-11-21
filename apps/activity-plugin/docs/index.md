# Index

OpenCode server plugin (`agent-activity`) that captures per-turn agent activity and pushes it to the activity worker (`apps/activity-worker`). Loaded globally via `plugins` in `~/.config/opencode/opencode.json` → this directory. One POST per closed turn; idempotent by turn key + durable cursor; dormant until configured.

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

<!-- verified against: 7e19ffb + working tree, 2026-11-22 (plugin live in production: execution-terminal triggers, location scoping, {file:} token config, diagnostic trail; first real captures verified via /activity/days) -->

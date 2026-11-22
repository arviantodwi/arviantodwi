# Changelog

One version for the agent-activity pair — `packages/activity-plugin` (client) and
`apps/activity-worker` (server) — released together under `activity-vX.Y.Z`.
`apps/web` is unversioned.

## 1.1.0 — 2026-11-22

### Plugin
- feat: global opencode plugin capturing per-turn activity with durable cursor
- feat: resolve {env:VAR} references in url/token plugin options
- docs: recommend {file:} token substitution over service env
- fix: trim whitespace from url/token config values
- feat: log armed state with target url at setup
- feat: local diagnostic trail at ~/.agent-activity.plugin.log (ids and outcomes only)
- chore: temporary full-event diagnostics for capture debugging
- fix: trigger on execution-terminal events (session.idle never fires), scope to own location
- docs: execution-terminal trigger set verified in production
- feat: trail logs the ingest verdict (category + source) per turn
- fix: capture turns for cursorless sessions — succeeded events must use the bounded idle-marker slice
- docs: release flow notes — activity-v* tag, pending client-resolution verification

### Worker
- feat: scaffold activity-worker with hono, wrangler config, and D1 schema
- feat: ingest endpoint /activity/turns with validation, UTC normalization, and heuristic category
- feat: Jev per-turn classification at >= 0.7 confidence with heuristic fallback
- feat: public read API /activity/days with daily aggregates and CORS cache headers
- feat: read-only MCP endpoint /activity/mcp with get_activity_stats tool
- feat: classify turns via custom OpenAI-compatible provider with jev-1.14.0 primary and jev-1.13.0 fallback
- feat: diagnose Jev fallback reasons via console.warn (visible in wrangler tail)
- fix: classify via /v1/decisions (LiteLLM gateway shape) with full probability distribution
- docs: Jev served on the LiteLLM /v1/decisions route, probabilities restored
- docs: release flow notes — deploy from the activity-v* tag

### Repo
- fix: gh fallback jq path, per-command bot identity, detailed no-level diagnostics
- fix: gh fallback via REST for full commit subjects
- fix: jq iterate-with-dot in REST fallback
- docs: scope-owned docs for activity-worker and activity-plugin, root router rows
- chore: move activity-plugin from apps/ to packages/ and bump to 1.0.1
- feat: release-agent core — window parsing, changelog generation, lockstep bump
- chore: ignore .wrangler build residue in fmt and lint
- feat: release bot maintains release/next and the self-updating release PR
- feat: tag activity-vX.Y.Z when a release merges to main
- docs: versioning and release flow in root AGENTS.md
- fix: untracked-tolerant clean-tree guard; changelog date in local time


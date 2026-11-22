import { Hono } from 'hono';
import { aggregate, parseRange } from './days';
import { activityTz, type Env } from './env';
import { categorizeTurn, requireBearer, upsertTurns } from './ingest';
import { handleMcpPost } from './mcp';
import { parseTurnsBody, validateTurn, type ValidTurn } from './validate';

const app = new Hono<{ Bindings: Env }>();

function corsHeaders(env: Env, origin: string | undefined): Record<string, string> {
  const allowed = (env.ALLOWED_ORIGINS || 'https://arvian.to').split(',').map((s) => s.trim());
  const headers: Record<string, string> = {
    Vary: 'Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
  if (origin && allowed.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

// Readiness probe for local dev and deploy verification.
app.get('/activity/health', (c) => c.json({ ok: true }));

// Public read: daily aggregates + per-turn numeric records. Numbers only.
// CORS-restricted to ALLOWED_ORIGINS; short cache so the grid refreshes cheaply.
const daysHandler = async (c: import('hono').Context<{ Bindings: Env }>) => {
  const range = parseRange(c.req.query('range'));
  if (!range) return c.json({ error: 'range must be absent, "last12", or a 4-digit year' }, 400);
  const { days, turns } = await aggregate(c.env.DB, activityTz(c.env), range);
  const cors = corsHeaders(c.env, c.req.header('Origin'));
  c.header('Cache-Control', 'public, max-age=300');
  for (const [k, v] of Object.entries(cors)) c.header(k, v);
  return c.json({ days, turns, generatedAt: new Date().toISOString() });
};
app.get('/activity/days', (c) => daysHandler(c));
app.options('/activity/days', (c) => {
  const cors = corsHeaders(c.env, c.req.header('Origin'));
  for (const [k, v] of Object.entries(cors)) c.header(k, v);
  return c.body(null, 204);
});

// MCP: stateless streamable HTTP, read-only v1 (get_activity_stats).
app.post('/activity/mcp', requireBearer, (c) => handleMcpPost(c));
app.get('/activity/mcp', (c) =>
  c.json({ error: 'SSE streaming not offered; POST JSON-RPC here' }, 405),
);
app.delete('/activity/mcp', (c) =>
  c.json({ error: 'Stateless server; no session to delete' }, 405),
);

// Ingest: single turn object, top-level array, or { turns: [...] }. Idempotent
// upsert by (source, session_id, turn_id); malformed batches are rejected whole.
app.post('/activity/turns', requireBearer, async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }
  const parsed = parseTurnsBody(body);
  if (!parsed.ok) return c.json({ error: parsed.error }, 400);

  const failures: { index: number; error: string }[] = [];
  const valid: ValidTurn[] = [];
  parsed.turns.forEach((raw, index) => {
    const result = validateTurn(raw);
    if (result.ok) valid.push(result.turn);
    else failures.push({ index, error: result.error });
  });
  if (failures.length > 0) return c.json({ error: 'Malformed turn(s)', details: failures }, 400);

  const categorized = await Promise.all(valid.map((turn) => categorizeTurn(turn, c.env)));
  await upsertTurns(c.env.DB, categorized, activityTz(c.env));

  return c.json({
    ok: true,
    count: categorized.length,
    turns: categorized.map((entry) => ({
      sessionId: entry.turn.sessionId,
      turnId: entry.turn.turnId,
      category: entry.category,
      categorySource: entry.categorySource,
    })),
  });
});

app.notFound((c) => c.json({ error: 'Not found' }, 404));

app.onError((err, c) => {
  console.error('unhandled error:', err);
  return c.json({ error: 'Internal error' }, 500);
});

export default app;

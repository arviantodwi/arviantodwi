import { Hono } from 'hono';
import { activityTz, type Env } from './env';
import { categorizeTurn, requireBearer, upsertTurns } from './ingest';
import { parseTurnsBody, validateTurn, type ValidTurn } from './validate';

const app = new Hono<{ Bindings: Env }>();

// Readiness probe for local dev and deploy verification.
app.get('/activity/health', (c) => c.json({ ok: true }));

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

  const categorized = valid.map((turn) => categorizeTurn(turn));
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

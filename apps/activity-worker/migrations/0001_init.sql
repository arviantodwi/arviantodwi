-- Agent activity: one row per agent turn.
-- Timestamps are ISO 8601 UTC (…Z) — source of truth (decision 15).
-- `day` is a derived projection: 'YYYY-MM-DD' in ACTIVITY_TZ, computed at ingest.
CREATE TABLE agent_turns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL,
  session_id TEXT NOT NULL,
  turn_id TEXT NOT NULL,
  day TEXT NOT NULL,
  started_at TEXT,
  ended_at TEXT,
  duration_ms INTEGER,
  prompts INTEGER,
  tool_calls INTEGER,
  tokens_input INTEGER,
  tokens_output INTEGER,
  tokens_reasoning INTEGER,
  tokens_cache_read INTEGER,
  tokens_cache_write INTEGER,
  tokens_total INTEGER,
  cost_usd REAL,
  model TEXT,
  agent TEXT,
  title TEXT,
  category TEXT NOT NULL,
  category_source TEXT,
  category_probs TEXT,
  category_mix TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (source, session_id, turn_id)
);

CREATE INDEX idx_agent_turns_day ON agent_turns (day);

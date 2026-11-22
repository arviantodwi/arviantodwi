import { findSlice, toTurnMessage, type TurnMessage } from '../src/turn.ts';

let failures = 0;
const run = (name: string, check: () => string | null) => {
  const problem = check();
  if (problem) {
    failures += 1;
    console.log(`FAIL ${name}: ${problem}`);
  } else console.log(`pass ${name}`);
};

const msg = (
  id: string,
  type: string,
  created: number,
  extra: Partial<TurnMessage> = {},
): TurnMessage => ({
  id,
  type,
  created,
  ...extra,
});

const assistant = (
  id: string,
  created: number,
  opts: {
    tools?: string[];
    tokens?: [number, number, number, number, number];
    cost?: number;
    model?: [string, string];
    agent?: string;
  } = {},
) =>
  msg(id, 'assistant', created, {
    content: (opts.tools ?? []).map((name) => ({ type: 'tool', name })),
    tokens: opts.tokens
      ? {
          input: opts.tokens[0],
          output: opts.tokens[1],
          reasoning: opts.tokens[2],
          cache: { read: opts.tokens[3], write: opts.tokens[4] },
        }
      : undefined,
    cost: opts.cost,
    model: opts.model ? { providerID: opts.model[0], id: opts.model[1] } : undefined,
    agent: opts.agent,
  });

// Realistic epoch-ms timestamps (OpenCode message times are epoch ms).
// Turn 1: u1 → a1 → idle1 ; Turn 2: u2 → a2 → idle2
const T1 = 1_764_600_000_000; // some epoch ms
const transcript: TurnMessage[] = [
  msg('u1', 'user', T1, { text: 'investigate the failing login test' }),
  assistant('a1', T1 + 1000, {
    tools: ['read', 'grep', 'edit'],
    tokens: [100, 50, 10, 300, 20],
    cost: 0.01,
    model: ['anthropic', 'claude-sonnet-5'],
    agent: 'build',
  }),
  msg('idle1', 'idle', T1 + 1500),
  msg('u2', 'user', T1 + 2000, { text: 'now fix it' }),
  assistant('a2', T1 + 3000, {
    tools: ['edit', 'bash'],
    tokens: [200, 80, 0, 400, 10],
    cost: 0.02,
    model: ['anthropic', 'claude-sonnet-5'],
    agent: 'build',
  }),
  msg('idle2', 'idle', T1 + 3500),
];

run('first idle of a fresh session: bounded slice = turn 1', () => {
  // At that moment the transcript only holds turn 1 (idle2 not yet created).
  const slice = findSlice(transcript.slice(0, 3), null, 'idle');
  if (!slice) return 'expected a slice';
  const s = slice.stats;
  if (s.turnId !== 'u1') return `turnId ${s.turnId}`;
  if (s.prompts !== 1 || s.toolCalls !== 3) return `prompts ${s.prompts} toolCalls ${s.toolCalls}`;
  if (slice.cursorId !== 'idle1') return `cursor ${slice.cursorId}`;
  return null;
});

run(
  'succeeded event with marker already persisted (production race): fresh session still captures turn 2',
  () => {
    // session.execution.succeeded fires ~7 ms after the runtime appends the idle
    // marker, so the handler usually sees the full transcript including idle2.
    // Without the bounded slice a cursorless session would slice past idle2 into
    // nothing and skip forever (verified in production 2026-11-22).
    const slice = findSlice(transcript, null, 'idle');
    if (!slice) return 'expected a slice';
    if (slice.stats.turnId !== 'u2') return `turnId ${slice.stats.turnId}`;
    if (slice.stats.prompts !== 1 || slice.stats.toolCalls !== 2) return 'stats wrong';
    if (slice.cursorId !== 'idle2') return `cursor ${slice.cursorId}`;
    return null;
  },
);

run('idle event whose marker is not persisted yet: tail slice from cursor, same turn key', () => {
  const withoutIdle2 = transcript.slice(0, -1);
  const slice = findSlice(withoutIdle2, 'idle1', 'idle');
  if (!slice) return 'expected a slice';
  if (slice.stats.turnId !== 'u2') return `turnId ${slice.stats.turnId}`;
  if (slice.cursorId !== 'a2') return `cursor ${slice.cursorId}`;
  return null;
});

run('idle event with markers persisted: turn 2 stats correct', () => {
  const slice = findSlice(transcript, 'idle1', 'idle');
  if (!slice) return 'expected a slice';
  const s = slice.stats;
  if (s.turnId !== 'u2') return `turnId ${s.turnId}`;
  if (s.prompts !== 1) return `prompts ${s.prompts}`;
  if (s.toolCalls !== 2) return `toolCalls ${s.toolCalls}`;
  if (s.toolCounts.edit !== 1 || s.toolCounts.bash !== 1) return 'toolCounts wrong';
  if (s.tokens.input !== 200 || s.tokens.cacheRead !== 400) return 'tokens wrong';
  if (s.tokens.total !== 690) return `total ${s.tokens.total}`;
  if (s.model !== 'anthropic/claude-sonnet-5') return `model ${s.model}`;
  if (s.firstPrompt !== 'now fix it') return `firstPrompt ${s.firstPrompt}`;
  if (s.startedAt === null || s.endedAt === null) return 'timestamps missing';
  if (s.durationMs !== 1000) return `duration ${s.durationMs}`;
  return null;
});

run('re-fired event with cursor at transcript end → null (deduped)', () => {
  return findSlice(transcript, 'idle2', 'idle') === null ? null : 'expected null';
});

run('execution.interrupted with no idle marker: partial tail slice', () => {
  const interrupted: TurnMessage[] = [
    msg('u1', 'user', T1, { text: 'long task' }),
    assistant('a1', T1 + 500, { tools: ['read'], tokens: [10, 5, 0, 0, 0] }),
  ];
  const slice = findSlice(interrupted, null, 'execution');
  if (!slice) return 'expected a slice';
  if (slice.stats.turnId !== 'u1') return `turnId ${slice.stats.turnId}`;
  if (slice.stats.toolCalls !== 1) return 'toolCalls';
  return null;
});

run('cursor lost (compaction): falls back to bounded last-turn slice', () => {
  const slice = findSlice(transcript, 'gone-id', 'idle');
  if (!slice) return 'expected a slice';
  if (slice.stats.turnId !== 'u2') return `turnId ${slice.stats.turnId}`;
  return null;
});

run('wrapped {info, parts} shape normalizes like flat messages', () => {
  const wrapped = [
    {
      info: {
        id: 'w1',
        type: 'assistant',
        time: { created: T1 + 7000 },
        tokens: { input: 5, output: 5, reasoning: 0, cache: { read: 0, write: 0 } },
      },
      parts: [{ type: 'tool', name: 'write' }],
    },
  ];
  const normalized = wrapped.map(toTurnMessage).filter((m): m is TurnMessage => m !== null);
  const slice = findSlice(normalized, null, 'execution');
  if (!slice) return 'expected a slice';
  if (slice.stats.toolCalls !== 1 || slice.stats.toolCounts.write !== 1) return 'tool parts wrong';
  if (slice.stats.tokens.total !== 10) return 'tokens wrong';
  return null;
});

run('epoch seconds normalize to ISO UTC Z-form', () => {
  const slice = findSlice(
    [msg('u1', 'user', 1_700_000_000, { text: 'hi' }), assistant('a1', 1_700_000_600)],
    null,
    'execution',
  );
  if (!slice) return 'expected a slice';
  if (slice.stats.startedAt !== '2023-11-14T22:13:20.000Z')
    return `startedAt ${slice.stats.startedAt}`;
  if (!slice.stats.endedAt?.endsWith('Z')) return 'endedAt not UTC Z-form';
  return null;
});

run('empty transcript → null', () =>
  findSlice([], null, 'idle') !== null ? 'expected null' : null,
);

if (failures > 0) {
  console.log(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nall turn-slicing tests passed');

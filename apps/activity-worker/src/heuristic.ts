/**
 * Heuristic categorization from the turn's tool-call distribution.
 * Used directly when Jev is unavailable and as the below-threshold fallback.
 */

export const CATEGORIES = ['planning', 'design', 'coding', 'test_review', 'other'] as const;
export type Category = (typeof CATEGORIES)[number];

const isCategory = (v: string): v is Category => (CATEGORIES as readonly string[]).includes(v);

const EXACT: Record<string, Category> = {
  // research / navigation → planning
  read: 'planning',
  grep: 'planning',
  glob: 'planning',
  ls: 'planning',
  list: 'planning',
  webfetch: 'planning',
  fetch: 'planning',
  websearch: 'planning',
  search: 'planning',
  task: 'planning',
  todoread: 'planning',
  todowrite: 'planning',
  // mutations / execution → coding
  edit: 'coding',
  write: 'coding',
  multiedit: 'coding',
  apply_patch: 'coding',
  patch: 'coding',
  bash: 'coding',
  shell: 'coding',
  // verification workflows → test_review
  fallow: 'test_review',
  'ts-review': 'test_review',
  review: 'test_review',
  diagnose: 'test_review',
  // design tooling → design
  render: 'design',
};

/** Map one tool name to its activity family. Unknown tools fall into 'other'. */
export function familyOf(toolName: string): Category {
  const name = toolName.toLowerCase();
  const exact = EXACT[name];
  if (exact) return exact;
  if (name.startsWith('pencil') || name.startsWith('figma') || name.includes('imagegen'))
    return 'design';
  if (name.startsWith('generate_image') || name.startsWith('image_generate')) return 'design';
  if (name.startsWith('xcode') || name.startsWith('xcrun')) return 'coding';
  if (name.includes('lint') || name.includes('test_') || name.includes('_test'))
    return 'test_review';
  return 'other';
}

/**
 * Dominant-family heuristic: the strongest family wins when it holds at least
 * 40% of tool calls; otherwise the turn is 'other'. A `plan` agent is a strong
 * direct signal for planning regardless of tool mix.
 */
export function heuristicCategory(toolCounts: Record<string, number>, agent?: string): Category {
  if (agent === 'plan') return 'planning';
  const totals = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<Category, number>;
  for (const [name, count] of Object.entries(toolCounts)) {
    if (!Number.isFinite(count) || count <= 0) continue;
    totals[familyOf(name)] += count;
  }
  let total = 0;
  let best: Category = 'other';
  let bestCount = 0;
  for (const category of CATEGORIES) {
    total += totals[category];
    if (totals[category] > bestCount) {
      best = category;
      bestCount = totals[category];
    }
  }
  if (total === 0 || bestCount / total < 0.4) return 'other';
  return best;
}

/** Per-family tool counts — stored as category_mix evidence for later re-classification. */
export function categoryMix(toolCounts: Record<string, number>): Record<Category, number> {
  const mix = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<Category, number>;
  for (const [name, count] of Object.entries(toolCounts)) {
    if (!Number.isFinite(count) || count <= 0) continue;
    mix[familyOf(name)] += count;
  }
  return mix;
}

export { isCategory };

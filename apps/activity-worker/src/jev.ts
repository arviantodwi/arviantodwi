import { jevBaseUrl, type Env } from './env';
import { CATEGORIES, type Category } from './heuristic';
import { categoryMix } from './heuristic';
import type { ValidTurn } from './validate';

/**
 * Jev classification via the owner's custom provider (OpenAI-compatible chat
 * completions — NOT the typed Decisions API). Chat-mode Jev returns no
 * calibrated per-option distribution: we prompt for strict JSON and gate on
 * the self-reported confidence at ≥ 0.7 (decision 4); below threshold, missing
 * confidence, or any failure → heuristic fallback. Primary model with a
 * fallback model in case the primary is down.
 */
const JEV_MODELS = ['jev-1.14.0', 'jev-1.13.0'] as const;
/** Accept the label at or above this self-reported confidence; else heuristic (decision 4). */
export const JEV_MIN_CONFIDENCE = 0.7;
const TIMEOUT_MS = 12_000;

export interface JevResult {
  category: Category;
  probs: Record<string, number> | null;
  confidence: number;
}

const CRITERIA = [
  'planning — research, exploration, requirement gathering, or reading code without changing it',
  'design — visual or interface work: design tools, mockups, image generation, UI crafting',
  'coding — writing or changing source code, running builds or git commands, configuring projects',
  'test_review — running tests, linters, static analysis, or reviewing code and pull requests',
  'other — anything that does not fit the four categories above',
].join('\n');

const SYSTEM_PROMPT =
  'You are a strict classifier for coding-agent activity. Given a digest of one agent turn, pick exactly one category. ' +
  'Respond with ONLY minified JSON, no prose, no code fences: {"category":"planning|design|coding|test_review|other","confidence":<number 0..1>}.\n' +
  'Categories:\n' +
  CRITERIA;

const userPrompt = (turn: ValidTurn): string => {
  const mix = categoryMix(turn.toolCounts);
  const topTools = Object.entries(turn.toolCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => `${name}×${count}`)
    .join(', ');
  return JSON.stringify({
    sessionTitle: turn.title,
    agent: turn.agent,
    promptExcerpt: turn.firstPrompt,
    toolMixByFamily: mix,
    topToolCalls: topTools || undefined,
  });
};

/** Pull the first JSON object out of a model answer, tolerating code fences or prose. */
function parseAnswer(content: string): { category: Category; confidence: number } | null {
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]) as { category?: unknown; confidence?: unknown };
    const category = typeof parsed.category === 'string' ? parsed.category : null;
    const confidence =
      typeof parsed.confidence === 'number' && Number.isFinite(parsed.confidence)
        ? parsed.confidence
        : null;
    if (
      !category ||
      !CATEGORIES.includes(category as Category) ||
      confidence === null ||
      confidence < 0 ||
      confidence > 1
    ) {
      return null;
    }
    return { category: category as Category, confidence };
  } catch {
    return null;
  }
}

/** One chat-completions classification attempt against the provider. */
async function attempt(
  base: string,
  apiKey: string,
  model: string,
  turn: ValidTurn,
): Promise<JevResult | null> {
  try {
    const response = await fetch(`${base}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt(turn) },
        ],
        max_tokens: 100,
        temperature: 0,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return null;
    interface ChatResponse {
      choices?: Array<{ message?: { content?: string } }>;
    }
    const data: ChatResponse = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== 'string') return null;
    const answer = parseAnswer(content);
    if (!answer) return null;
    return { category: answer.category, probs: null, confidence: answer.confidence };
  } catch {
    return null;
  }
}

/**
 * Classify a turn: try the primary model, then the fallback; any failure
 * (missing key, auth, downtime, unparseable answer, low confidence) resolves
 * to null and the caller keeps the heuristic label (graceful degradation).
 */
export async function classifyWithJev(turn: ValidTurn, env: Env): Promise<JevResult | null> {
  if (!env.JEV_API_KEY) return null;
  const base = jevBaseUrl(env);
  for (const model of JEV_MODELS) {
    const result = await attempt(base, env.JEV_API_KEY, model, turn);
    if (result && result.confidence >= JEV_MIN_CONFIDENCE) return result;
  }
  return null;
}

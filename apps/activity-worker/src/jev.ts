import type { Env } from './env';
import { CATEGORIES, type Category } from './heuristic';
import { categoryMix } from './heuristic';
import type { ValidTurn } from './validate';

/**
 * Jev decision-model classification (decision 4): one `choice` question over
 * the five activity categories, answered with calibrated per-option
 * probabilities. Pinned via OpenRouter's `jev-router` alias — the public
 * models list no longer exposes per-version IDs (jev-1.14 / 1.13 return 404);
 * the alias routes to the newest available Jev release. Verified 2026-11-20.
 */
const JEV_MODEL = 'typesafe/jev-router';
const JEV_ENDPOINT = 'https://openrouter.ai/api/alpha/decisions';
/** Accept Jev's label at or above this confidence; otherwise keep the heuristic (decision 4). */
export const JEV_MIN_CONFIDENCE = 0.7;
const TIMEOUT_MS = 8_000;

export interface JevResult {
  category: Category;
  probs: Record<string, number>;
  confidence: number;
}

const CRITERIA: Record<Category, string> = {
  planning: 'Research, exploration, requirement gathering, or reading code without changing it.',
  design: 'Visual or interface work: design tools, mockups, image generation, UI crafting.',
  coding: 'Writing or changing source code, running builds or git commands, configuring projects.',
  test_review: 'Running tests, linters, static analysis, or reviewing code and pull requests.',
  other: 'Anything that does not fit the four categories above.',
};

function digest(turn: ValidTurn): Record<string, unknown> {
  const mix = categoryMix(turn.toolCounts);
  const topTools = Object.entries(turn.toolCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => `${name}×${count}`);
  return {
    sessionTitle: turn.title,
    agent: turn.agent,
    promptExcerpt: turn.firstPrompt,
    toolMixByFamily: mix,
    topToolCalls: topTools,
  };
}

/**
 * Ask Jev which category this turn belongs to. Returns null on any failure —
 * missing key, network error, refusal, malformed answer — and the caller keeps
 * the heuristic label (graceful degradation, decision 4).
 */
export async function classifyWithJev(turn: ValidTurn, env: Env): Promise<JevResult | null> {
  if (!env.OPENROUTER_API_KEY) return null;
  try {
    const response = await fetch(JEV_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: JEV_MODEL,
        state: digest(turn),
        questions: {
          activity_category: {
            type: 'choice',
            instructions: 'Which category best describes what this coding-agent turn did?',
            criteria: CRITERIA,
          },
        },
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return null;
    interface JevResponse {
      answers?: Record<
        string,
        {
          type?: string;
          choice?: string;
          confidence?: number;
          probabilities?: Record<string, number>;
        }
      >;
    }
    const data: JevResponse = await response.json();
    const answer = data.answers?.activity_category;
    const choice = answer?.choice;
    const confidence = answer?.confidence;
    if (answer?.type !== 'choice' || typeof choice !== 'string' || typeof confidence !== 'number')
      return null;
    if (!CATEGORIES.includes(choice as Category)) return null;
    const probs: Record<string, number> = {};
    for (const category of CATEGORIES) {
      const p = answer.probabilities?.[category];
      probs[category] = typeof p === 'number' ? p : 0;
    }
    return { category: choice as Category, probs, confidence };
  } catch {
    return null;
  }
}

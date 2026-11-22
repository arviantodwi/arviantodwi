import { jevBaseUrl, type Env } from './env';
import { CATEGORIES, type Category } from './heuristic';
import { categoryMix } from './heuristic';
import type { ValidTurn } from './validate';

/**
 * Jev classification via the owner's custom provider (a LiteLLM gateway).
 * Jev is a TypeSafe **decision model** — NOT a chat model: the gateway serves
 * it on `POST /v1/decisions` with an OpenAI-shaped body (`input` + a
 * `questions` array whose choice questions are flat:
 * `{ type, instructions, choices: [{ value, description }] }`). Verified
 * 2026-11-22 against the live gateway (HTTP 200, full probability
 * distribution in the response — `category_probs` is populated again).
 */
const JEV_MODELS = ['jev-1.14.0', 'jev-1.13.0'] as const;
/** Accept the label at or above this self-reported confidence; otherwise heuristic (decision 4). */
export const JEV_MIN_CONFIDENCE = 0.7;
const TIMEOUT_MS = 12_000;

export interface JevResult {
  category: Category;
  probs: Record<string, number>;
  confidence: number;
}

const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  planning: 'research, exploration, requirement gathering, or reading code without changing it',
  design: 'visual or interface work: design tools, mockups, image generation, UI crafting',
  coding: 'writing or changing source code, running builds or git commands, configuring projects',
  test_review: 'running tests, linters, static analysis, or reviewing code and pull requests',
  other: 'anything that does not fit the four categories above',
};

const QUESTION_INSTRUCTIONS = 'Which category best describes what this coding-agent turn did?';

function digestInput(turn: ValidTurn): string {
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
}

function buildRequest(model: string, turn: ValidTurn): unknown {
  return {
    model,
    input: digestInput(turn),
    questions: [
      {
        type: 'choice',
        instructions: QUESTION_INSTRUCTIONS,
        choices: CATEGORIES.map((value) => ({ value, description: CATEGORY_DESCRIPTIONS[value] })),
      },
    ],
  };
}

interface DecisionResponse {
  answers?: Array<{
    type?: string;
    choice?: string;
    confidence?: number;
    probabilities?: Array<{ value?: string; probability?: number }>;
  }>;
}

async function attempt(
  base: string,
  apiKey: string,
  model: string,
  turn: ValidTurn,
): Promise<JevResult | null> {
  try {
    const response = await fetch(`${base}/v1/decisions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildRequest(model, turn)),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.warn(
        `[jev] ${model}: HTTP ${response.status} — falling back (${body.slice(0, 200)})`,
      );
      return null;
    }
    const data: DecisionResponse = await response.json();
    const answer = data.answers?.[0];
    const choice = answer?.choice;
    const confidence = answer?.confidence;
    if (answer?.type !== 'choice' || typeof choice !== 'string' || typeof confidence !== 'number') {
      console.warn(`[jev] ${model}: unexpected answer shape — falling back`);
      return null;
    }
    if (!CATEGORIES.includes(choice as Category)) {
      console.warn(`[jev] ${model}: unknown choice "${choice}" — falling back`);
      return null;
    }
    const probs: Record<string, number> = {};
    for (const item of answer.probabilities ?? []) {
      if (typeof item?.value === 'string' && typeof item?.probability === 'number') {
        probs[item.value] = item.probability;
      }
    }
    return { category: choice as Category, probs, confidence };
  } catch (error) {
    console.warn(
      `[jev] ${model}: request failed (${error instanceof Error ? error.message : String(error)}) — falling back`,
    );
    return null;
  }
}

/**
 * Classify a turn: try the primary model, then the fallback; any failure
 * (missing key, auth, downtime, unparseable answer, low confidence) resolves
 * to null and the caller keeps the heuristic label (graceful degradation).
 */
export async function classifyWithJev(turn: ValidTurn, env: Env): Promise<JevResult | null> {
  if (!env.JEV_API_KEY) {
    console.warn('[jev] no JEV_API_KEY configured — heuristic-only mode');
    return null;
  }
  const base = jevBaseUrl(env);
  for (const model of JEV_MODELS) {
    const result = await attempt(base, env.JEV_API_KEY, model, turn);
    if (!result) continue;
    if (result.confidence >= JEV_MIN_CONFIDENCE) return result;
    console.warn(
      `[jev] ${model}: confidence ${result.confidence} < ${JEV_MIN_CONFIDENCE} — trying next / heuristic`,
    );
  }
  return null;
}

import type { Context } from 'hono';
import { aggregate, parseRange } from './days';
import type { Env } from './env';

/**
 * Minimal MCP streamable-HTTP server (stateless mode, JSON responses, no SSE
 * stream). v1 exposes exactly one read-only tool: `get_activity_stats` — a
 * thin wrapper over the same aggregation as GET /activity/days (decision 12).
 * The write tool (`submit_agent_activity`) is deferred; the Bearer gate stays
 * identical so it can be added later without auth changes.
 */

const SERVER_INFO = { name: 'agent-activity', version: '1.0.0' } as const;

interface JsonRpcRequest {
  jsonrpc?: string;
  id?: string | number;
  method?: string;
  params?: Record<string, unknown>;
}

const jsonRpcError = (id: string | number | null, code: number, message: string) =>
  Response.json({ jsonrpc: '2.0', id, error: { code, message } });

const jsonRpcResult = (id: string | number | null, result: unknown) =>
  Response.json({ jsonrpc: '2.0', id, result });

const STATS_TOOL = {
  name: 'get_activity_stats',
  description:
    'Aggregate daily agent-activity statistics (tokens, prompts, tool calls, minutes, per-category breakdown) plus per-turn numeric records. Numbers only.',
  inputSchema: {
    type: 'object',
    properties: {
      range: {
        type: 'string',
        description:
          'Optional window: "last12" for the trailing 12 months, or a 4-digit calendar year (e.g. "2026"). Omit for full history.',
      },
    },
    additionalProperties: false,
  },
} as const;

export async function handleMcpPost(c: Context<{ Bindings: Env }>): Promise<Response> {
  let message: unknown;
  try {
    message = await c.req.json();
  } catch {
    return jsonRpcError(null, -32700, 'Parse error');
  }
  if (Array.isArray(message)) {
    return Response.json({ error: 'Batching is not supported' }, { status: 400 });
  }
  const request = message as JsonRpcRequest;
  if (request.jsonrpc !== '2.0' || typeof request.method !== 'string') {
    return jsonRpcError(null, -32600, 'Invalid Request');
  }

  // Notifications carry no id and expect no response body.
  const isNotification = !('id' in request);
  const id = isNotification ? null : (request.id ?? null);

  switch (request.method) {
    case 'initialize': {
      if (isNotification) return jsonRpcError(null, -32600, 'initialize must be a request');
      const requested = (request.params as { protocolVersion?: string } | undefined)
        ?.protocolVersion;
      return jsonRpcResult(id, {
        protocolVersion: typeof requested === 'string' ? requested : '2025-06-18',
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      });
    }
    case 'notifications/initialized':
    case 'notifications/cancelled':
      return new Response(null, { status: 202 });
    case 'ping':
      return jsonRpcResult(id, {});
    case 'tools/list':
      return jsonRpcResult(id, { tools: [STATS_TOOL] });
    case 'tools/call': {
      const params = request.params ?? {};
      const name = params.name;
      if (typeof name !== 'string') return jsonRpcResult(id, toolError('Missing tool name'));
      if (name !== STATS_TOOL.name) {
        return jsonRpcResult(
          id,
          toolError(`Unknown tool "${name}" (read-only server: get_activity_stats only)`),
        );
      }
      const args = (params.arguments ?? {}) as { range?: unknown };
      const range = parseRange(typeof args.range === 'string' ? args.range : undefined);
      if (!range)
        return jsonRpcResult(id, toolError('range must be "last12", a 4-digit year, or omitted'));
      const { days, turns } = await aggregate(c.env.DB, activityTzOf(c), range);
      return jsonRpcResult(id, {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ days, turns, generatedAt: new Date().toISOString() }),
          },
        ],
      });
    }
    default:
      if (isNotification) return new Response(null, { status: 202 });
      return jsonRpcError(id, -32601, 'Method not found');
  }
}

function activityTzOf(c: Context<{ Bindings: Env }>): string {
  return c.env.ACTIVITY_TZ || 'Asia/Jakarta';
}

function toolError(message: string) {
  return { content: [{ type: 'text', text: message }], isError: true };
}

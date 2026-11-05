import { Hono } from 'hono';
import type { ChatRequest, ChatResponse, ChatTopic } from '../../shared/types';
import { loadSiteData } from '../db/site';
import type { Env } from '../env';
import { allow, clientKey } from '../middleware/rateLimit';
import { SYSTEM_PROMPT } from '../prompts/assistant';
import { AiQuotaExhaustedError, getProvider } from '../services/ai';
import { buildContext } from '../services/chatContext';
import { answerTopic } from '../services/topicAnswers';

const TOPICS: ChatTopic[] = ['horario', 'ubicacion', 'pagos', 'servicios', 'promociones', 'contacto'];
const MAX_CHARS = 300;

const app = new Hono<{ Bindings: Env }>();

async function logUsage(env: Env, provider: string, model: string, ok: boolean, errorCode = '') {
  await env.DB.prepare(`INSERT INTO ai_usage_logs (feature, provider, model, ok, error_code) VALUES ('chat', ?1, ?2, ?3, ?4)`)
    .bind(provider, model, ok ? 1 : 0, errorCode)
    .run();
}

app.post('/', async (c) => {
  const body = (await c.req.json().catch(() => null)) as ChatRequest | null;
  const topic = body?.topic;
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (topic && !TOPICS.includes(topic)) return c.json({ error: 'INVALID_TOPIC' }, 400);
  if (!topic && (message.length < 1 || message.length > MAX_CHARS)) {
    return c.json({ error: 'INVALID_MESSAGE', message: `Escribí una consulta de hasta ${MAX_CHARS} caracteres.` }, 400);
  }

  const who = await clientKey(c.req.raw);
  if (!(await allow(c.env.DB, `chat:${who}`, 10 * 60, topic ? 40 : 12))) {
    return c.json({ error: 'RATE_LIMITED', message: 'Hiciste muchas consultas seguidas. Probá de nuevo en unos minutos.' }, 429);
  }

  const data = await loadSiteData(c.env.DB);

  if (topic) {
    const res: ChatResponse = { reply: answerTopic(topic, data), source: 'datos' };
    return c.json(res);
  }

  const dailyLimit = Number(c.env.AI_DAILY_CHAT_LIMIT) || 400;
  const used = await c.env.DB.prepare(
    `SELECT COUNT(*) AS n FROM ai_usage_logs WHERE feature = 'chat' AND ok = 1 AND date(created_at) = date('now')`,
  ).first<{ n: number }>();
  const quotaMsg = `Nuestro asistente virtual alcanzó el límite diario de consultas. Podés comunicarte con nosotros por WhatsApp. Volvé a consultar más tarde.`;
  if ((used?.n ?? 0) >= dailyLimit) {
    return c.json({ error: 'AI_DAILY_QUOTA_EXHAUSTED', message: quotaMsg }, 503);
  }

  const provider = getProvider(c.env);
  try {
    const reply = await provider.generate(
      [
        { role: 'system', content: `${SYSTEM_PROMPT}\n\nDATOS:\n${buildContext(data)}` },
        { role: 'user', content: message },
      ],
      { maxTokens: 250, temperature: 0.3 },
    );
    await logUsage(c.env, provider.name, provider.model, true);
    const res: ChatResponse = { reply, source: 'ia' };
    return c.json(res);
  } catch (e) {
    if (e instanceof AiQuotaExhaustedError) {
      await logUsage(c.env, provider.name, provider.model, false, 'AI_DAILY_QUOTA_EXHAUSTED');
      return c.json({ error: 'AI_DAILY_QUOTA_EXHAUSTED', message: quotaMsg }, 503);
    }
    console.error('chat AI error', e);
    await logUsage(c.env, provider.name, provider.model, false, 'AI_UNAVAILABLE');
    return c.json(
      { error: 'AI_UNAVAILABLE', message: 'El asistente no está disponible en este momento. Podés escribirnos por WhatsApp.' },
      503,
    );
  }
});

export default app;

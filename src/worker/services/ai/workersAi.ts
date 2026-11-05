import type { Env } from '../../env';
import { AiQuotaExhaustedError, AiUnavailableError, type AIMessage, type AIProvider, type GenerateOptions } from './provider';

function extractText(res: unknown): string {
  const r = res as Record<string, any> | null;
  if (!r) return '';
  if (typeof r.response === 'string') return r.response;
  const choice = r.choices?.[0]?.message?.content;
  if (typeof choice === 'string') return choice;
  if (typeof r.result?.response === 'string') return r.result.response;
  return '';
}

function mapError(e: unknown): Error {
  const msg = e instanceof Error ? e.message : String(e);
  if (/3036|4006|daily free allocation|neurons|\b429\b/i.test(msg)) return new AiQuotaExhaustedError(msg);
  return new AiUnavailableError(msg);
}

export class WorkersAiProvider implements AIProvider {
  readonly name = 'workers-ai';
  constructor(private readonly ai: Env['AI'], readonly model: string) {}

  async generate(messages: AIMessage[], opts: GenerateOptions): Promise<string> {
    try {
      const res = await (this.ai as any).run(this.model, {
        messages,
        max_tokens: opts.maxTokens,
        temperature: opts.temperature ?? 0.3,
      });
      const text = extractText(res).trim();
      if (!text) throw new AiUnavailableError('Respuesta vacía del modelo');
      return text;
    } catch (e) {
      if (e instanceof AiQuotaExhaustedError || e instanceof AiUnavailableError) throw e;
      throw mapError(e);
    }
  }
}

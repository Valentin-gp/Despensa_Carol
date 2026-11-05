export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GenerateOptions {
  maxTokens: number;
  temperature?: number;
}

export interface AIProvider {
  readonly name: string;
  readonly model: string;
  generate(messages: AIMessage[], opts: GenerateOptions): Promise<string>;
}

/** Se agotó la cuota diaria (propia o de Cloudflare). */
export class AiQuotaExhaustedError extends Error {
  readonly code = 'AI_DAILY_QUOTA_EXHAUSTED';
}

/** El proveedor falló por otra razón (modelo caído, respuesta vacía, etc.). */
export class AiUnavailableError extends Error {
  readonly code = 'AI_UNAVAILABLE';
}

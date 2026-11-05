export interface Env {
  DB: D1Database;
  AI: Ai;
  ASSETS: Fetcher;
  AI_PROVIDER: string; // "fake" | "workers-ai"
  AI_MODEL: string;
  AI_DAILY_CHAT_LIMIT: string;
  ADMIN_ACCESS_KEY?: string; // secreto: wrangler secret put ADMIN_ACCESS_KEY
}

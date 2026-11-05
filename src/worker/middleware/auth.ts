import type { Context, MiddlewareHandler } from 'hono';
import { getCookie } from 'hono/cookie';
import type { Env } from '../env';
import { sha256Hex } from './rateLimit';

export const SESSION_COOKIE = 'dc_session';
export const SESSION_SECONDS = 60 * 60 * 24 * 30;

export async function isAdmin(c: Context<{ Bindings: Env }>): Promise<boolean> {
  const token = getCookie(c, SESSION_COOKIE);
  if (!token) return false;
  const hash = await sha256Hex(token);
  const now = Math.floor(Date.now() / 1000);
  const row = await c.env.DB.prepare(`SELECT 1 AS ok FROM admin_sessions WHERE token_hash = ?1 AND expires_at > ?2`)
    .bind(hash, now)
    .first();
  return !!row;
}

/** Bloquea cualquier ruta que no venga de un administrador con sesión válida. */
export const requireAdmin: MiddlewareHandler<{ Bindings: Env }> = async (c, next) => {
  if (c.req.method !== 'GET' && c.req.method !== 'HEAD') {
    const origin = c.req.header('Origin');
    if (origin && new URL(origin).host !== new URL(c.req.url).host) {
      return c.json({ error: 'FORBIDDEN_ORIGIN' }, 403);
    }
  }
  if (!(await isAdmin(c))) return c.json({ error: 'UNAUTHORIZED' }, 401);
  await next();
};

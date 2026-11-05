import { Hono } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import type { Env } from '../env';
import { isAdmin, requireAdmin, SESSION_COOKIE, SESSION_SECONDS } from '../middleware/auth';
import { allow, clientKey, sha256Hex } from '../middleware/rateLimit';

const app = new Hono<{ Bindings: Env }>();

async function sameKey(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b)),
  ]);
  return (crypto.subtle as unknown as { timingSafeEqual(a: ArrayBuffer, b: ArrayBuffer): boolean }).timingSafeEqual(ha, hb);
}

function newToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

app.post('/login', async (c) => {
  const secret = c.env.ADMIN_ACCESS_KEY;
  if (!secret || secret.length < 24) return c.json({ error: 'ADMIN_NOT_CONFIGURED' }, 503);

  const origin = c.req.header('Origin');
  if (origin && new URL(origin).host !== new URL(c.req.url).host) return c.json({ error: 'FORBIDDEN_ORIGIN' }, 403);

  const who = await clientKey(c.req.raw);
  if (!(await allow(c.env.DB, `login:${who}`, 15 * 60, 5))) {
    return c.json({ error: 'TOO_MANY_ATTEMPTS', message: 'Demasiados intentos. Probá de nuevo en unos minutos.' }, 429);
  }

  const body = (await c.req.json().catch(() => null)) as { key?: unknown } | null;
  const key = typeof body?.key === 'string' ? body.key.trim() : '';
  if (!key || !(await sameKey(key, secret))) {
    return c.json({ error: 'INVALID_KEY', message: 'Clave incorrecta.' }, 401);
  }

  const token = newToken();
  const now = Math.floor(Date.now() / 1000);
  await c.env.DB.prepare(`INSERT INTO admin_sessions (token_hash, created_at, expires_at) VALUES (?1, ?2, ?3)`)
    .bind(await sha256Hex(token), now, now + SESSION_SECONDS)
    .run();
  await c.env.DB.prepare(`DELETE FROM admin_sessions WHERE expires_at < ?1`).bind(now).run();

  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/',
    maxAge: SESSION_SECONDS,
  });
  return c.json({ ok: true });
});

app.post('/logout', async (c) => {
  const token = getCookie(c, SESSION_COOKIE);
  if (token) {
    await c.env.DB.prepare(`DELETE FROM admin_sessions WHERE token_hash = ?1`).bind(await sha256Hex(token)).run();
  }
  deleteCookie(c, SESSION_COOKIE, { path: '/' });
  return c.json({ ok: true });
});

app.get('/me', async (c) => c.json({ authenticated: await isAdmin(c) }));

app.get('/ping', requireAdmin, (c) => c.json({ ok: true }));

export default app;

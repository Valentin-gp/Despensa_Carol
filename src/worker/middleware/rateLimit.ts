export async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function clientKey(request: Request): Promise<string> {
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  return (await sha256Hex(ip)).slice(0, 24); // no guardamos la IP en claro
}

/** Devuelve true si todavía está dentro del límite. Ventana fija de `windowSec` segundos. */
export async function allow(db: D1Database, key: string, windowSec: number, max: number): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % windowSec);
  const row = await db
    .prepare(
      `INSERT INTO rate_limits (key, count, expires_at) VALUES (?1, 1, ?2)
       ON CONFLICT(key) DO UPDATE SET count = count + 1
       RETURNING count`,
    )
    .bind(`${key}:${windowStart}`, windowStart + windowSec)
    .first<{ count: number }>();
  if (Math.random() < 0.02) {
    await db.prepare(`DELETE FROM rate_limits WHERE expires_at < ?1`).bind(now).run();
  }
  return (row?.count ?? 1) <= max;
}

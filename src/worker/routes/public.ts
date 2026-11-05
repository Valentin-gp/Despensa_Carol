import { Hono } from 'hono';
import { loadSiteData } from '../db/site';
import type { Env } from '../env';

const app = new Hono<{ Bindings: Env }>();

app.get('/site', async (c) => {
  const data = await loadSiteData(c.env.DB);
  c.header('Cache-Control', 'public, max-age=60');
  return c.json(data);
});

export default app;

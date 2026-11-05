import { Hono } from 'hono';
import type { Env } from './env';
import adminAuth from './routes/adminAuth';
import chat from './routes/chat';
import publicRoutes from './routes/public';

const app = new Hono<{ Bindings: Env }>();

app.route('/api/public', publicRoutes);
app.route('/api/chat', chat);
app.route('/api/admin/auth', adminAuth);

app.notFound((c) => c.json({ error: 'NOT_FOUND' }, 404));
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'INTERNAL_ERROR' }, 500);
});

export default app;

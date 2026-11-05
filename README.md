# Despensa Carol — web + asistente de IA

React + Vite + TypeScript, un Worker de Cloudflare (Hono) como API, D1 como base de datos y Workers AI.

## Primera vez (en tu computadora)

```bash
npm install
npx wrangler login
npx wrangler d1 create despensa-carol-db
```

Copiá el `database_id` que muestra el último comando y pegalo en `wrangler.jsonc` (reemplaza `REEMPLAZAR_CON_EL_ID...`).

```bash
npm run db:migrate:local          # crea las tablas y los datos de Despensa Carol en tu PC
cp .dev.vars.example .dev.vars    # y editá ADMIN_ACCESS_KEY (clave larga, mínimo 24 caracteres)
npm run dev                       # http://localhost:5173  (admin en /admin)
```

> Nota: el binding de IA (`ai` en `wrangler.jsonc`) siempre se conecta a Cloudflare, incluso en desarrollo. Por eso `npm run dev` necesita que hayas hecho `npx wrangler login` y tener internet. Con `AI_PROVIDER` en `"fake"` no se consume cuota.

## Publicar

```bash
npm run db:migrate:remote                 # crea las tablas en la base real
npx wrangler secret put ADMIN_ACCESS_KEY  # pegá la clave larga del administrador
npm run deploy                            # compila y publica en Cloudflare
```

Wrangler muestra la URL final (`despensa-carol.<tu-subdominio>.workers.dev`).

## Activar la IA real

Por defecto `AI_PROVIDER` es `"fake"` (respuestas de prueba, no gasta cuota). Para probar Workers AI, cambiá en `wrangler.jsonc`:

```jsonc
"AI_PROVIDER": "workers-ai",
"AI_MODEL": "@cf/google/gemma-4-26b-a4b-it"   // alternativa: "@cf/meta/llama-3.1-8b-instruct-fp8-fast"
```

`AI_DAILY_CHAT_LIMIT` es un tope propio de consultas con IA por día (UTC), para no agotar los 10.000 Neurons gratis.

## Estructura

- `src/client`: sitio público y `/admin` (React).
- `src/worker`: API (`/api/public`, `/api/chat`, `/api/admin/auth`), capa de IA intercambiable en `services/ai`.
- `src/shared`: tipos y funciones usadas por ambos lados.
- `migrations`: esquema y datos iniciales de D1.

## Diseño

- Paleta de la marca en `src/client/styles.css` (variables `--forest`, `--gold`, `--ground`, `--ink`). Una sola tipografía, Bricolage Grotesque, instalada con el proyecto (no depende de servidores externos).
- Motivo único: el festón del óvalo del logo, que también es el borde de un toldo (`components/Awning.tsx`).
- Las fotos están en `public/fotos` (WebP). Para cambiar las del hero o la galería, editá `components/Hero.tsx` y `components/Gallery.tsx`.
- Los horarios, medios de pago, rubros y recargas salen de la base de datos (migración `0002_seed_despensa_carol.sql`).

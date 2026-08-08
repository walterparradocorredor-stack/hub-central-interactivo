# Hub Central Interactivo — WP Ecosystem

Plataforma central del ecosistema digital de Walther Parrado.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Base de datos:** Supabase (PostgreSQL)
- **Infraestructura:** Docker · VPS Hostinger KVM 8

## Despliegue

```bash
docker compose up -d
```

## Variables de entorno requeridas

```
NODE_ENV=production
SUPABASE_INTERNAL_URL=http://supabase-kong:8000
GROQ_API_KEY=...
```

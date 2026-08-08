# WP Ecosystem & Hub Central Interactivo — Dr. Walther Parrado

Repositorio central del ecosistema digital institucional del Dr. Walther Parrado y Jowhalth Academy.

---

## 🛠️ Stack Tecnológico & Arquitectura
- **Framework:** Next.js (App Router), TypeScript, TailwindCSS, Vanilla CSS.
- **Backend & BD:** Supabase (PostgreSQL) + PocketBase (SQLite).
- **Contenedores & Infraestructura:** Docker / Docker Compose (`hub-front` en puerto `3050:3000`).
- **Servidor VPS:** Hostinger KVM 8 (`31.97.145.8`).
- **Proxy & Dominios:** Nginx Proxy Manager + Cloudflare WAF.
  - Dominio Principal: `https://waltherparrado.com`
  - Subdominio Hub: `https://hub.waltherparrado.com`

---

## 📋 Bitácora de Sesión & Estado Actual (06 de Agosto de 2026)

### 1. Nueva Página de Servicios WhatsApp IA (`/whatsapp-ia`)
- **Archivos creados:**
  - `src/app/whatsapp-ia/page.tsx` (Ruta directa Hub).
  - `src/app/waltherparrado/whatsapp-ia/page.tsx` (Ruta para enrutamiento interno de `waltherparrado.com`).
- **Funcionalidades:**
  - 3 Pilares de servicio: *Bot Web Essentials*, *Bot Web + WhatsApp IA* (Popular) y *Omnicanal Premium*.
  - Calculadora interactiva de 1 a 30 líneas de WhatsApp con modalidades escalables y cotización a la medida.
  - Tabla comparativa de características (features) y benchmarking de mercado vs soluciones globales.
  - Integración de CTA directo a WhatsApp de Walther Parrado (`+57 313 490 0223`).
  - Modalidad de cotizaciones a la medida sin mostrar cifras numéricas brutas.
- **SEO & Sitemap:**
  - Actualizado `src/app/sitemap.ts` para registrar `/whatsapp-ia` de forma automática.

### 2. Fix ContalLab Fundetec (`/fundetec/contalab`)
- **Hydration Mismatch (React Error #418):**
  - Se corrigió la inicialización dinámica de `new Date()` en `useState` trasladándola a un `useEffect` ejecutado únicamente en cliente.
- **Sincronización de Documento Inicial:**
  - Se corrigió la inconsistencia donde `docType` iniciaba en `factura_venta` pero `docNumber` iniciaba con prefijo de egreso (`CE-2026-001`). Ahora inicia sincronizado en `FV-2026-001`.

### 3. Correcciones de Build & Proyectos
- **Proyectos Data (`src/data/projects.json`):**
  - Creado el archivo de datos `projects.json` para corregir la dependencia de importación en `ProjectsPreview.tsx` que causaba error de compilación.

### 4. Sincronización de Ramas Git
- Sincronización forzada entre la rama local `master` y la rama remota predeterminada `main` de GitHub (`origin/main` y `origin/master`).

---

## 🚀 Despliegue en Servidor Producción (Hostinger VPS)

```bash
# Comandos de despliegue en /root/hub-central-interactivo
git pull origin main
docker compose build --no-cache
docker compose up -d
```

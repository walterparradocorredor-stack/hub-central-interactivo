import { createClient } from '@supabase/supabase-js';

// En el servidor (dentro del contenedor Docker) usaremos la URL interna de Kong.
// En el navegador (cliente), usaremos siempre la URL self-hosted de tu VPS.
const isServer = typeof window === 'undefined';

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const selfHostedUrl = (!envUrl || envUrl.includes('supabase.co'))
  ? 'https://waltherparrado.com/supabase-api'
  : envUrl;

const supabaseUrl = isServer
  ? (process.env.SUPABASE_INTERNAL_URL || selfHostedUrl || 'http://supabase-kong:8000')
  : selfHostedUrl;

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzg2NTU1MTI0LCJleHAiOjIxMDE5MTUxMjR9.gxsX0XhFm7uw7JjCJ5NB1g4K9Z8V_pRUkaLPHQo6Ps0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Cliente Supabase server-side que actúa como el usuario dueño de `accessToken`
 * (su JWT de sesión), para que las políticas RLS filtren por ese usuario en vez
 * de por el anon público. Úsalo en route handlers que reciben el token del
 * cliente vía header Authorization.
 */
export function getUserScopedClient(accessToken: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } }
  });
}

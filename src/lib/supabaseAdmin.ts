import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_INTERNAL_URL
  || process.env.NEXT_PUBLIC_SUPABASE_URL
  || 'http://supabase-kong:8000';

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Cliente Supabase con la service_role key: ignora RLS. Solo debe usarse en
 * código server-side (route handlers), nunca importarse en un componente 'use client'.
 */
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

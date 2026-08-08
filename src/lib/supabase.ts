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

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export interface RecordDomainPurchaseParams {
  buyerEmail?: string | null;
  domainName: string;
  years?: number;
  registrarOrderId?: string;
  paymentMethod: 'paypal' | 'wompi';
  transactionId?: string;
  amount?: number;
  currency?: string;
  cloudflareZoneId?: string;
  nameServers?: string[];
  dnsConnected: boolean;
}

/**
 * Guarda un dominio registrado exitosamente en `domain_purchases`, para que
 * el usuario dueño de ese email lo vea en /panel/dominios. Si no hay email
 * (el checkout es anónimo, ver dominios/page.tsx) no se guarda nada, porque
 * no habría con qué vincularlo a una cuenta.
 */
export async function recordDomainPurchase(params: RecordDomainPurchaseParams): Promise<void> {
  if (!params.buyerEmail) return;

  const years = params.years ?? 1;
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + years);

  const { error } = await supabaseAdmin.from('domain_purchases').insert({
    buyer_email: params.buyerEmail,
    domain_name: params.domainName,
    years,
    registrar: 'namecheap',
    registrar_order_id: params.registrarOrderId,
    payment_method: params.paymentMethod,
    transaction_id: params.transactionId,
    amount: params.amount,
    currency: params.currency,
    status: 'registered',
    cloudflare_zone_id: params.cloudflareZoneId,
    nameservers: params.nameServers,
    dns_status: params.dnsConnected ? 'connected' : 'failed',
    expires_at: expiresAt.toISOString().slice(0, 10)
  });

  if (error) {
    console.error('Error al guardar domain_purchases:', error);
  }
}

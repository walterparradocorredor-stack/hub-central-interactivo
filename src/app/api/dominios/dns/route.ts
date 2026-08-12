import { NextRequest, NextResponse } from 'next/server';
import { getUserScopedClient } from '@/lib/supabase';
import { cloudflareClient } from '@/lib/cloudflare';

interface DnsRecordInput {
  id: string;
  type: string;
  name: string;
  content: string;
  ttl?: number;
}

const PROXIABLE_TYPES = new Set(['A', 'AAAA', 'CNAME']);

async function resolveOwnedDomain(accessToken: string, domainId: string) {
  const scopedClient = getUserScopedClient(accessToken);
  const { data, error } = await scopedClient
    .from('domain_purchases')
    .select('id, domain_name, cloudflare_zone_id')
    .eq('id', domainId)
    .single();

  if (error || !data) return null;
  return data as { id: string; domain_name: string; cloudflare_zone_id: string | null };
}

function getAccessToken(request: NextRequest): string | null {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length);
}

export async function GET(request: NextRequest) {
  const accessToken = getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const domainId = request.nextUrl.searchParams.get('domainId');
  if (!domainId) {
    return NextResponse.json({ error: 'domainId es requerido' }, { status: 400 });
  }

  const domain = await resolveOwnedDomain(accessToken, domainId);
  if (!domain) {
    return NextResponse.json({ error: 'Dominio no encontrado' }, { status: 404 });
  }

  if (!domain.cloudflare_zone_id) {
    return NextResponse.json({ domainName: domain.domain_name, records: [] });
  }

  const result = await cloudflareClient.listDnsRecords(domain.cloudflare_zone_id);
  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Error al consultar DNS' }, { status: 502 });
  }

  return NextResponse.json({ domainName: domain.domain_name, records: result.records });
}

export async function POST(request: NextRequest) {
  const accessToken = getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const body = await request.json();
  const domainId = body?.domainId as string;
  const records = body?.records as DnsRecordInput[];

  if (!domainId || !Array.isArray(records)) {
    return NextResponse.json({ error: 'domainId y records son requeridos' }, { status: 400 });
  }

  const domain = await resolveOwnedDomain(accessToken, domainId);
  if (!domain) {
    return NextResponse.json({ error: 'Dominio no encontrado' }, { status: 404 });
  }
  if (!domain.cloudflare_zone_id) {
    return NextResponse.json({ error: 'Este dominio todavía no tiene zona DNS asignada' }, { status: 400 });
  }

  const zoneId = domain.cloudflare_zone_id;
  const current = await cloudflareClient.listDnsRecords(zoneId);
  if (!current.success) {
    return NextResponse.json({ error: current.error || 'Error al leer el estado actual de DNS' }, { status: 502 });
  }

  const currentIds = new Set((current.records || []).map((r) => r.id));
  const keptIds = new Set(records.map((r) => r.id).filter((id) => currentIds.has(id)));

  const errors: string[] = [];

  for (const record of records) {
    if (!record.type || !record.name || !record.content) continue;

    const proxied = PROXIABLE_TYPES.has(record.type.toUpperCase());

    if (currentIds.has(record.id)) {
      const result = await cloudflareClient.updateDnsRecord(zoneId, record.id, {
        type: record.type,
        name: record.name,
        content: record.content,
        ttl: record.ttl,
        proxied
      });
      if (!result.success) errors.push(`${record.name}: ${result.error}`);
    } else {
      const result = await cloudflareClient.createDnsRecord(zoneId, {
        type: record.type,
        name: record.name,
        content: record.content,
        ttl: record.ttl,
        proxied
      });
      if (!result.success) errors.push(`${record.name}: ${result.error}`);
    }
  }

  for (const existingId of currentIds) {
    if (!keptIds.has(existingId)) {
      const result = await cloudflareClient.deleteDnsRecord(zoneId, existingId);
      if (!result.success) errors.push(`Error al borrar registro: ${result.error}`);
    }
  }

  const updated = await cloudflareClient.listDnsRecords(zoneId);

  return NextResponse.json({
    success: errors.length === 0,
    errors: errors.length ? errors : undefined,
    records: updated.records || []
  });
}

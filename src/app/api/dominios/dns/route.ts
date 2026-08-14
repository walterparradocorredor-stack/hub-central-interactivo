import { NextRequest, NextResponse } from 'next/server';
import { getUserScopedClient } from '@/lib/supabase';
import { cloudflareClient } from '@/lib/cloudflare';

interface DnsRecordInput {
  id: string;
  type: string;
  name: string;
  content: string;
  ttl?: number;
  priority?: number;
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

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido en el body de la petición' }, { status: 400 });
  }
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

  const currentById = new Map((current.records || []).map((r) => [r.id, r]));
  const currentIds = new Set(currentById.keys());
  const keptIds = new Set(records.map((r) => r.id).filter((id) => currentIds.has(id)));

  const errors: string[] = [];

  for (const record of records) {
    if (!record.type || !record.name || !record.content) {
      errors.push(`Registro inválido (id=${record.id || 'nuevo'}): faltan type/name/content, no se aplicó ningún cambio`);
      continue;
    }

    const proxied = PROXIABLE_TYPES.has(record.type.toUpperCase());

    if (currentIds.has(record.id)) {
      const existing = currentById.get(record.id)!;
      const unchanged =
        existing.type === record.type &&
        existing.name === record.name &&
        existing.content === record.content &&
        existing.proxied === proxied &&
        (existing.priority ?? undefined) === (record.priority ?? undefined) &&
        (record.ttl === undefined || existing.ttl === record.ttl);
      if (unchanged) continue;

      const result = await cloudflareClient.updateDnsRecord(zoneId, record.id, {
        type: record.type,
        name: record.name,
        content: record.content,
        ttl: record.ttl,
        priority: record.priority,
        proxied
      });
      if (!result.success) errors.push(`${record.name}: ${result.error}`);
    } else {
      const result = await cloudflareClient.createDnsRecord(zoneId, {
        type: record.type,
        name: record.name,
        content: record.content,
        ttl: record.ttl,
        priority: record.priority,
        proxied
      });
      if (!result.success) errors.push(`${record.name}: ${result.error}`);
    }
  }

  for (const existingId of currentIds) {
    if (!keptIds.has(existingId)) {
      const result = await cloudflareClient.deleteDnsRecord(zoneId, existingId);
      if (!result.success) {
        const name = currentById.get(existingId)?.name || existingId;
        errors.push(`No se pudo borrar ${name}: ${result.error}`);
      }
    }
  }

  const updated = await cloudflareClient.listDnsRecords(zoneId);
  if (!updated.success) {
    errors.push('Los cambios se aplicaron pero no se pudo confirmar el estado final de la zona; refresca para verificarlo.');
  }

  return NextResponse.json({
    success: errors.length === 0,
    errors: errors.length ? errors : undefined,
    records: updated.success ? updated.records : undefined
  });
}

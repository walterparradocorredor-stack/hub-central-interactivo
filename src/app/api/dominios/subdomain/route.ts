import { NextRequest, NextResponse } from 'next/server';
import { cloudflareClient, DEFAULT_TARGET_IP } from '@/lib/cloudflare';

const BASE_DOMAIN = 'waltherparrado.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, targetIp } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Por favor especifica el nombre del subdominio' }, { status: 400 });
    }

    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (cleanName.length < 3) {
      return NextResponse.json({ error: 'El nombre del subdominio debe tener al menos 3 caracteres' }, { status: 400 });
    }

    const resolvedIp = targetIp || DEFAULT_TARGET_IP;
    const result = await cloudflareClient.createSubdomainRecord(cleanName, BASE_DOMAIN, resolvedIp);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'No se pudo crear el registro DNS en Cloudflare' }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      subdomain: result.fqdn,
      ip: resolvedIp,
      status: 'Activo en Servidor VPS',
      dnsType: 'A Record',
      message: `¡Subdominio ${result.fqdn} configurado exitosamente apuntando a ${resolvedIp}!`,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días de prueba gratis
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

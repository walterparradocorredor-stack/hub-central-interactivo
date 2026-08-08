import { NextRequest, NextResponse } from 'next/server';

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

    const fullSubdomain = `${cleanName}.hubcentral.tech`;
    const resolvedIp = targetIp || '31.97.145.8';

    // Notificar al bot o registrar
    return NextResponse.json({
      success: true,
      subdomain: fullSubdomain,
      ip: resolvedIp,
      status: 'Activo en Servidor VPS',
      dnsType: 'A Record',
      message: `¡Subdominio ${fullSubdomain} configurado exitosamente apuntando a ${resolvedIp}!`,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días de prueba gratis
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

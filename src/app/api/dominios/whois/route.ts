import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns/promises';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawDomain = searchParams.get('domain') || searchParams.get('q') || '';

    if (!rawDomain.trim()) {
      return NextResponse.json({ error: 'Por favor ingresa un nombre de dominio para consultar (ej: google.com)' }, { status: 400 });
    }

    const cleanDomain = rawDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');

    let aRecords: string[] = [];
    let mxRecords: any[] = [];
    let txtRecords: string[][] = [];
    let nsRecords: string[] = [];

    try {
      aRecords = await dns.resolve4(cleanDomain);
    } catch (e) {
      aRecords = [];
    }

    try {
      mxRecords = await dns.resolveMx(cleanDomain);
    } catch (e) {
      mxRecords = [];
    }

    try {
      txtRecords = await dns.resolveTxt(cleanDomain);
    } catch (e) {
      txtRecords = [];
    }

    try {
      nsRecords = await dns.resolveNs(cleanDomain);
    } catch (e) {
      nsRecords = [];
    }

    return NextResponse.json({
      domain: cleanDomain,
      aRecords,
      mxRecords: mxRecords.map(m => ({ exchange: m.exchange, priority: m.priority })),
      txtRecords: txtRecords.flat(),
      nsRecords,
      queryTime: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error en /api/dominios/whois:', error);
    return NextResponse.json(
      { error: 'No se pudieron consultar los registros DNS del dominio', details: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { namecheapClient, SUPPORTED_TLDS, DomainCheckResult } from '@/lib/namecheap';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawQuery = searchParams.get('domain') || searchParams.get('q') || '';

    if (!rawQuery.trim()) {
      return NextResponse.json(
        { error: 'Por favor ingresa un nombre de dominio para consultar (ej: miempresa.com o miempresa)' },
        { status: 400 }
      );
    }

    // Limpiar entrada
    const cleanInput = rawQuery.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
    // Identificar si trae extensión o si debemos consultar extensiones múltiples
    let baseName = cleanInput;
    let extension = '';
    
    if (cleanInput.includes('.')) {
      const parts = cleanInput.split('.');
      extension = parts.pop() || '';
      baseName = parts.join('.');
    }

    // Preparar lista de dominios a consultar en Namecheap
    const domainsToCheck: string[] = [];

    if (extension && SUPPORTED_TLDS.includes(extension)) {
      // 1. Dominio exacto solicitado
      domainsToCheck.push(`${baseName}.${extension}`);
    } else if (extension) {
      domainsToCheck.push(`${baseName}.${extension}`);
    } else {
      // 2. Si no especificó extensión, buscar con .com primero
      domainsToCheck.push(`${baseName}.com`);
    }

    // Agregar otras extensiones populares para sugerir al cliente
    const popularExtensions = ['com', 'co', 'online', 'tech', 'net', 'store'];
    for (const ext of popularExtensions) {
      const fullDomain = `${baseName}.${ext}`;
      if (!domainsToCheck.includes(fullDomain)) {
        domainsToCheck.push(fullDomain);
      }
    }

    // Invocación a la API de Namecheap
    const results: DomainCheckResult[] = await namecheapClient.checkDomains(domainsToCheck);

    // Separar el resultado principal de las sugerencias
    const primaryResult = results[0];
    const suggestions = results.slice(1);

    return NextResponse.json({
      query: cleanInput,
      baseName,
      primaryResult,
      suggestions,
      totalChecked: results.length,
      fromSandbox: process.env.NAMECHEAP_USE_SANDBOX !== 'false'
    });
  } catch (error: any) {
    console.error('Error en /api/dominios/check:', error);
    return NextResponse.json(
      { error: 'Error al consultar la disponibilidad con la API de Namecheap', details: error.message },
      { status: 500 }
    );
  }
}

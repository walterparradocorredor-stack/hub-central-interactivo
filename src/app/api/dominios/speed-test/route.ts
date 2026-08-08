import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url') || searchParams.get('q') || '';

    if (!url.trim()) {
      return NextResponse.json({ error: 'Proporciona una URL o dominio para auditar' }, { status: 400 });
    }

    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    const startTime = Date.now();
    let isHttps = targetUrl.startsWith('https://');
    let statusCode = 0;
    let responseTimeMs = 0;
    let statusText = '';
    let success = false;

    try {
      const res = await fetch(targetUrl, {
        method: 'GET',
        headers: { 'User-Agent': 'WO-Ecosystem-SpeedAuditor/1.0' },
        next: { revalidate: 0 }
      });
      responseTimeMs = Date.now() - startTime;
      statusCode = res.status;
      statusText = res.statusText;
      success = res.ok;
    } catch (err: any) {
      responseTimeMs = Date.now() - startTime;
      success = false;
      statusText = err.message || 'Error de conexión';
    }

    // Calificar velocidad
    let speedRating = 'Excelente';
    let speedScore = 95;
    if (responseTimeMs > 1000) {
      speedRating = 'Lenta';
      speedScore = 45;
    } else if (responseTimeMs > 500) {
      speedRating = 'Aceptable';
      speedScore = 75;
    }

    return NextResponse.json({
      url: targetUrl,
      isHttps,
      statusCode,
      statusText,
      responseTimeMs,
      speedRating,
      speedScore,
      recommendation: responseTimeMs > 400 
        ? 'Tu sitio cargaría hasta 3x más rápido migrando a la Infraestructura Cloud VPS de WP Ecosystem.'
        : 'Tu sitio tiene un excelente tiempo de respuesta.',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

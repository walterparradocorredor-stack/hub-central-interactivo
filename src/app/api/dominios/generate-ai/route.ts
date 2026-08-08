import { NextRequest, NextResponse } from 'next/server';
import { generateAIDomains } from '@/lib/aiDomainGenerator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idea } = body;

    if (!idea || !idea.trim()) {
      return NextResponse.json({ error: 'Por favor describe la idea de tu negocio' }, { status: 400 });
    }

    const suggestions = await generateAIDomains(idea.trim());

    return NextResponse.json({
      idea: idea.trim(),
      suggestions,
      totalGenerated: suggestions.length
    });
  } catch (error: any) {
    console.error('Error en /api/dominios/generate-ai:', error);
    return NextResponse.json(
      { error: 'Error al generar dominios con la IA', details: error.message },
      { status: 500 }
    );
  }
}

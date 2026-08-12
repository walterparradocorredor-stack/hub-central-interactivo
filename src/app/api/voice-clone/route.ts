import { NextRequest, NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Voces masculinas en español disponibles en Edge-TTS. La voz oficial del
// Dr. Walther Parrado es es-CO-GonzaloNeural (colombiano); es-ES-AlvaroNeural
// queda como alternativa si alguna vez hace falta variar el acento.
const MALE_SPANISH_VOICES = ['es-CO-GonzaloNeural', 'es-ES-AlvaroNeural', 'es-MX-JorgeNeural'];
const DEFAULT_VOICE = 'es-CO-GonzaloNeural';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, text, seminarId, targetVoice } = body;

    if (action !== 'synthesize_podcast') {
      return NextResponse.json({ error: 'Acción no soportada' }, { status: 400 });
    }
    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Texto requerido' }, { status: 400 });
    }

    const voice = MALE_SPANISH_VOICES.includes(targetVoice) ? targetVoice : DEFAULT_VOICE;

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(text.toString().substring(0, 3000));

    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk as Buffer);
    }
    const audioBuffer = Buffer.concat(chunks);

    const safeId = (seminarId || 'audio').toString().replace(/[^a-zA-Z0-9-_]/g, '');
    const fileName = `blog-audio/${safeId}-${Date.now()}.mp3`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('walther-assets')
      .upload(fileName, audioBuffer, { contentType: 'audio/mpeg', upsert: true });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // getPublicUrl() arma la URL con la base interna (SUPABASE_INTERNAL_URL,
    // http://supabase-kong:8000), inútil para el navegador. La reconstruimos
    // con la base pública real del proxy (vive en walther-parrado).
    const publicBase = 'https://waltherparrado.com/supabase-api';
    const audioUrl = `${publicBase}/storage/v1/object/public/walther-assets/${fileName}`;

    return NextResponse.json({ audioUrl, voice });
  } catch (err: any) {
    console.error('Error en /api/voice-clone:', err);
    return NextResponse.json({ error: err.message || 'Error al sintetizar audio' }, { status: 500 });
  }
}

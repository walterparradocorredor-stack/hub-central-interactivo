import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const { fullName, email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    const message = `👤 *NUEVO REGISTRO EN WP ECOSYSTEM*\n\n` +
      `📌 *Nombre:* ${fullName || 'No especificado'}\n` +
      `✉️ *Correo:* ${email}\n` +
      `⏰ *Fecha:* ${new Date().toLocaleString('es-CO')}\n` +
      `🌐 *Plataforma:* Hub Central Interactivo (/dominios)`;

    await sendTelegramNotification(message);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error al notificar registro por Telegram:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

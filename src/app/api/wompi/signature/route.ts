import { NextRequest, NextResponse } from 'next/server';
import { wompiService } from '@/lib/wompi';
import { sendTelegramNotification } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceTitle, amountInCop, domain } = body;

    if (!amountInCop || amountInCop <= 0) {
      return NextResponse.json({ error: 'El monto en COP es requerido' }, { status: 400 });
    }

    const checkoutData = wompiService.createCheckoutSession(
      serviceTitle || 'Servicio Web',
      amountInCop
    );

    // Notificar al administrador por Telegram sobre la intención de compra
    await sendTelegramNotification(
      `🛒 <b>NUEVA INTENCIÓN DE COMPRA WOMPI</b>\n\n` +
      `<b>Servicio:</b> ${serviceTitle || 'Dominio/Hosting'}\n` +
      `<b>Dominio Target:</b> ${domain || 'N/A'}\n` +
      `<b>Monto:</b> $${amountInCop.toLocaleString('es-CO')} COP\n` +
      `<b>Referencia:</b> <code>${checkoutData.reference}</code>\n` +
      `<b>Fecha:</b> ${new Date().toLocaleString('es-CO')}`
    );

    return NextResponse.json({
      success: true,
      checkout: checkoutData
    });
  } catch (error: any) {
    console.error('Error en /api/wompi/signature:', error);
    return NextResponse.json(
      { error: 'Error al generar la firma de Wompi', details: error.message },
      { status: 500 }
    );
  }
}

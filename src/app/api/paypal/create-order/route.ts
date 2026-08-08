import { NextRequest, NextResponse } from 'next/server';
import { paypalService } from '@/lib/paypal';
import { sendTelegramNotification } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domainOrService, amountUsd } = body;

    if (!amountUsd || amountUsd <= 0) {
      return NextResponse.json({ error: 'Monto en USD inválido' }, { status: 400 });
    }

    const orderResult = await paypalService.createOrder(
      domainOrService || 'Dominio',
      amountUsd
    );

    if (orderResult.success) {
      await sendTelegramNotification(
        `💵 *INTENCIÓN DE COMPRA EN DÓLARES (PAYPAL)*\n\n` +
        `🌐 *Servicio:* ${domainOrService}\n` +
        `💰 *Monto:* $${amountUsd.toFixed(2)} USD\n` +
        `🆔 *Orden PayPal:* <code>${orderResult.orderId}</code>\n` +
        `⏰ *Fecha:* ${new Date().toLocaleString('es-CO')}`
      );

      return NextResponse.json({
        success: true,
        orderId: orderResult.orderId,
        approveUrl: orderResult.approveUrl
      });
    }

    return NextResponse.json({ error: orderResult.error || 'Error al procesar orden en PayPal' }, { status: 500 });
  } catch (error: any) {
    console.error('Error en /api/paypal/create-order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

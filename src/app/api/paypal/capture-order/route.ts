import { NextRequest, NextResponse } from 'next/server';
import { paypalService } from '@/lib/paypal';
import { namecheapClient } from '@/lib/namecheap';
import { sendTelegramNotification } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, domainName } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID de PayPal es requerido' }, { status: 400 });
    }

    const captureResult = await paypalService.captureOrder(orderId);
    if (!captureResult.success) {
      return NextResponse.json({ error: captureResult.error }, { status: 400 });
    }

    let registrationResult = 'ℹ️ Registro manual o pendiente';

    // Si viene un dominio explícito, intentar registro inmediato en Namecheap
    if (domainName && domainName.includes('.')) {
      const regResponse = await namecheapClient.registerDomain(domainName, {
        firstName: 'Jose',
        lastName: 'Corredor',
        address: 'Calle 100 # 15-20',
        city: 'Bogota',
        state: 'Cundinamarca',
        zip: '110111',
        country: 'CO',
        phone: '+57.3017640850',
        email: captureResult.payerEmail || 'walter.parrado.corredor@gmail.com'
      });

      if (regResponse.success) {
        registrationResult = `✅ *Dominio Registrado Exitosamente en Namecheap* (Orden: ${regResponse.orderId})`;
      } else {
        registrationResult = `⚠️ *Error en Namecheap:* ${regResponse.error || 'Requiere registro manual'}`;
      }
    }

    const balanceInfo = await namecheapClient.getBalances();
    const balanceText = balanceInfo ? `$${balanceInfo.availableBalance.toFixed(2)} USD` : 'No disponible';

    // Notificar al Supergrupo de Telegram
    const alertMessage = `💵 *¡PAGO INTERNACIONAL CONFIRMADO VÍA PAYPAL (USD)!*\n\n` +
      `🌐 *Dominio / Servicio:* ${domainName || 'Registro de Dominio'}\n` +
      `📌 *Estado PayPal:* ${captureResult.status}\n` +
      `🆔 *ID Transacción:* ${captureResult.transactionId}\n` +
      `👤 *Email Pagador:* ${captureResult.payerEmail}\n` +
      `⚙️ *Registro Auto Namecheap:* ${registrationResult}\n` +
      `💵 *Saldo Namecheap Disponible:* ${balanceText}\n` +
      `⏰ *Fecha:* ${new Date().toLocaleString('es-CO')}`;

    await sendTelegramNotification(alertMessage);

    return NextResponse.json({
      success: true,
      transactionId: captureResult.transactionId,
      payerEmail: captureResult.payerEmail,
      registrationResult
    });
  } catch (error: any) {
    console.error('Error en /api/paypal/capture-order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

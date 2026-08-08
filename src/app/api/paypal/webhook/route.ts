import { NextRequest, NextResponse } from 'next/server';
import { namecheapClient } from '@/lib/namecheap';
import { sendTelegramNotification } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = body?.event_type;
    const resource = body?.resource;

    if (!eventType || !resource) {
      return NextResponse.json({ status: 'ignored', reason: 'Payload incompleto' }, { status: 200 });
    }

    // Procesar evento de pago completado (PAYMENT.CAPTURE.COMPLETED o CHECKOUT.ORDER.APPROVED)
    if (eventType === 'PAYMENT.CAPTURE.COMPLETED' || eventType === 'CHECKOUT.ORDER.APPROVED') {
      const transactionId = resource?.id || resource?.supplementary_data?.related_ids?.order_id;
      const amountUsd = resource?.amount?.value || resource?.purchase_units?.[0]?.amount?.value || 'N/A';
      const payerEmail = resource?.payer?.email_address || body?.summary || 'No especificado';
      const customId = resource?.custom_id || resource?.purchase_units?.[0]?.reference_id || '';

      let domainName = '';
      if (customId && customId.includes('DOM_')) {
        const parts = customId.split('_');
        if (parts.length >= 2) {
          domainName = parts[1].replace(/-/g, '.');
        }
      }

      let registrationResult = 'ℹ️ Registro pendiente o manual';

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
          email: payerEmail || 'walter.parrado.corredor@gmail.com'
        });

        if (regResponse.success) {
          registrationResult = `✅ *Dominio Registrado Exitosamente en Namecheap* (Orden: ${regResponse.orderId})`;
        } else {
          registrationResult = `⚠️ *Error Namecheap:* ${regResponse.error || 'Requiere registro manual'}`;
        }
      }

      const balanceInfo = await namecheapClient.getBalances();
      const balanceText = balanceInfo ? `$${balanceInfo.availableBalance.toFixed(2)} USD` : 'No disponible';

      const alertMessage = `💵 *¡PAGO CONFIRMADO VÍA PAYPAL WEBHOOK (USD)!*\n\n` +
        `🌐 *Dominio / Servicio:* ${domainName || customId || 'Registro de Dominio'}\n` +
        `📌 *Evento:* ${eventType}\n` +
        `🆔 *ID Transacción:* ${transactionId}\n` +
        `💰 *Monto Recibido:* $${amountUsd} USD\n` +
        `👤 *Pagador:* ${payerEmail}\n` +
        `⚙️ *Registro Auto Namecheap:* ${registrationResult}\n` +
        `💵 *Saldo Namecheap Disponible:* ${balanceText}\n` +
        `⏰ *Fecha:* ${new Date().toLocaleString('es-CO')}`;

      await sendTelegramNotification(alertMessage);
    }

    return NextResponse.json({ status: 'received', eventType });
  } catch (error: any) {
    console.error('Error procesando Webhook de PayPal:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/notifications';
import { namecheapClient } from '@/lib/namecheap';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventData = body?.data?.transaction;

    if (!eventData) {
      return NextResponse.json({ status: 'ignored', reason: 'Payload incompleto' }, { status: 200 });
    }

    const { id, reference, amount_in_cents, status, payment_method_type, customer_email, customer_data } = eventData;
    const amountInCop = Math.round(amount_in_cents / 100);

    // Extraer dominio si viene codificado en la referencia (ej: DOM_zetugc-com_1785697422)
    let domainName = '';
    if (reference && reference.includes('DOM_')) {
      const parts = reference.split('_');
      if (parts.length >= 2) {
        domainName = parts[1].replace(/-/g, '.');
      }
    }

    let registrationResult = 'ℹ️ Registro pendiente (comprobar en panel)';
    
    // Si viene un dominio explícito y el pago está APROBADO, intentar registro en Namecheap
    if (status === 'APPROVED' && domainName && domainName.includes('.')) {
      const regResponse = await namecheapClient.registerDomain(domainName, {
        firstName: customer_data?.full_name?.split(' ')[0] || 'Jose',
        lastName: customer_data?.full_name?.split(' ').slice(1).join(' ') || 'Corredor',
        address: 'Calle 100 # 15-20',
        city: 'Bogota',
        state: 'Cundinamarca',
        zip: '110111',
        country: 'CO',
        phone: customer_data?.phone_number || '+57.3017640850',
        email: customer_email || 'walter.parrado.corredor@gmail.com'
      });

      if (regResponse.success) {
        registrationResult = `✅ *Dominio Registrado con Éxito en Namecheap* (Orden: ${regResponse.orderId})`;
      } else {
        registrationResult = `⚠️ *Error al registrar en Namecheap:* ${regResponse.error || 'Requiere registro manual'}`;
      }
    }

    // Obtener saldo actualizado de Namecheap
    const balanceInfo = await namecheapClient.getBalances();
    const balanceText = balanceInfo 
      ? `$${balanceInfo.availableBalance.toFixed(2)} ${balanceInfo.currency}`
      : 'No disponible';

    // Notificar al Supergrupo de Telegram (Dominios WP Ecosistem)
    const alertMessage = `💳 *¡PAGO CONFIRMADO EN WOMPI!*\n\n` +
      `🌐 *Dominio / Servicio:* ${domainName || reference || 'Registro de Dominio'}\n` +
      `📌 *Estado Transacción:* ${status}\n` +
      `🆔 *ID Wompi:* ${id}\n` +
      `🔢 *Referencia:* ${reference}\n` +
      `💰 *Monto Recibido:* $${amountInCop.toLocaleString('es-CO')} COP\n` +
      `💳 *Método de Pago:* ${payment_method_type}\n` +
      `👤 *Email Cliente:* ${customer_email || 'No proporcionado'}\n` +
      `⚙️ *Registro Auto:* ${registrationResult}\n` +
      `💵 *Saldo Namecheap Disponible:* ${balanceText}\n` +
      `⏰ *Fecha:* ${new Date().toLocaleString('es-CO')}`;

    await sendTelegramNotification(alertMessage);

    return NextResponse.json({ status: 'received', transactionId: id, reference, domainName, registrationResult });
  } catch (error: any) {
    console.error('Error procesando Webhook de Wompi:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

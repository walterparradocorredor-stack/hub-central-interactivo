import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { wompiService } from '@/lib/wompi';
import { sendTelegramNotification } from '@/lib/notifications';
import { namecheapClient } from '@/lib/namecheap';
import { cloudflareClient, DEFAULT_TARGET_IP } from '@/lib/cloudflare';
import { recordDomainPurchase } from '@/lib/supabaseAdmin';

// Cliente con service_role: bypassa RLS de forma segura porque este endpoint
// ya verifica el checksum de Wompi antes de escribir nada.
function getServiceClient() {
  const url = process.env.SUPABASE_INTERNAL_URL || 'http://supabase-kong:8000';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(url, serviceKey);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verificación de firma: rechaza cualquier webhook que no venga
    // realmente de Wompi (evita ventas/domino falsos inyectados por terceros).
    if (!wompiService.verifyEventSignature(body)) {
      console.error('Webhook de Wompi rechazado: firma inválida o WOMPI_EVENTS_SECRET ausente.');
      return NextResponse.json({ status: 'rejected', reason: 'Firma inválida' }, { status: 401 });
    }

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

    // Registrar la transacción en Supabase (fuente de verdad para el Command Center)
    if (status === 'APPROVED') {
      const supabaseAdmin = getServiceClient();
      const { error: insertError } = await supabaseAdmin.from('purchases').insert({
        email: customer_email || null,
        item_id: domainName || reference,
        item_type: 'domain',
        amount: amountInCop,
        currency: 'COP',
        payment_method: payment_method_type || 'wompi',
        transaction_id: id,
        status: 'approved',
      });
      if (insertError) {
        console.error('Error registrando compra en Supabase:', insertError.message);
      }
    }

    let registrationResult = 'ℹ️ Registro pendiente (comprobar en panel)';
    let dnsResult = 'ℹ️ N/A';

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

        const provision = await cloudflareClient.provisionPurchasedDomain(domainName, DEFAULT_TARGET_IP);
        let dnsConnected = false;
        if (provision.success && provision.nameServers?.length) {
          const nsResult = await namecheapClient.setCustomNameservers(domainName, provision.nameServers);
          dnsConnected = nsResult.success;
          dnsResult = nsResult.success
            ? `✅ *DNS conectado a Cloudflare* (NS: ${provision.nameServers.join(', ')})`
            : `⚠️ *Zona creada en Cloudflare pero falló apuntar nameservers:* ${nsResult.error}`;
        } else {
          dnsResult = `⚠️ *Error creando zona DNS en Cloudflare:* ${provision.error || 'Desconocido'}`;
        }

        await recordDomainPurchase({
          buyerEmail: customer_email,
          domainName,
          registrarOrderId: regResponse.orderId,
          paymentMethod: 'wompi',
          transactionId: String(id),
          amount: amountInCop,
          currency: 'COP',
          cloudflareZoneId: provision.zoneId,
          nameServers: provision.nameServers,
          dnsConnected
        });
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
      `🌐 *DNS / Cloudflare:* ${dnsResult}\n` +
      `💵 *Saldo Namecheap Disponible:* ${balanceText}\n` +
      `⏰ *Fecha:* ${new Date().toLocaleString('es-CO')}`;

    await sendTelegramNotification(alertMessage);

    return NextResponse.json({ status: 'received', transactionId: id, reference, domainName, registrationResult, dnsResult });
  } catch (error: any) {
    console.error('Error procesando Webhook de Wompi:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

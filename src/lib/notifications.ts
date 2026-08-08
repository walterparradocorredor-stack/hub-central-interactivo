/**
 * Servicio de Notificaciones por Telegram Bot & Webhooks de J&M / Walther Parrado
 */
export async function sendTelegramNotification(message: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '8985776455:AAHhgRFVgBdUIrLRvvoVJZLnQNMjAMWgYWA';
  const chatId = process.env.TELEGRAM_CHAT_ID || '-1003705996978';

  if (!botToken || botToken.includes('placeholder')) {
    console.log('[Notificación Telegram Simulada]:', message);
    return true;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    return res.ok;
  } catch (err) {
    console.error('Error al enviar notificación por Telegram:', err);
    return false;
  }
}

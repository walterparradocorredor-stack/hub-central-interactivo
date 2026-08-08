export interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{ href: string; rel: string; method: string }>;
}

export class PayPalService {
  private getCredentials() {
    const clientId = process.env.PAYPAL_CLIENT_ID || 'BAAcHjnFgGVSas9sP429fGkxSHmA0v7wej_nvobstIvmcMAnCZ5-fpIsfKTs93_5X9dmuDbdo-ZfcqZ7jA';
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'EI0nUymd3dze9ycZ8_CR-LuWjiBlKfeRUrD7qzOjlyH5XvUW_7k2Gt2SPf2wROjyMB8Yvbbtf_p6fAV7';
    const mode = process.env.PAYPAL_MODE || 'live';
    const baseUrl = mode === 'sandbox'
      ? 'https://api-m.sandbox.paypal.com'
      : 'https://api-m.paypal.com';

    return { clientId, clientSecret, baseUrl };
  }

  /**
   * Obtiene Token de acceso OAuth2 de PayPal
   */
  async getAccessToken(): Promise<string | null> {
    const { clientId, clientSecret, baseUrl } = this.getCredentials();
    if (!clientId || !clientSecret) return null;

    try {
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        console.error('Error obteniendo token PayPal:', await response.text());
        return null;
      }

      const data = await response.json();
      return data.access_token || null;
    } catch (err) {
      console.error('Error en PayPal getAccessToken:', err);
      return null;
    }
  }

  /**
   * Crea una orden de pago en Dólares USD en PayPal
   */
  async createOrder(domainOrService: string, amountUsd: number, referenceId?: string): Promise<{ success: boolean; orderId?: string; approveUrl?: string; error?: string }> {
    const { baseUrl } = this.getCredentials();
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      return { success: false, error: 'No se pudo autenticar con PayPal' };
    }

    try {
      const payload = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: referenceId || `DOM_${domainOrService.replace(/[^a-zA-Z0-9]/g, '-')}_${Date.now()}`,
            description: `Registro / Servicio: ${domainOrService}`,
            amount: {
              currency_code: 'USD',
              value: amountUsd.toFixed(2)
            }
          }
        ],
        application_context: {
          brand_name: 'WP Ecosystem Dominios',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: 'https://hub.waltherparrado.com/panel/dominios?paypal=success',
          cancel_url: 'https://hub.waltherparrado.com/dominios?paypal=cancel'
        }
      };

      const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data: PayPalOrderResponse = await response.json();
      if (response.ok && data.id) {
        const approveLink = data.links.find((l) => l.rel === 'approve')?.href;
        return {
          success: true,
          orderId: data.id,
          approveUrl: approveLink
        };
      }

      return { success: false, error: 'Error al crear la orden de PayPal' };
    } catch (err: any) {
      console.error('Error al crear orden en PayPal:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Captura el pago aprobado de una orden en PayPal
   */
  async captureOrder(orderId: string): Promise<{ success: boolean; transactionId?: string; status?: string; payerEmail?: string; error?: string }> {
    const { baseUrl } = this.getCredentials();
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      return { success: false, error: 'No se pudo autenticar con PayPal' };
    }

    try {
      const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.status === 'COMPLETED') {
        const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
        return {
          success: true,
          transactionId: capture?.id || data.id,
          status: data.status,
          payerEmail: data.payer?.email_address || 'No especificado'
        };
      }

      return { success: false, error: data.message || 'La transacción no fue completada' };
    } catch (err: any) {
      console.error('Error al capturar orden en PayPal:', err);
      return { success: false, error: err.message };
    }
  }
}

export const paypalService = new PayPalService();

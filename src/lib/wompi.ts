import crypto from 'crypto';

export interface WompiCheckoutData {
  reference: string;
  amountInCents: number;
  currency: string;
  publicKey: string;
  signature: string;
  redirectUrl: string;
  directWompiLink?: string;
  customerData?: {
    email?: string;
    fullName?: string;
    phoneNumber?: string;
  };
}

// Links de Pago de Producción Wompi (Don Walther Parrado) parametrizados por variables de entorno
export const getWompiDirectLinks = (): Record<string, string> => ({
  'DOM-COM-01': process.env.NEXT_PUBLIC_WOMPI_LINK_DOM_COM || 'https://checkout.wompi.co/l/wusjSO',
  'SSL-VPS-01': process.env.NEXT_PUBLIC_WOMPI_LINK_SSL_VPS || 'https://checkout.wompi.co/l/x9OaDV',
  'GENERIC': process.env.NEXT_PUBLIC_WOMPI_LINK_GENERIC || 'https://checkout.wompi.co/l/VPOS_MtK6nj'
});

export const WOMPI_DIRECT_LINKS = getWompiDirectLinks();

// Lee un valor u obtiene un objeto anidado por ruta de puntos (ej: "transaction.id")
function getByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

export class WompiService {
  private publicKey: string;
  private integritySecret: string;
  private eventsSecret: string;

  constructor() {
    // Sin fallback hardcodeado: si la variable de entorno falta, se debe
    // fallar de forma visible en vez de firmar con una llave equivocada.
    this.publicKey = process.env.WOMPI_PUBLIC_KEY || '';
    this.integritySecret = process.env.WOMPI_INTEGRITY_SECRET || '';
    this.eventsSecret = process.env.WOMPI_EVENTS_SECRET || '';

    if (!this.publicKey || !this.integritySecret) {
      console.error(
        '⚠️ WOMPI_PUBLIC_KEY o WOMPI_INTEGRITY_SECRET no están configuradas en el entorno. ' +
        'Los checkouts generados fallarán la verificación de Wompi.'
      );
    }
  }

  /**
   * Genera la firma SHA-256 de integridad para Wompi
   */
  generateIntegritySignature(reference: string, amountInCop: number, currency: string = 'COP'): string {
    const amountInCents = Math.round(amountInCop * 100);
    const concatenatedString = `${reference}${amountInCents}${currency}${this.integritySecret}`;

    return crypto.createHash('sha256').update(concatenatedString).digest('hex');
  }

  /**
   * Verifica la firma (checksum) de un evento webhook entrante de Wompi.
   * https://docs.wompi.co/docs/colombia/eventos/
   */
  verifyEventSignature(payload: any): boolean {
    if (!this.eventsSecret) {
      console.error('⚠️ WOMPI_EVENTS_SECRET no configurada: no se puede verificar el webhook.');
      return false;
    }

    const properties: string[] = payload?.signature?.properties || [];
    const receivedChecksum: string = payload?.signature?.checksum || '';
    const timestamp = payload?.timestamp;

    if (!properties.length || !receivedChecksum || !timestamp) return false;

    const concatenatedValues = properties
      .map((prop) => getByPath(payload.data, prop))
      .join('');

    const toHash = `${concatenatedValues}${timestamp}${this.eventsSecret}`;
    const computedChecksum = crypto.createHash('sha256').update(toHash).digest('hex');

    return computedChecksum.toUpperCase() === receivedChecksum.toUpperCase();
  }

  /**
   * Construye la sesión de checkout o retorna el enlace directo de producción
   */
  createCheckoutSession(
    serviceTitle: string,
    amountInCop: number,
    redirectUrl?: string,
    sku?: string
  ): WompiCheckoutData {
    const reference = `DOM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const amountInCents = Math.round(amountInCop * 100);
    const currency = 'COP';
    const signature = this.generateIntegritySignature(reference, amountInCop, currency);
    const links = getWompiDirectLinks();
    const directWompiLink = sku && links[sku] ? links[sku] : links['GENERIC'];

    return {
      reference,
      amountInCents,
      currency,
      publicKey: this.publicKey,
      signature,
      redirectUrl: redirectUrl || 'https://hub.waltherparrado.com/panel/dominios?status=success',
      directWompiLink
    };
  }
}

export const wompiService = new WompiService();

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

export class WompiService {
  private publicKey: string;
  private integritySecret: string;

  constructor() {
    this.publicKey = process.env.WOMPI_PUBLIC_KEY || '';
    this.integritySecret = process.env.WOMPI_INTEGRITY_SECRET || '';
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

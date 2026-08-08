import { XMLParser } from 'fast-xml-parser';

export interface DomainCheckResult {
  domain: string;
  tld: string;
  available: boolean;
  isPremium: boolean;
  priceUsd: number;
  priceCop: number;
  currency: string;
}

export interface DomainSearchResponse {
  query: string;
  results: DomainCheckResult[];
  fromSandbox: boolean;
  error?: string;
}

export interface NamecheapBalance {
  availableBalance: number;
  accountBalance: number;
  earnedAmount: number;
  currency: string;
}

export interface RegistrantContact {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string; // p. ej. 'CO'
  phone: string;  // p. ej. '+57.3001234567'
  email: string;
}

// Tasas y precios de referencia por TLD en USD y conversión aproximada a COP (Margen comercial incluido)
export const TLD_PRICING: Record<string, { usd: number; cop: number; popular?: boolean; label?: string }> = {
  com: { usd: 11.46, cop: 49900, popular: true, label: 'El estándar mundial' },
  co: { usd: 11.98, cop: 54900, popular: true, label: 'Ideal para Colombia y Negocios' },
  online: { usd: 0.98, cop: 14900, popular: true, label: 'Oferta Especial' },
  tech: { usd: 9.99, cop: 18900, popular: true, label: 'Para tecnología y Startups' },
  store: { usd: 2.98, cop: 14900, label: 'Tiendas en línea y E-commerce' },
  site: { usd: 2.48, cop: 12900, label: 'Sitios web modernos' },
  net: { usd: 12.98, cop: 59900, label: 'Redes e Infraestructura' },
  org: { usd: 8.48, cop: 64900, label: 'Organizaciones y Fundaciones' },
  io: { usd: 34.98, cop: 149900, label: 'Desarrolladores y Tech Enterprise' },
  ai: { usd: 79.98, cop: 299900, label: 'Inteligencia Artificial' }
};

export const SUPPORTED_TLDS = Object.keys(TLD_PRICING);

export class NamecheapClient {
  private apiUser: string;
  private apiKey: string;
  private userName: string;
  private clientIp: string;
  private baseUrl: string;
  private useSandbox: boolean;

  constructor() {
    this.apiUser = process.env.NAMECHEAP_API_USER || 'Walpaco';
    this.apiKey = process.env.NAMECHEAP_API_KEY || 'addefe7ecc7f4f3b8d28e74cc71241d9';
    this.userName = process.env.NAMECHEAP_USERNAME || this.apiUser;
    this.clientIp = process.env.NAMECHEAP_CLIENT_IP || '31.97.145.8';
    this.useSandbox = process.env.NAMECHEAP_USE_SANDBOX === 'true';

    this.baseUrl = this.useSandbox
      ? 'https://api.sandbox.namecheap.com/xml.response'
      : 'https://api.namecheap.com/xml.response';
  }

  /**
   * Consulta el saldo disponible en Namecheap
   */
  async getBalances(): Promise<NamecheapBalance | null> {
    if (!this.apiKey) return null;

    try {
      const params = new URLSearchParams({
        ApiUser: this.apiUser,
        ApiKey: this.apiKey,
        UserName: this.userName,
        ClientIp: this.clientIp,
        Command: 'namecheap.users.getBalances'
      });

      const response = await fetch(`${this.baseUrl}?${params.toString()}`, { method: 'GET' });
      if (!response.ok) return null;

      const xmlText = await response.text();
      const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
      const parsed = parser.parse(xmlText);
      const result = parsed?.ApiResponse?.CommandResponse?.UserGetBalancesResult;

      if (result) {
        return {
          availableBalance: parseFloat(result['@_AvailableBalance'] || '0'),
          accountBalance: parseFloat(result['@_AccountBalance'] || '0'),
          earnedAmount: parseFloat(result['@_EarnedAmount'] || '0'),
          currency: result['@_Currency'] || 'USD'
        };
      }
      return null;
    } catch (err) {
      console.error('Error al consultar saldo en Namecheap:', err);
      return null;
    }
  }

  /**
   * Registra oficialmente un dominio en Namecheap descontando del saldo de la cuenta
   */
  async registerDomain(domainName: string, contact: RegistrantContact, years: number = 1): Promise<{ success: boolean; orderId?: string; error?: string }> {
    if (!this.apiKey) {
      return { success: false, error: 'API Key no configurada' };
    }

    try {
      const contactParams: Record<string, string> = {};
      const contactTypes = ['Registrant', 'Tech', 'Admin', 'AuxBilling'];
      
      contactTypes.forEach((type) => {
        contactParams[`${type}FirstName`] = contact.firstName || 'Jose';
        contactParams[`${type}LastName`] = contact.lastName || 'Corredor';
        contactParams[`${type}Address1`] = contact.address || 'Calle 100 # 15-20';
        contactParams[`${type}City`] = contact.city || 'Bogota';
        contactParams[`${type}StateProvince`] = contact.state || 'Cundinamarca';
        contactParams[`${type}PostalCode`] = contact.zip || '110111';
        contactParams[`${type}Country`] = contact.country || 'CO';
        contactParams[`${type}Phone`] = contact.phone || '+57.3017640850';
        contactParams[`${type}EmailAddress`] = contact.email || 'walter.parrado.corredor@gmail.com';
      });

      const params = new URLSearchParams({
        ApiUser: this.apiUser,
        ApiKey: this.apiKey,
        UserName: this.userName,
        ClientIp: this.clientIp,
        Command: 'namecheap.domains.create',
        DomainName: domainName,
        Years: years.toString(),
        ...contactParams
      });

      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const xmlText = await response.text();
      const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
      const parsed = parser.parse(xmlText);
      
      const createResult = parsed?.ApiResponse?.CommandResponse?.DomainCreateResult;
      const isRegistered = createResult?.['@_Registered'] === 'true' || createResult?.['@_Registered'] === true;

      if (isRegistered) {
        return {
          success: true,
          orderId: createResult?.['@_OrderID'] || createResult?.['@_TransactionID'] || 'NC-' + Date.now()
        };
      }

      const errors = parsed?.ApiResponse?.Errors?.Error;
      const errorMsg = Array.isArray(errors) ? errors.map(e => e['#text'] || e).join(', ') : (errors?.['#text'] || errors || 'Error desconocido al registrar en Namecheap');

      return { success: false, error: errorMsg };
    } catch (err: any) {
      console.error('Error al registrar dominio en Namecheap:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Consulta la disponibilidad de un dominio o una lista de dominios en Namecheap
   */
  async checkDomains(domainNames: string[]): Promise<DomainCheckResult[]> {
    if (!this.apiKey) {
      return this.generateFallbackResults(domainNames);
    }

    try {
      const params = new URLSearchParams({
        ApiUser: this.apiUser,
        ApiKey: this.apiKey,
        UserName: this.userName,
        ClientIp: this.clientIp,
        Command: 'namecheap.domains.check',
        DomainList: domainNames.join(',')
      });

      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/xml'
        },
        next: { revalidate: 60 }
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const xmlText = await response.text();
      return this.parseCheckResponse(xmlText, domainNames);
    } catch (error) {
      console.warn('Namecheap API request warning (Usando fallback local):', error);
      return this.generateFallbackResults(domainNames);
    }
  }

  private parseCheckResponse(xmlContent: string, originalDomains: string[]): DomainCheckResult[] {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });

    try {
      const parsed = parser.parse(xmlContent);
      const commandResponse = parsed?.ApiResponse?.CommandResponse;
      const domainCheckResults = commandResponse?.DomainCheckResult;

      if (!domainCheckResults) {
        return this.generateFallbackResults(originalDomains);
      }

      const resultsArray = Array.isArray(domainCheckResults)
        ? domainCheckResults
        : [domainCheckResults];

      return resultsArray.map((item: any) => {
        const domain = item['@_Domain'] || '';
        const available = item['@_Available'] === 'true' || item['@_Available'] === true;
        const isPremium = item['@_IsPremiumName'] === 'true' || item['@_IsPremiumName'] === true;
        const tld = domain.split('.').pop()?.toLowerCase() || 'com';
        
        const priceInfo = TLD_PRICING[tld] || { usd: 12.99, cop: 54900 };
        const priceUsd = isPremium ? parseFloat(item['@_PremiumRegistrationPrice'] || '99.99') : priceInfo.usd;
        const priceCop = isPremium ? Math.round(priceUsd * 4200) : priceInfo.cop;

        return {
          domain,
          tld,
          available,
          isPremium,
          priceUsd,
          priceCop,
          currency: 'COP'
        };
      });
    } catch (err) {
      console.error('Error al parsear XML de Namecheap:', err);
      return this.generateFallbackResults(originalDomains);
    }
  }

  private generateFallbackResults(domainNames: string[]): DomainCheckResult[] {
    return domainNames.map((domain) => {
      const tld = domain.split('.').pop()?.toLowerCase() || 'com';
      const pricing = TLD_PRICING[tld] || { usd: 12.99, cop: 54900 };
      const hash = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const available = hash % 2 === 0;

      return {
        domain,
        tld,
        available,
        isPremium: false,
        priceUsd: pricing.usd,
        priceCop: pricing.cop,
        currency: 'COP'
      };
    });
  }
}

export const namecheapClient = new NamecheapClient();

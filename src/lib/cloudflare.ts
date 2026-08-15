const CF_BASE_URL = 'https://api.cloudflare.com/client/v4';

export const DEFAULT_TARGET_IP = '31.97.145.8';

export interface CloudflareZoneResult {
  success: boolean;
  zoneId?: string;
  nameServers?: string[];
  status?: string;
  error?: string;
}

export interface CloudflareDnsRecordResult {
  success: boolean;
  recordId?: string;
  error?: string;
}

export interface DomainProvisionResult {
  success: boolean;
  zoneId?: string;
  nameServers?: string[];
  aRecordCreated?: boolean;
  error?: string;
}

export class CloudflareClient {
  private accountToken: string;
  private accountId: string;
  private zoneToken: string;
  private defaultZoneId: string;

  constructor() {
    this.accountToken = process.env.CLOUDFLARE_ACCOUNT_API_TOKEN || '';
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '';
    this.zoneToken = process.env.CLOUDFLARE_API_TOKEN || '';
    this.defaultZoneId = process.env.CLOUDFLARE_ZONE_ID || '';
  }

  /**
   * Crea una zona nueva en la cuenta de Cloudflare para un dominio recién comprado.
   * Cloudflare asigna nameservers propios de inmediato, incluso antes de que el
   * registrador (Namecheap) termine de apuntarlos.
   */
  async createZone(domain: string): Promise<CloudflareZoneResult> {
    if (!this.accountToken || !this.accountId) {
      return { success: false, error: 'CLOUDFLARE_ACCOUNT_API_TOKEN / CLOUDFLARE_ACCOUNT_ID no configurados' };
    }

    try {
      const response = await fetch(`${CF_BASE_URL}/zones`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accountToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: domain, account: { id: this.accountId }, type: 'full' })
      });

      const data = await response.json();

      if (data.success && data.result) {
        return {
          success: true,
          zoneId: data.result.id,
          nameServers: data.result.name_servers || [],
          status: data.result.status
        };
      }

      const errorMsg = data.errors?.map((e: any) => e.message).join(', ') || 'Error desconocido creando zona en Cloudflare';
      return { success: false, error: errorMsg };
    } catch (err: any) {
      console.error('Error al crear zona en Cloudflare:', err);
      return { success: false, error: err.message };
    }
  }

  private async findDnsRecord(zoneId: string, name: string, type: string): Promise<{ id: string } | null> {
    const token = this.accountToken || this.zoneToken;
    const response = await fetch(
      `${CF_BASE_URL}/zones/${zoneId}/dns_records?type=${type}&name=${encodeURIComponent(name)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await response.json();
    return data.success && data.result?.length ? data.result[0] : null;
  }

  /**
   * Crea (o reutiliza si ya existe) un registro DNS en la zona indicada.
   */
  async createDnsRecord(
    zoneId: string,
    params: { type: string; name: string; content: string; proxied?: boolean; ttl?: number; priority?: number }
  ): Promise<CloudflareDnsRecordResult> {
    const token = this.accountToken || this.zoneToken;
    if (!token) return { success: false, error: 'Cloudflare API token no configurado' };

    try {
      const existing = await this.findDnsRecord(zoneId, params.name, params.type);
      if (existing) {
        return { success: true, recordId: existing.id };
      }

      const response = await fetch(`${CF_BASE_URL}/zones/${zoneId}/dns_records`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: params.type,
          name: params.name,
          content: params.content,
          ttl: params.ttl ?? 1,
          proxied: params.proxied ?? true,
          ...(params.priority !== undefined ? { priority: params.priority } : {})
        })
      });

      const data = await response.json();
      if (data.success && data.result) {
        return { success: true, recordId: data.result.id };
      }

      const errorMsg = data.errors?.map((e: any) => e.message).join(', ') || 'Error desconocido creando registro DNS';
      return { success: false, error: errorMsg };
    } catch (err: any) {
      console.error('Error al crear registro DNS en Cloudflare:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Lista los registros DNS reales de una zona.
   */
  async listDnsRecords(zoneId: string): Promise<{
    success: boolean;
    records?: Array<{ id: string; type: string; name: string; content: string; ttl: number; proxied: boolean; priority?: number }>;
    error?: string;
  }> {
    const token = this.accountToken || this.zoneToken;
    if (!token) return { success: false, error: 'Cloudflare API token no configurado' };

    try {
      const response = await fetch(`${CF_BASE_URL}/zones/${zoneId}/dns_records?per_page=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          records: (data.result || []).map((r: any) => ({
            id: r.id,
            type: r.type,
            name: r.name,
            content: r.content,
            ttl: r.ttl,
            proxied: !!r.proxied,
            priority: r.priority
          }))
        };
      }

      const errorMsg = data.errors?.map((e: any) => e.message).join(', ') || 'Error listando registros DNS';
      return { success: false, error: errorMsg };
    } catch (err: any) {
      console.error('Error al listar registros DNS en Cloudflare:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Actualiza un registro DNS existente.
   */
  async updateDnsRecord(
    zoneId: string,
    recordId: string,
    params: { type: string; name: string; content: string; proxied?: boolean; ttl?: number; priority?: number }
  ): Promise<CloudflareDnsRecordResult> {
    const token = this.accountToken || this.zoneToken;
    if (!token) return { success: false, error: 'Cloudflare API token no configurado' };

    try {
      const response = await fetch(`${CF_BASE_URL}/zones/${zoneId}/dns_records/${recordId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: params.type,
          name: params.name,
          content: params.content,
          ttl: params.ttl ?? 1,
          proxied: params.proxied ?? true,
          ...(params.priority !== undefined ? { priority: params.priority } : {})
        })
      });
      const data = await response.json();

      if (data.success && data.result) {
        return { success: true, recordId: data.result.id };
      }

      const errorMsg = data.errors?.map((e: any) => e.message).join(', ') || 'Error actualizando registro DNS';
      return { success: false, error: errorMsg };
    } catch (err: any) {
      console.error('Error al actualizar registro DNS en Cloudflare:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Elimina un registro DNS.
   */
  async deleteDnsRecord(zoneId: string, recordId: string): Promise<{ success: boolean; error?: string }> {
    const token = this.accountToken || this.zoneToken;
    if (!token) return { success: false, error: 'Cloudflare API token no configurado' };

    try {
      const response = await fetch(`${CF_BASE_URL}/zones/${zoneId}/dns_records/${recordId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) return { success: true };

      const errorMsg = data.errors?.map((e: any) => e.message).join(', ') || 'Error eliminando registro DNS';
      return { success: false, error: errorMsg };
    } catch (err: any) {
      console.error('Error al eliminar registro DNS en Cloudflare:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Flujo completo para un dominio recién registrado en Namecheap: crea la zona
   * en Cloudflare y deja listos los registros A (raíz y www) apuntando al VPS.
   * Quien llama a este método aún debe apuntar los nameservers en Namecheap
   * con los `nameServers` devueltos aquí (ver NamecheapClient.setCustomNameservers).
   */
  async provisionPurchasedDomain(domain: string, targetIp: string = DEFAULT_TARGET_IP): Promise<DomainProvisionResult> {
    const zoneResult = await this.createZone(domain);
    if (!zoneResult.success || !zoneResult.zoneId) {
      return { success: false, error: zoneResult.error };
    }

    const rootRecord = await this.createDnsRecord(zoneResult.zoneId, {
      type: 'A',
      name: domain,
      content: targetIp,
      proxied: true
    });
    await this.createDnsRecord(zoneResult.zoneId, {
      type: 'A',
      name: `www.${domain}`,
      content: targetIp,
      proxied: true
    });

    return {
      success: true,
      zoneId: zoneResult.zoneId,
      nameServers: zoneResult.nameServers,
      aRecordCreated: rootRecord.success
    };
  }

  /**
   * Crea un subdominio real (registro A) dentro de la zona principal ya activa
   * en Cloudflare (CLOUDFLARE_ZONE_ID), p. ej. cliente.waltherparrado.com.
   */
  async createSubdomainRecord(
    subdomain: string,
    baseDomain: string,
    targetIp: string = DEFAULT_TARGET_IP
  ): Promise<CloudflareDnsRecordResult & { fqdn: string }> {
    const fqdn = `${subdomain}.${baseDomain}`;

    if (!this.defaultZoneId) {
      return { success: false, error: 'CLOUDFLARE_ZONE_ID no configurado', fqdn };
    }

    const result = await this.createDnsRecord(this.defaultZoneId, {
      type: 'A',
      name: fqdn,
      content: targetIp,
      proxied: true
    });

    return { ...result, fqdn };
  }
}

export const cloudflareClient = new CloudflareClient();

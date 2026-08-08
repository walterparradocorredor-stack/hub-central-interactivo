import { namecheapClient, DomainCheckResult } from './namecheap';

export interface AIDomainSuggestion {
  name: string;
  tld: string;
  fullDomain: string;
  reason: string;
  available?: boolean;
  priceCop?: number;
}

export async function generateAIDomains(businessIdea: string): Promise<AIDomainSuggestion[]> {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    throw new Error('GROQ_API_KEY no configurada');
  }

  try {
    const prompt = `Actúa como un experto en Naming, Branding y SEO. El cliente describe su idea de negocio: "${businessIdea}".
Genera EXACTAMENTE 5 sugerencias de nombres de marca creativos, cortos, fáciles de recordar y pronunciar.
Responde ÚNICAMENTE en formato JSON con la siguiente estructura (sin texto explicativo antes ni después):
[
  {"name": "nombrebase", "tld": "com", "reason": "Razón corta de branding"},
  {"name": "nombrebase", "tld": "co", "reason": "Razón corta de branding"},
  {"name": "nombrebase", "tld": "online", "reason": "Razón corta de branding"},
  {"name": "nombrebase", "tld": "tech", "reason": "Razón corta de branding"},
  {"name": "nombrebase", "tld": "store", "reason": "Razón corta de branding"}
]`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 600
      })
    });

    if (!res.ok) {
      throw new Error(`Groq API error ${res.status}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '[]';
    
    // Extraer JSON usando regex por si la IA agrega marcas de código markdown
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const parsedRaw = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    const domainsToCheck = parsedRaw.map((item: any) => `${item.name.toLowerCase().replace(/[^a-z0-9-]/g, '')}.${item.tld || 'com'}`);
    
    // Verificar disponibilidad en Namecheap
    const checkResults: DomainCheckResult[] = await namecheapClient.checkDomains(domainsToCheck);

    return parsedRaw.map((item: any, idx: number) => {
      const fullDomain = domainsToCheck[idx];
      const check = checkResults.find(c => c.domain.toLowerCase() === fullDomain.toLowerCase()) || checkResults[idx];

      return {
        name: item.name,
        tld: item.tld,
        fullDomain,
        reason: item.reason,
        available: check ? check.available : true,
        priceCop: check ? check.priceCop : 49900
      };
    });
  } catch (error) {
    console.warn('Error en generador de IA de dominios (Usando sugerencias de respaldo):', error);
    
    // Fallback inteligente
    const cleanWord = businessIdea.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12) || 'miempresa';
    const fallbackDomains = [
      `${cleanWord}pro.com`,
      `${cleanWord}app.co`,
      `${cleanWord}online.online`,
      `go${cleanWord}.tech`,
      `${cleanWord}oficial.store`
    ];

    const checkResults = await namecheapClient.checkDomains(fallbackDomains);
    
    return fallbackDomains.map((dom, idx) => ({
      name: dom.split('.')[0],
      tld: dom.split('.')[1],
      fullDomain: dom,
      reason: 'Sugerencia de marca optimizada para SEO',
      available: checkResults[idx]?.available ?? true,
      priceCop: checkResults[idx]?.priceCop ?? 49900
    }));
  }
}

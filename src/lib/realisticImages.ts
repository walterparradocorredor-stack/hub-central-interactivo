/**
 * Generador de Imágenes Hiperrealistas con Personas Reales y Entornos Corporativos de IA
 * Utiliza el motor Pollinations AI HD optimizado con prompts cinematográficos.
 */

export function sanitizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/Revolutionando/gi, 'Revolucionando')
    .replace(/Revolution/gi, 'Revolución')
    .replace(/actualziacion/gi, 'actualización')
    .replace(/imageens/gi, 'imágenes');
}

function getDeterministicSeed(input: string): number {
  let hash = 0;
  const str = input || 'default';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash % 800000) + 100000;
}

export function generateRealisticAIImage(topic: string, category: string = 'IA & Automatización'): string {
  const cleanTopic = (topic || '').toLowerCase();
  
  let basePrompt = "ultra realistic 8k photo of professional colombian executive team collaborating in modern glass high-tech office in Bogota, glowing holographic AI data analytics interface, dramatic studio lighting, shot on 35mm lens, highly detailed, photorealistic, cinematic";

  if (cleanTopic.includes('seguridad') || cleanTopic.includes('identidad') || cleanTopic.includes('biometria')) {
    basePrompt = "photorealistic portrait of a female cybersecurity engineer inspecting facial recognition and biometrics holographic scanner in high-tech server room, cinematic lighting, hyperdetailed 8k, professional executive style";
  } else if (cleanTopic.includes('atención') || cleanTopic.includes('cliente') || cleanTopic.includes('ventas') || cleanTopic.includes('b2b')) {
    basePrompt = "ultra realistic photograph of a friendly hispanic customer success manager in modern corporate office interacting with smart AI agent dashboard, bright natural light, crisp focus, 8k resolution, authentic business look";
  } else if (cleanTopic.includes('agente') || cleanTopic.includes('eficiencia') || cleanTopic.includes('automatizacion')) {
    basePrompt = "hyperrealistic photo of a male colombian CEO analyzing automated AI workflow on futuristic glass tablet in sleek conference room, sharp focus, professional corporate aesthetic, 8k, photorealistic";
  } else if (cleanTopic.includes('educacion') || cleanTopic.includes('rectores') || cleanTopic.includes('colegio')) {
    basePrompt = "photorealistic portrait of an inspiring colombian university chancellor leading a modern digital classroom with interactive AI screens and students, warm lighting, cinematic 8k, authentic professional atmosphere";
  }

  const encodedPrompt = encodeURIComponent(basePrompt);
  const seed = getDeterministicSeed(topic || basePrompt);

  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=675&seed=${seed}&nologo=true`;
}

export const REALISTIC_SAMPLE_POSTS = [
  {
    id: "agentes-autonomos-eficiencia-colombia",
    title: "Revolucionando la Eficiencia Empresarial: Integración de Agentes Autónomos de IA en Colombia",
    excerpt: "Las empresas colombianas están adoptando agentes inteligentes para automatizar operaciones B2B, atención al cliente y decisiones financieras con impacto directo en productividad.",
    category: "IA B2B & Automatización",
    date: "2 de Agosto, 2026",
    image: generateRealisticAIImage("agentes-autonomos-eficiencia-colombia", "IA B2B & Automatización"),
    readTime: "5 min",
    content: `La revolución de la Inteligencia Artificial en Colombia ha dado un paso firme desde la simple experimentación hasta la implementación de **Agentes Autónomos de IA** en los procesos clave de negocio.

### ¿Por qué los Agentes Autónomos cambian las reglas del juego?
A diferencia de los chatbots tradicionales, un agente autónomo posee la capacidad de razonar, tomar decisiones basadas en datos en tiempo real y ejecutar tareas complejas en sistemas legados, CRM y pasarelas de pago.

### Casos de Éxito en el Mercado Colombiano
1. **Optimización de Servicios Financieros:** Automatización de análisis crediticio y verificación de antecedentes en minutos.
2. **Atención Omnicanal B2B:** Agentes que atienden por WhatsApp con voz y texto, agendando citas y procesando órdenes de compra de forma autónoma.
3. **Gerencia y Telemetría:** Dashboards inteligentes que notifican a los ejecutivos sobre anomalías en tiempo real.

> "La automatización no reemplaza el talento humano; potencia a los líderes para enfocarse en la estrategia y la innovación de alto valor." — Dr. Walther Parrado`
  },
  {
    id: "seguridad-identidad-digital-territorial",
    title: "La Nueva Frontera de la Seguridad: Tecnologías de Verificación de Identidad y Geo-Analítica Territorial",
    excerpt: "Descubre cómo la verificación biométrica y el análisis geoespacial protegen activos críticos y previenen el fraude en organizaciones públicas y privadas.",
    category: "GovTech & Identidad Digital",
    date: "2 de Agosto, 2026",
    image: generateRealisticAIImage("seguridad-identidad-digital-territorial", "GovTech & Identidad Digital"),
    readTime: "5 min",
    content: `En un entorno cada vez más digitalizado, la seguridad documental y la verificación de identidad representan el pilar fundamental de la confianza institucional.

### Avances Tecnológicos Clave
- **Biometría Facial Dinámica:** Validación contra bases de datos oficiales sin riesgo de suplantación.
- **Geo-Analítica Territorial:** Mapeo de riesgos y auditoría en mapa de calor para la toma de decisiones en tiempo real.
- **Protección de Datos Corporativos:** Implementación de cifrado de punta a punta y cumplimiento estricto del Habeas Data en Colombia.`
  },
  {
    id: "atencion-cliente-ventas-b2b-ia",
    title: "Revolucionando la Atención al Cliente y Ventas B2B con Automatización y Modelos de Lenguaje Avanzados",
    excerpt: "Aprende a integrar modelos de lenguaje adaptados al léxico colombiano para elevar la conversión de ventas y ofrecer respuestas hiper-personalizadas 24/7.",
    category: "Transformación Digital",
    date: "1 de Agosto, 2026",
    image: generateRealisticAIImage("atencion-cliente-ventas-b2b-ia", "Transformación Digital"),
    readTime: "5 min",
    content: `La atención al cliente en el segmento B2B exige inmediatez, precisión y comprensión profunda del contexto del cliente.

### Beneficios Clave
- **Respuestas Instantáneas 24/7:** Sin tiempos de espera ni abandono de prospectos.
- **Integración con Sistemas de Pago y CRM:** Cierre de ventas directamente en la conversación de WhatsApp o web.`
  }
];

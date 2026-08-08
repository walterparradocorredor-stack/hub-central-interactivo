export interface ServicePlan {
  id: string;
  category: 'email' | 'hosting' | 'ssl' | 'dns';
  name: string;
  description: string;
  priceCopMonth?: number;
  priceCopYear: number;
  priceUsdYear: number;
  popular?: boolean;
  features: string[];
  badge?: string;
  wompiLink?: string;
}

export const RESELLER_SERVICES: ServicePlan[] = [
  // Correo Profesional Private Email
  {
    id: 'email-starter',
    category: 'email',
    name: 'Private Email Starter',
    description: 'Buzón corporativo profesional con tu dominio (usuario@tudominio.com).',
    priceCopMonth: 6900,
    priceCopYear: 69900,
    priceUsdYear: 14.80,
    features: [
      '1 Buzón de Correo (5 GB)',
      'Acceso Webmail y Móvil (IMAP/POP3)',
      'Protección Anti-Spam & Virus Guardia',
      'Alias de Correo Ilimitados'
    ],
    badge: 'Más Económico',
    wompiLink: process.env.NEXT_PUBLIC_WOMPI_LINK_EMAIL_STARTER || 'https://checkout.wompi.co/l/VPOS_MtK6nj'
  },
  {
    id: 'email-pro',
    category: 'email',
    name: 'Private Email Pro',
    description: 'Para equipos y pymes con integración de documentos y agenda.',
    priceCopMonth: 15900,
    priceCopYear: 159900,
    priceUsdYear: 34.80,
    popular: true,
    features: [
      '3 Buzones de Correo (30 GB)',
      'Suite de Documentos y Hojas de Cálculo',
      'Calendarios Compartidos & Contactos',
      'Sincronización ActiveSync Móvil'
    ],
    badge: 'Recomendado Pymes',
    wompiLink: process.env.NEXT_PUBLIC_WOMPI_LINK_EMAIL_PRO || 'https://checkout.wompi.co/l/VPOS_MtK6nj'
  },
  {
    id: 'email-ultimate',
    category: 'email',
    name: 'Private Email Ultimate Enterprise',
    description: 'Para empresas grandes que requieren almacenamiento masivo y suite colaborativa.',
    priceCopMonth: 27900,
    priceCopYear: 289900,
    priceUsdYear: 68.00,
    features: [
      '5 Buzones de Correo (75 GB Almacenamiento)',
      'Suite Colaborativa de Documentos, Tablas y Presentaciones',
      'Anti-Spam de Grado Bancario & Filtrado VIP',
      'Integración con Outlook, Apple Mail y Android'
    ],
    badge: 'Empresarial',
    wompiLink: process.env.NEXT_PUBLIC_WOMPI_LINK_EMAIL_ULTIMATE || 'https://checkout.wompi.co/l/VPOS_MtK6nj'
  },
  {
    id: 'email-vps-unlimited',
    category: 'email',
    name: 'Servidor VPS Mail Server Ilimitado',
    description: 'Alojado directamente en nuestro Servidor VPS con buzones ilimitados.',
    priceCopMonth: 19900,
    priceCopYear: 199900,
    priceUsdYear: 49.00,
    features: [
      'Buzones de Correo ILIMITADOS (usuario@tudominio.com)',
      '100 GB SSD Dedicado en Servidor VPS',
      'Webmail Profesional (Roundcube / MailCow)',
      'Firma Digital DKIM, Registro SPF & SSL Incluidos'
    ],
    badge: 'Buzones Ilimitados (VPS)',
    wompiLink: process.env.NEXT_PUBLIC_WOMPI_LINK_VPS_MAIL || 'https://checkout.wompi.co/l/VPOS_MtK6nj'
  },

  // Hosting Web Stellar
  {
    id: 'hosting-stellar',
    category: 'hosting',
    name: 'Hosting Cloud Stellar',
    description: 'Alojamiento de alta velocidad para sitios web y blogs.',
    priceCopMonth: 13900,
    priceCopYear: 139900,
    priceUsdYear: 29.80,
    features: [
      '3 Sitios Web Alojados',
      '20 GB SSD NVMe de Almacenamiento',
      'Dominio Gratis por el 1er Año',
      'Instalador WordPress en 1-Clic'
    ],
    wompiLink: process.env.NEXT_PUBLIC_WOMPI_LINK_HOSTING_STELLAR || 'https://checkout.wompi.co/l/VPOS_MtK6nj'
  },
  {
    id: 'hosting-stellar-plus',
    category: 'hosting',
    name: 'Hosting Stellar Plus',
    description: 'Recursos ilimitados para negocios en constante crecimiento.',
    priceCopMonth: 22900,
    priceCopYear: 229900,
    priceUsdYear: 49.80,
    popular: true,
    features: [
      'Sitios Web ILIMITADOS',
      'Almacenamiento SSD NVMe ILIMITADO',
      'Auto-Backups Automáticos',
      'Bases de Datos MySQL Ilimitadas'
    ],
    badge: 'Más Vendido',
    wompiLink: process.env.NEXT_PUBLIC_WOMPI_LINK_HOSTING_STELLAR_PLUS || 'https://checkout.wompi.co/l/VPOS_MtK6nj'
  },
  {
    id: 'hosting-easywp',
    category: 'hosting',
    name: 'WordPress Managed EasyWP',
    description: 'Servidor ultrarrápido optimizado exclusivamente para WordPress.',
    priceCopMonth: 29900,
    priceCopYear: 299900,
    priceUsdYear: 68.80,
    features: [
      '1 Sitio WordPress Optimizado',
      '10 GB SSD NVMe dedicado',
      'Velocidad 3x más rápida que hosting tradicional',
      'Panel de Control Simplificado'
    ],
    wompiLink: process.env.NEXT_PUBLIC_WOMPI_LINK_EASYWP || 'https://checkout.wompi.co/l/VPOS_MtK6nj'
  },

  // Certificados SSL Pro (Servicio Propio VPS - 100% Margen de Ganancia)
  {
    id: 'ssl-vps-pro',
    category: 'ssl',
    name: 'Certificado SSL Enterprise HTTPS (VPS Pro)',
    description: 'Cifrado de seguridad digital candado verde respaldado por nuestro Servidor VPS.',
    priceCopYear: 39900,
    priceUsdYear: 9.99,
    popular: true,
    features: [
      'Candado de Seguridad HTTPS en Navegador',
      'Cifrado de 256 bits de Grado Bancario',
      'Instalación y Renovación Automática en VPS',
      'Compatible con Google SEO & Algoritmos'
    ],
    badge: '100% Garantizado',
    wompiLink: process.env.NEXT_PUBLIC_WOMPI_LINK_SSL_VPS || 'https://checkout.wompi.co/l/x9OaDV'
  },
  {
    id: 'ssl-wildcard-pro',
    category: 'ssl',
    name: 'Certificado SSL Wildcard (*.tudominio.com)',
    description: 'Protege tu dominio principal y TODOS sus subdominios presentes y futuros.',
    priceCopYear: 299900,
    priceUsdYear: 78.00,
    features: [
      'Protección para Subdominios Ilimitados (*.tudominio.com)',
      'Garantía de Cifrado Enterprise',
      'Soporte Técnico de Instalación Directo',
      'Renovación Automática en Servidor'
    ],
    wompiLink: process.env.NEXT_PUBLIC_WOMPI_LINK_SSL_WILDCARD || 'https://checkout.wompi.co/l/VPOS_MtK6nj'
  },

  // PremiumDNS
  {
    id: 'dns-premium',
    category: 'dns',
    name: 'PremiumDNS 100% Uptime SLA',
    description: 'Protección contra ataques DDoS y resolución de nombres Anycast ultrarrápida.',
    priceCopYear: 21900,
    priceUsdYear: 4.88,
    features: [
      'Redundancia DNS Global Anycast 100% Uptime',
      'Protección Avanzada contra Ataques DDoS',
      'Soporte para DNSSEC (Seguridad Anti-Spoofing)',
      'Resolución de Latencia Ultra Baja'
    ],
    wompiLink: process.env.NEXT_PUBLIC_WOMPI_LINK_GENERIC || 'https://checkout.wompi.co/l/VPOS_MtK6nj'
  }
];

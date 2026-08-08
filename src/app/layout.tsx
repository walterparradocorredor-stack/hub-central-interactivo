import type { Metadata } from 'next';
import './globals.css';
import AIChatBubble from '@/components/AIChatBubble';

export const metadata: Metadata = {
  title: 'WP Ecosystem — Ecosistema Empresarial Walther Parrado',
  description: 'Plataforma oficial del holding de Walther Parrado: PreICFES App, Rentun Group, Fundetec, Jowhalth Academy, Cédula 360, Parla 360, Alcanza Una Beca y Consultoría IA.',
  keywords: [
    'WP Ecosystem', 'Walther Parrado', 'PreICFES App', 'Fundetec', 'Jowhalth Academy',
    'Rentun Group', 'Cédula 360', 'Parla 360', 'Alcanza Una Beca', 'Inteligencia Artificial', 'Holding'
  ],
  verification: {
    google: 'v5sIonXvwzDhh2bQ9TvmR5BuBTgrL5NSqNzyjMmSlvg',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'WP Ecosystem — Connecting Business Ecosystems',
    description: 'Ecosistema oficial de soluciones tecnológicas, plataformas SaaS, campus virtuales y consultoría de Inteligencia Artificial.',
    url: 'https://hub.waltherparrado.com',
    siteName: 'WP Ecosystem',
    images: [
      {
        url: 'https://hub.waltherparrado.com/wp-logo.png',
        width: 800,
        height: 800,
        alt: 'WP Ecosystem Logo',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
};

const fullEcosystemSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Corporation',
      '@id': 'https://hub.waltherparrado.com/#organization',
      name: 'WP Ecosystem — Walther Parrado Holding',
      alternateName: 'WP Ecosystem',
      url: 'https://hub.waltherparrado.com',
      logo: 'https://hub.waltherparrado.com/wp-logo.png',
      description: 'Holding corporativo e integrador tecnológico impulsando plataformas SaaS educativas, gestión inmobiliaria, GovTech e Inteligencia Artificial.',
      founder: {
        '@type': 'Person',
        name: 'Walther Parrado',
        jobTitle: 'Founder & CEO',
        url: 'https://waltherparrado.com',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Ac. 85 #12-66, WeWork Calle 85',
        addressLocality: 'Bogotá',
        addressRegion: 'Cundinamarca',
        addressCountry: 'CO',
      },
      subOrganization: [
        { '@type': 'Organization', name: 'Rentun Group', url: 'https://www.rentungroup.com/' },
        { '@type': 'Organization', name: 'PreICFES App', url: 'https://preicfes.app/' },
        { '@type': 'Organization', name: 'Fundetec Institucional', url: 'https://fundetec.edu.co/' },
        { '@type': 'Organization', name: 'Fundetec Campus Virtual', url: 'https://virtual.fundetec.edu.co/' },
        { '@type': 'Organization', name: 'University Idiomas Link', url: 'https://universityidiomaslink.com/' },
        { '@type': 'Organization', name: 'Fundetec Inglés', url: 'https://fundetec.edu.co/ingles/' },
        { '@type': 'Organization', name: 'Red de 250 Agentes de IA', url: 'https://hub.waltherparrado.com/agentes' },
        { '@type': 'Organization', name: 'Jowhalth Academy', url: 'https://jowhalthacademy.com/' },
        { '@type': 'Organization', name: 'Jowhalth Tutor AI', url: 'https://tutor.jowhalthacademy.com' },
        { '@type': 'Organization', name: 'Walther Parrado Consultoría IA', url: 'https://waltherparrado.com/' },
        { '@type': 'Organization', name: 'Alcanza Una Beca', url: 'https://alcanzaunabeca.org' },
        { '@type': 'Organization', name: 'Walpa Planner Fundetec', url: 'https://walpaplanner.fundetec.cloud/' },
        { '@type': 'Organization', name: 'Parla 360', url: 'https://parla360.tech' },
        { '@type': 'Organization', name: 'Cédula 360 Tech', url: 'https://cedula360.tech' },
        { '@type': 'Organization', name: 'Cédula 360 Translate', url: 'https://translate.cedula360.tech' },
        { '@type': 'Organization', name: 'Cédula 360 DeepMap', url: 'https://deepmap.cedula360.tech' },
        { '@type': 'Organization', name: 'Cédula 360 Pulse', url: 'https://pulse.cedula360.tech' },
        { '@type': 'Organization', name: 'Ollama LLM Local Engine', url: 'https://ollama.com' },
      ],
    },
    {
      '@type': 'WebSite',
      name: 'WP Ecosystem — Ecosistema Empresarial Walther Parrado',
      url: 'https://hub.waltherparrado.com',
      creator: {
        '@type': 'Organization',
        name: 'J&M Tech Solutions',
        url: 'https://www.jymtechsolutions.online/es',
        description: 'Agencia de automatización con IA y desarrollo de software',
      },
    },
    {
      '@type': 'ItemList',
      name: 'Empresas y Plataformas del WP Ecosystem',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Rentun Group', url: 'https://hub.waltherparrado.com/rentun' },
        { '@type': 'ListItem', position: 2, name: 'PreICFES App', url: 'https://preicfes.app/' },
        { '@type': 'ListItem', position: 3, name: 'Fundetec Institucional', url: 'https://fundetec.edu.co/' },
        { '@type': 'ListItem', position: 4, name: 'Fundetec Campus Virtual', url: 'https://virtual.fundetec.edu.co/' },
        { '@type': 'ListItem', position: 5, name: 'University Idiomas Link', url: 'https://universityidiomaslink.com/' },
        { '@type': 'ListItem', position: 6, name: 'Fundetec Inglés', url: 'https://fundetec.edu.co/ingles/' },
        { '@type': 'ListItem', position: 7, name: 'Red de 250 Agentes de IA', url: 'https://hub.waltherparrado.com/agentes' },
        { '@type': 'ListItem', position: 8, name: 'Jowhalth Academy', url: 'https://jowhalthacademy.com/' },
        { '@type': 'ListItem', position: 9, name: 'Jowhalth Tutor AI', url: 'https://tutor.jowhalthacademy.com' },
        { '@type': 'ListItem', position: 10, name: 'Walther Parrado Consultoría IA', url: 'https://waltherparrado.com/' },
        { '@type': 'ListItem', position: 11, name: 'Alcanza Una Beca', url: 'https://alcanzaunabeca.org' },
        { '@type': 'ListItem', position: 12, name: 'Walpa Planner Fundetec', url: 'https://walpaplanner.fundetec.cloud/' },
        { '@type': 'ListItem', position: 13, name: 'Parla 360', url: 'https://parla360.tech' },
        { '@type': 'ListItem', position: 14, name: 'Cédula 360 Tech', url: 'https://cedula360.tech' },
        { '@type': 'ListItem', position: 15, name: 'Cédula 360 Translate', url: 'https://translate.cedula360.tech' },
        { '@type': 'ListItem', position: 16, name: 'Cédula 360 DeepMap', url: 'https://deepmap.cedula360.tech' },
        { '@type': 'ListItem', position: 17, name: 'Cédula 360 Pulse', url: 'https://pulse.cedula360.tech' },
        { '@type': 'ListItem', position: 18, name: 'Ollama LLM Local Engine', url: 'https://ollama.com' },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <meta name="google-site-verification" content="v5sIonXvwzDhh2bQ9TvmR5BuBTgrL5NSqNzyjMmSlvg" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(fullEcosystemSchema),
          }}
        />
      </head>
      <body className="bg-[#07090e] text-white antialiased">
        {children}
      </body>
    </html>
  );
}

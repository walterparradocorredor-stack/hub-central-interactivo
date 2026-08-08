import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hub.waltherparrado.com';
  const mainDomain = 'https://waltherparrado.com';

  const routes = [
    '',
    '/rentun',
    '/nosotros',
    '/ubicacion',
    '/whatsapp-ia',
    '/habeas-data',
    '/terminos',
    '/privacidad',
  ];

  const hubEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/rentun' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/rentun' ? 0.9 : 0.7,
  }));

  const mainDomainEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${mainDomain}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 0.9 : 0.6,
  }));

  return [...hubEntries, ...mainDomainEntries];
}

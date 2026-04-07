import { MetadataRoute } from 'next';
import locations from '../data/locations.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.osemki-warszawa.pl'; // Zmień na swoją realną domenę

  // 1. Dodajemy stronę główną
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];

  // 2. Dodajemy wszystkie 153 podstrony lokalizacji z JSON-a
  const locationRoutes = locations.map((loc) => ({
    url: `${baseUrl}/${loc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...locationRoutes];
}
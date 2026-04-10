import { MetadataRoute } from 'next';
import locations from '../data/locations.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.osemki-warszawa.pl';
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];

  const locationRoutes = locations.map((loc) => ({
    url: `${baseUrl}/${loc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...locationRoutes];
}

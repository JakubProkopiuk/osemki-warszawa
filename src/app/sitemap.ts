import { MetadataRoute } from 'next';
import locations from '../data/locations.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://osemki-warszawa.pl'; // Podmień na swoją docelową domenę

  const locationUrls = locations.map((loc) => ({
    url: `${baseUrl}/${loc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    ...locationUrls,
  ];
}
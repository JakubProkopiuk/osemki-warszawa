import { MetadataRoute } from 'next';
import locations from '../data/locations.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.osemki-warszawa.pl';

  // 1. Definiujemy stronę główną (najwyższy priorytet)
  const mainPage = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  } as const;

  // 2. Automatycznie generujemy wpisy dla każdej lokalizacji z JSON-a
  const locationPages = locations.map((loc) => ({
    url: `${baseUrl}/${loc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  })) as MetadataRoute.Sitemap;

  // 3. Łączymy wszystko w jedną listę
  return [mainPage, ...locationPages];
}
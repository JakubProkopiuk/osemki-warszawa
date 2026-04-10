import { NextResponse } from 'next/server';
import locations from '../../data/locations.json';

const BASE_URL = 'https://www.osemki-warszawa.pl';

export function GET() {
  const urls = (locations as Array<{ slug: string; klinika: string }>)
    .filter((loc) => loc.klinika.includes('KEN'))
    .map(
      (loc) => `<url><loc>${BASE_URL}/${loc.slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}


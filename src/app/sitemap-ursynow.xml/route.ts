import { NextResponse } from 'next/server';
import locations from '../../data/locations.json';
import { getLocationSearchVolume, type LocationRecord } from '@/lib/clinic';

const BASE_URL = 'https://www.osemki-warszawa.pl';
const INDEXED_URSYNOW_LOCATION_LIMIT = 18;
const LASTMOD = new Date().toISOString().split('T')[0];

export function GET() {
  const urls = (locations as LocationRecord[])
    .filter((loc) => loc.hubSlug === 'ursynow')
    .sort((a, b) => getLocationSearchVolume(b) - getLocationSearchVolume(a))
    .slice(0, INDEXED_URSYNOW_LOCATION_LIMIT)
    .map(
      (loc) => `<url><loc>${BASE_URL}/${loc.slug}</loc><lastmod>${LASTMOD}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
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

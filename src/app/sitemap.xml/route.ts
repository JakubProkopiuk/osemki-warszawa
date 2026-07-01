import { NextResponse } from 'next/server';

const BASE_URL = 'https://www.osemki-warszawa.pl';
const LASTMOD = new Date().toISOString().split('T')[0];

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${BASE_URL}/sitemap-core.xml</loc><lastmod>${LASTMOD}</lastmod></sitemap>
  <sitemap><loc>${BASE_URL}/sitemap-ursynow.xml</loc><lastmod>${LASTMOD}</lastmod></sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}

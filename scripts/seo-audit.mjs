import fs from 'node:fs';

const pagePath = new URL('../src/app/[slug]/page.tsx', import.meta.url);
const clientPath = new URL('../src/app/[slug]/LocationClient.tsx', import.meta.url);
const layoutPath = new URL('../src/app/layout.tsx', import.meta.url);
const schemaPath = new URL('../src/lib/generateSchema.ts', import.meta.url);
const robotsPath = new URL('../public/robots.txt', import.meta.url);
const sitemapIndexPath = new URL('../src/app/sitemap.xml/route.ts', import.meta.url);
const sitemapOchotaPath = new URL('../src/app/sitemap-ochota.xml/route.ts', import.meta.url);
const sitemapUrsynowPath = new URL('../src/app/sitemap-ursynow.xml/route.ts', import.meta.url);
const locationsPath = new URL('../src/data/locations.json', import.meta.url);

const pageSource = fs.readFileSync(pagePath, 'utf-8');
const clientSource = fs.readFileSync(clientPath, 'utf-8');
const layoutSource = fs.readFileSync(layoutPath, 'utf-8');
const schemaSource = fs.readFileSync(schemaPath, 'utf-8');
const robotsSource = fs.readFileSync(robotsPath, 'utf-8');
const sitemapIndexSource = fs.readFileSync(sitemapIndexPath, 'utf-8');
const sitemapOchotaSource = fs.readFileSync(sitemapOchotaPath, 'utf-8');
const sitemapUrsynowSource = fs.readFileSync(sitemapUrsynowPath, 'utf-8');
const locations = JSON.parse(fs.readFileSync(locationsPath, 'utf-8'));
const faqCoverage =
  locations.length > 0
    ? locations.filter((loc) => Array.isArray(loc.faq) && loc.faq.length > 0).length / locations.length
    : 0;
const hasSchemaFaqFallback =
  schemaSource.includes('location.faq && location.faq.length > 0') &&
  schemaSource.includes('Nie potrzebujesz skierowania');

const checks = [
  {
    name: 'Canonical clustering wired',
    pass: pageSource.includes('getCanonical('),
  },
  {
    name: 'JSON-LD generation wired',
    pass: pageSource.includes('generateMedicalSchema('),
  },
  {
    name: 'Medical schema has geo coordinates',
    pass: schemaSource.includes('geo: {') && schemaSource.includes('GeoCoordinates'),
  },
  {
    name: 'Breadcrumb rendered on slug',
    pass: clientSource.includes('<Breadcrumb items={breadcrumbItems} />'),
  },
  {
    name: 'Maps embed uses https',
    pass: clientSource.includes('https://maps.google.com/maps?q='),
  },
  {
    name: 'Preconnect to maps set',
    pass: layoutSource.includes('preconnect'),
  },
  {
    name: 'Robots has Googlebot-Image rules',
    pass:
      robotsSource.includes('User-agent: Googlebot-Image') &&
      robotsSource.includes('Disallow: /ulica-*') &&
      robotsSource.includes('Disallow: /osiedle-*'),
  },
  {
    name: 'Sitemap index and clusters configured',
    pass:
      sitemapIndexSource.includes('/sitemap-ochota.xml') &&
      sitemapIndexSource.includes('/sitemap-ursynow.xml') &&
      sitemapOchotaSource.includes("loc.klinika.includes('Pruszkowska')") &&
      sitemapUrsynowSource.includes("loc.klinika.includes('KEN')"),
  },
  {
    name: 'FAQ source is robust (dataset or schema fallback)',
    pass: faqCoverage === 1 || hasSchemaFaqFallback,
  },
];

const failed = checks.filter((c) => !c.pass);
for (const check of checks) {
  console.log(`${check.pass ? '✓' : '✗'} ${check.name}`);
}

if (failed.length > 0) {
  process.exit(1);
}

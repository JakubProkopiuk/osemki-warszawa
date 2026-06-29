import fs from 'node:fs';

const pagePath = new URL('../src/app/[slug]/page.tsx', import.meta.url);
const clientPath = new URL('../src/app/[slug]/LocationClient.tsx', import.meta.url);
const layoutPath = new URL('../src/app/layout.tsx', import.meta.url);
const schemaPath = new URL('../src/lib/generateSchema.ts', import.meta.url);
const flowPath = new URL('../src/components/ConversationalFlow.tsx', import.meta.url);
const wisdomTeethFlowPath = new URL('../src/lib/flows/wisdomTeethFlow.ts', import.meta.url);
const scoringPath = new URL('../src/lib/flows/scoring.ts', import.meta.url);
const robotsPath = new URL('../public/robots.txt', import.meta.url);
const sitemapIndexPath = new URL('../src/app/sitemap.xml/route.ts', import.meta.url);
const sitemapUrsynowPath = new URL('../src/app/sitemap-ursynow.xml/route.ts', import.meta.url);
const locationsPath = new URL('../src/data/locations.json', import.meta.url);

const pageSource = fs.readFileSync(pagePath, 'utf-8');
const clientSource = fs.readFileSync(clientPath, 'utf-8');
const layoutSource = fs.readFileSync(layoutPath, 'utf-8');
const schemaSource = fs.readFileSync(schemaPath, 'utf-8');
const flowSource = fs.readFileSync(flowPath, 'utf-8');
const wisdomTeethFlowSource = fs.readFileSync(wisdomTeethFlowPath, 'utf-8');
const scoringSource = fs.readFileSync(scoringPath, 'utf-8');
const robotsSource = fs.readFileSync(robotsPath, 'utf-8');
const sitemapIndexSource = fs.readFileSync(sitemapIndexPath, 'utf-8');
const sitemapUrsynowSource = fs.readFileSync(sitemapUrsynowPath, 'utf-8');
const locations = JSON.parse(fs.readFileSync(locationsPath, 'utf-8'));
const faqCoverage =
  locations.length > 0
    ? locations.filter((loc) => Array.isArray(loc.faq) && loc.faq.length > 0).length / locations.length
    : 0;
const hasSchemaFaqFallback =
  schemaSource.includes('location.faq && location.faq.length > 0') &&
  schemaSource.includes('czy diagnostyka będzie potrzebna');

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
    name: 'Schema is isolated from clinic entity',
    pass:
      schemaSource.includes("'@type': 'MedicalWebPage'") &&
      schemaSource.includes("'@type': 'Service'") &&
      !schemaSource.includes('MedicalClinic') &&
      !schemaSource.includes('LocalBusiness') &&
      !schemaSource.includes('AggregateRating') &&
      !schemaSource.includes('Physician') &&
      !schemaSource.includes('telephone') &&
      !schemaSource.includes('address'),
  },
  {
    name: 'Clinical Triage flow wired on slug',
    pass: clientSource.includes('<ConversationalFlow') && clientSource.includes('wisdomTeethFlow'),
  },
  {
    name: 'Conversational flow captures lead and UTM context',
    pass:
      flowSource.includes('consent_contact') &&
      flowSource.includes("params.get('utm_source')") &&
      flowSource.includes('lead_score') &&
      flowSource.includes('urgency_band'),
  },
  {
    name: 'Wisdom teeth scoring has urgent routing',
    pass:
      scoringSource.includes('answers.pain_score >= 7') &&
      scoringSource.includes("urgentLabel: urgencyBand === 'high' ? 'PILNE' : null"),
  },
  {
    name: 'Wisdom teeth flow uses Clinical Triage variant',
    pass:
      wisdomTeethFlowSource.includes("variant: 'clinical_triage'") &&
      wisdomTeethFlowSource.includes('Co się dzieje z ósemką?'),
  },
  {
    name: 'Layout avoids map preconnects',
    pass: !layoutSource.includes('maps.google.com') && !layoutSource.includes('preconnect'),
  },
  {
    name: 'Robots has Googlebot-Image rules',
    pass:
      robotsSource.includes('User-agent: Googlebot-Image') &&
      robotsSource.includes('Disallow: /ulica-*') &&
      robotsSource.includes('Disallow: /osiedle-*') &&
      !robotsSource.includes('/ochota'),
  },
  {
    name: 'Sitemap index is Ursynów-only',
    pass:
      !sitemapIndexSource.includes('/sitemap-ochota.xml') &&
      sitemapIndexSource.includes('/sitemap-ursynow.xml') &&
      sitemapUrsynowSource.includes("loc.klinika.includes('KEN')") &&
      sitemapUrsynowSource.includes('INDEXED_URSYNOW_LOCATION_LIMIT'),
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

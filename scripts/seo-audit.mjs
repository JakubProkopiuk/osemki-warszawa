import fs from 'node:fs';

const pagePath = new URL('../src/app/[slug]/page.tsx', import.meta.url);
const clientPath = new URL('../src/app/[slug]/LocationClient.tsx', import.meta.url);
const triageClientPath = new URL('../src/components/TriageFlowClient.tsx', import.meta.url);
const layoutPath = new URL('../src/app/layout.tsx', import.meta.url);
const schemaPath = new URL('../src/lib/generateSchema.ts', import.meta.url);
const flowPath = new URL('../src/components/ConversationalFlow.tsx', import.meta.url);
const privacyPath = new URL('../src/app/polityka-prywatnosci/page.tsx', import.meta.url);
const wisdomTeethFlowPath = new URL('../src/lib/flows/wisdomTeethFlow.ts', import.meta.url);
const scoringPath = new URL('../src/lib/flows/scoring.ts', import.meta.url);
const robotsPath = new URL('../public/robots.txt', import.meta.url);
const sitemapIndexPath = new URL('../src/app/sitemap.xml/route.ts', import.meta.url);
const sitemapCorePath = new URL('../src/app/sitemap-core.xml/route.ts', import.meta.url);
const sitemapUrsynowPath = new URL('../src/app/sitemap-ursynow.xml/route.ts', import.meta.url);
const locationsPath = new URL('../src/data/locations.json', import.meta.url);
const nextConfigPath = new URL('../next.config.ts', import.meta.url);

const pageSource = fs.readFileSync(pagePath, 'utf-8');
const clientSource = fs.readFileSync(clientPath, 'utf-8');
const triageClientSource = fs.readFileSync(triageClientPath, 'utf-8');
const layoutSource = fs.readFileSync(layoutPath, 'utf-8');
const schemaSource = fs.readFileSync(schemaPath, 'utf-8');
const flowSource = fs.readFileSync(flowPath, 'utf-8');
const privacySource = fs.readFileSync(privacyPath, 'utf-8');
const wisdomTeethFlowSource = fs.readFileSync(wisdomTeethFlowPath, 'utf-8');
const scoringSource = fs.readFileSync(scoringPath, 'utf-8');
const robotsSource = fs.readFileSync(robotsPath, 'utf-8');
const sitemapIndexSource = fs.readFileSync(sitemapIndexPath, 'utf-8');
const sitemapCoreSource = fs.readFileSync(sitemapCorePath, 'utf-8');
const sitemapUrsynowSource = fs.readFileSync(sitemapUrsynowPath, 'utf-8');
const nextConfigSource = fs.readFileSync(nextConfigPath, 'utf-8');
const locations = JSON.parse(fs.readFileSync(locationsPath, 'utf-8'));
const sourceRoots = [
  new URL('../src', import.meta.url),
  new URL('../public/robots.txt', import.meta.url),
  new URL('../next.config.ts', import.meta.url),
];
const blockedPatterns = [
  /Ochota na Uśmiech/i,
  /Pruszkowska/i,
  /KEN 96/i,
  /bez bólu/i,
  /bezboles/i,
  /4\.9\/5/i,
  /Ponad 10 000/i,
  /lek\. dent\./i,
  /Dojazd: zależnie/i,
  /najlepsz/i,
  /najtańsz/i,
  /ostatnie wolne terminy/i,
];
const sourceFileExtensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.css', '.txt']);

const collectSourceFiles = (entryUrl) => {
  const entryPath = entryUrl.pathname;
  const stat = fs.statSync(entryPath);

  if (stat.isFile()) return [entryPath];

  return fs.readdirSync(entryPath, { withFileTypes: true }).flatMap((item) => {
    const itemPath = `${entryPath}/${item.name}`;
    if (item.isDirectory()) return collectSourceFiles(new URL(`file://${itemPath}`));
    const extension = item.name.slice(item.name.lastIndexOf('.'));
    return sourceFileExtensions.has(extension) ? [itemPath] : [];
  });
};

const blockedMatches = sourceRoots
  .flatMap(collectSourceFiles)
  .flatMap((filePath) => {
    const source = fs.readFileSync(filePath, 'utf-8');
    return blockedPatterns
      .filter((pattern) => pattern.test(source))
      .map((pattern) => `${filePath}: ${pattern}`);
  });
const faqCoverage =
  locations.length > 0
    ? locations.filter((loc) => Array.isArray(loc.faq) && loc.faq.length > 0).length / locations.length
    : 0;
const hasSchemaFaqFallback =
  schemaSource.includes('location.faq && location.faq.length > 0') &&
  schemaSource.includes('TRIAGE_FAQ_ITEMS');

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
    name: 'Conversational qualification flow wired on slug',
    pass:
      clientSource.includes('<TriageFlowClient') &&
      triageClientSource.includes('<ConversationalFlow') &&
      triageClientSource.includes('wisdomTeethFlow') &&
      triageClientSource.includes('slug={slug}'),
  },
  {
    name: 'Conversational flow captures lead and UTM context',
    pass:
      flowSource.includes('consent_contact') &&
      flowSource.includes('lead_id') &&
      flowSource.includes('reception_status') &&
      flowSource.includes("params.get('utm_source')") &&
      flowSource.includes('lead_score') &&
      flowSource.includes('urgency_band'),
  },
  {
    name: 'Wisdom teeth scoring has urgent routing',
    pass:
      scoringSource.includes("answers.preferred_contact_time === 'Jak najszybciej'") &&
      scoringSource.includes("urgentLabel: urgencyBand === 'high' ? 'PILNE' : null"),
  },
  {
    name: 'Wisdom teeth flow uses expected conversion variant',
    pass:
      wisdomTeethFlowSource.includes("variant: 'clinical_triage'") &&
      wisdomTeethFlowSource.includes('Czego dotyczy zgłoszenie?') &&
      !wisdomTeethFlowSource.includes('W skali od 1 do 10'),
  },
  {
    name: 'Layout avoids map preconnects',
    pass: !layoutSource.includes('maps.google.com') && !layoutSource.includes('preconnect'),
  },
  {
    name: 'Robots has Googlebot-Image rules',
    pass:
      robotsSource.includes('User-agent: Googlebot-Image') &&
      robotsSource.includes('Disallow: /ul-*') &&
      robotsSource.includes('Disallow: /osiedle-*') &&
      robotsSource.includes('Sitemap: https://www.osemki-warszawa.pl/sitemap.xml') &&
      !robotsSource.includes('/ochota'),
  },
  {
    name: 'Sitemap index is Ursynów-only',
    pass:
      !sitemapIndexSource.includes('/sitemap-ochota.xml') &&
      sitemapIndexSource.includes('/sitemap-ursynow.xml') &&
      sitemapUrsynowSource.includes("loc.hubSlug === 'ursynow'") &&
      sitemapUrsynowSource.includes('INDEXED_URSYNOW_LOCATION_LIMIT') &&
      sitemapUrsynowSource.includes('= 18') &&
      sitemapIndexSource.includes('<lastmod>') &&
      sitemapCoreSource.includes('<lastmod>') &&
      sitemapUrsynowSource.includes('<lastmod>') &&
      !sitemapCoreSource.includes('${BASE_URL}/ursynow'),
  },
  {
    name: 'FAQ source is robust (dataset or schema fallback)',
    pass: faqCoverage === 1 || hasSchemaFaqFallback,
  },
  {
    name: 'Privacy policy is linked near medical lead capture',
    pass:
      privacySource.includes('Polityka prywatności') &&
      flowSource.includes('/polityka-prywatnosci') &&
      flowSource.includes('consent_symptoms'),
  },
  {
    name: 'Local landing metadata avoids travel-time placeholders',
    pass: !pageSource.includes('Dojazd: ${travelTime}') && !pageSource.includes('zależnie od lokalizacji'),
  },
  {
    name: 'Legacy local URLs consolidate to Ursynów hub',
    pass:
      pageSource.includes('dynamicParams = false') &&
      nextConfigSource.includes("source: '/ochota'") &&
      nextConfigSource.includes("source: '/ul-:slug'") &&
      nextConfigSource.includes("source: '/ulica-:slug'") &&
      nextConfigSource.includes("destination: '/ursynow'") &&
      nextConfigSource.includes("source: '/osiedle-:slug'"),
  },
  {
    name: 'Old clinic branding and risky claims are blocked',
    pass: blockedMatches.length === 0,
  },
];

const failed = checks.filter((c) => !c.pass);
for (const check of checks) {
  console.log(`${check.pass ? '✓' : '✗'} ${check.name}`);
}

if (failed.length > 0) {
  if (blockedMatches.length > 0) {
    console.error('\nBlocked copy found:');
    for (const match of blockedMatches) console.error(`- ${match}`);
  }
  process.exit(1);
}

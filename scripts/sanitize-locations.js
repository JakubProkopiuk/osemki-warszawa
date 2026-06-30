/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');

const URSYNOW_CLINIC_LABEL = 'rejon Metra Ursynów';
const ORGANIZATION_COPY =
  'Szczegóły organizacyjne wizyty są potwierdzane podczas kontaktu zwrotnego.';
const TRANSPORT_COPY =
  'Najwygodniejsza organizacja wizyty jest ustalana podczas kontaktu zwrotnego.';

const candidatePaths = [
  path.join(process.cwd(), 'data', 'locations.json'),
  path.join(process.cwd(), 'src', 'data', 'locations.json'),
];

const locationsPath = candidatePaths.find((filePath) => fs.existsSync(filePath));

if (!locationsPath) {
  throw new Error('Nie znaleziono pliku locations.json (sprawdzono: data/ oraz src/data/).');
}

const normalize = (value = '') =>
  value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l');

const ursynowKeywords = ['ursynow', 'kabaty', 'natolin', 'imielin', 'stoklosy'];
const blockedAreaKeywords = [
  'piaseczno',
  'konstancin',
  'lesznowola',
  'iwiczna',
  'jozefoslaw',
  'ustanow',
  'zalesie',
  'mokotow',
  'wilanow',
  'sadyba',
  'wierzbno',
  'powsin',
  'zawady',
  'sluzewiec',
  'sluzewiecka',
];
const maxTimePatterns = [/40\s*min/i, /45\s*min/i, /50\s*min/i, />/];
const farVillagePattern =
  /(gmina|wies|wieś|kolonia|folwark|przysi[oó]lek|osada|za[sś]cianek|maly|mały|duzy|duży)/i;

const raw = fs.readFileSync(locationsPath, 'utf-8');
const locations = JSON.parse(raw);

const sanitized = locations
  .filter((location) => {
    const slug = normalize(location.slug);
    const name = normalize(location.nazwa_lokalizacji);
    const hubSlug = normalize(location.hubSlug);
    const hubName = normalize(location.hubName);
    const clinic = normalize(location.klinika);
    const haystack = `${slug} ${name} ${hubSlug} ${hubName} ${clinic}`;

    if (blockedAreaKeywords.some((keyword) => haystack.includes(keyword))) return false;

    return hubSlug === 'ursynow' || ursynowKeywords.some((keyword) => haystack.includes(keyword));
  })
  .map((location) => {
    const safeLocation = { ...location };
    delete safeLocation.reviews;
    delete safeLocation.faq;

    return {
      ...safeLocation,
      klinika: URSYNOW_CLINIC_LABEL,
      czas_dojazdu: 'zależnie od lokalizacji',
      punkt_orientacyjny: location.punkt_orientacyjny || 'Metro Ursynów',
      komunikacja: TRANSPORT_COPY,
      parking: ORGANIZATION_COPY,
      hubSlug: 'ursynow',
      hubName: 'Ursynów',
      displayName: location.displayName || location.nazwa_lokalizacji,
    };
  })
  .filter((location) => {
    const travelTime = String(location.czas_dojazdu || '');
    const timeBlocked = maxTimePatterns.some((pattern) => pattern.test(travelTime));
    if (timeBlocked) return false;

    const text = `${location.slug || ''} ${location.nazwa_lokalizacji || ''}`;
    if (farVillagePattern.test(normalize(text))) return false;

    return true;
  });

fs.writeFileSync(locationsPath, `${JSON.stringify(sanitized, null, 2)}\n`, 'utf-8');

console.log(
  `Sanityzacja zakończona. Plik: ${path.relative(process.cwd(), locationsPath)}. Rekordy: ${locations.length} -> ${sanitized.length}.`,
);

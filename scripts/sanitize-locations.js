import fs from 'node:fs';
import path from 'node:path';

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
const ochotaKeywords = ['ochota', 'szczesliwice', 'rakowiec'];
const maxTimePatterns = [/40\s*min/i, /45\s*min/i, /50\s*min/i, />/];
const farVillagePattern =
  /(gmina|wies|wieś|kolonia|folwark|przysi[oó]lek|osada|za[sś]cianek|maly|mały|duzy|duży)/i;

const raw = fs.readFileSync(locationsPath, 'utf-8');
const locations = JSON.parse(raw);

const sanitized = locations
  .map((location) => {
    const slug = normalize(location.slug);
    const name = normalize(location.nazwa_lokalizacji);
    const haystack = `${slug} ${name}`;

    if ((slug.includes('metro') && slug.includes('ursynow')) || haystack.includes('metro ursynow')) {
      return {
        ...location,
        czas_dojazdu: '1 min',
        klinika: 'al. KEN 96',
      };
    }

    if (ursynowKeywords.some((keyword) => haystack.includes(keyword))) {
      return { ...location, klinika: 'al. KEN 96' };
    }

    if (ochotaKeywords.some((keyword) => haystack.includes(keyword))) {
      return { ...location, klinika: 'ul. Pruszkowska 6b' };
    }

    return location;
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

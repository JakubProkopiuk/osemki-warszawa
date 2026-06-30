import fs from 'node:fs';

const filePath = new URL('../src/data/locations.json', import.meta.url);
const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const data = rawData.filter((loc) => loc.hubSlug === 'ursynow');

const hashSlug = (slug) =>
  slug.split('').reduce((acc, char) => (acc * 33 + char.charCodeAt(0)) >>> 0, 17);

for (const loc of data) {
  const base = { lat: 52.1509, lng: 21.0485, hubSlug: 'ursynow', hubName: 'Ursynów' };
  const hash = hashSlug(loc.slug);
  const latOffset = ((hash % 400) - 200) / 10000;
  const lngOffset = ((((hash / 400) | 0) % 400) - 200) / 10000;

  loc.klinika = 'rejon Metra Ursynów';
  loc.czas_dojazdu = loc.czas_dojazdu || 'zależnie od lokalizacji';
  loc.punkt_orientacyjny = loc.punkt_orientacyjny || 'Metro Ursynów';
  loc.komunikacja = 'Najwygodniejsza organizacja wizyty jest ustalana podczas kontaktu zwrotnego.';
  loc.parking = 'Szczegóły organizacyjne wizyty są potwierdzane podczas kontaktu zwrotnego.';
  delete loc.reviews;
  delete loc.faq;
  loc.lat = loc.lat ?? Number((base.lat + latOffset).toFixed(6));
  loc.lng = loc.lng ?? Number((base.lng + lngOffset).toFixed(6));
  loc.searchVolume = loc.searchVolume ?? (200 + (hash % 800));
  loc.hubSlug = loc.hubSlug ?? base.hubSlug;
  loc.hubName = loc.hubName ?? base.hubName;
  loc.displayName = loc.displayName ?? loc.nazwa_lokalizacji;
}

fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Enriched ${data.length} locations.`);

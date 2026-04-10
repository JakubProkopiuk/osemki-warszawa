import fs from 'node:fs';

const filePath = new URL('../src/data/locations.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const hashSlug = (slug) =>
  slug.split('').reduce((acc, char) => (acc * 33 + char.charCodeAt(0)) >>> 0, 17);

for (const loc of data) {
  const base = loc.klinika.includes('Pruszkowska')
    ? { lat: 52.2092, lng: 20.9692, hubSlug: 'ochota', hubName: 'Ochota' }
    : { lat: 52.1509, lng: 21.0485, hubSlug: 'ursynow', hubName: 'Ursynów' };
  const hash = hashSlug(loc.slug);
  const latOffset = ((hash % 400) - 200) / 10000;
  const lngOffset = ((((hash / 400) | 0) % 400) - 200) / 10000;

  loc.lat = loc.lat ?? Number((base.lat + latOffset).toFixed(6));
  loc.lng = loc.lng ?? Number((base.lng + lngOffset).toFixed(6));
  loc.searchVolume = loc.searchVolume ?? (200 + (hash % 800));
  loc.hubSlug = loc.hubSlug ?? base.hubSlug;
  loc.hubName = loc.hubName ?? base.hubName;
  loc.displayName = loc.displayName ?? loc.nazwa_lokalizacji;
  loc.faq =
    loc.faq ?? [
      {
        question: 'Czy zabieg będzie bolesny?',
        answer:
          'Stosujemy zaawansowane znieczulenie miejscowe, dzięki czemu sam zabieg jest bezbolesny.',
      },
      {
        question: 'Czy muszę mieć skierowanie lub RTG?',
        answer:
          'Nie potrzebujesz skierowania. Jeśli nie masz aktualnego zdjęcia, wykonamy diagnostykę na miejscu.',
      },
    ];
}

fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Enriched ${data.length} locations.`);


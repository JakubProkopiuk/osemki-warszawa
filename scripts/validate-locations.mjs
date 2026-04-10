import fs from 'node:fs';

const filePath = new URL('../src/data/locations.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const required = ['slug', 'nazwa_lokalizacji', 'klinika', 'lat', 'lng', 'searchVolume', 'hubSlug', 'hubName'];

let errors = 0;
for (const loc of data) {
  for (const key of required) {
    if (loc[key] === undefined || loc[key] === null || loc[key] === '') {
      console.error(`Missing ${key} for ${loc.slug}`);
      errors += 1;
    }
  }
}

if (errors > 0) {
  process.exit(1);
}

console.log(`Validated ${data.length} locations.`);


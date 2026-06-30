/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');

const config = {
  clinic: 'rejon Metra Ursynów',
  district: 'Ursynów',
  landmarks: ['Metra Ursynów', 'Metra Imielin', 'Lasu Kabackiego', 'SGGW'],
  areas: [
    'Ursynów',
    'Kabaty',
    'Natolin',
    'Imielin',
    'Stokłosy',
    'Ursynów Północny',
    'Ursynów Centrum',
    'Kabaty Leśne',
    'Natolin Północny',
    'Natolin Wschodni',
    'Zielony Ursynów',
    'Pyry',
    'Grabów',
    'Jeziorki',
    'Jary',
  ],
};

const ursynowStreets = [
  'Komisji Edukacji Narodowej',
  'Indiry Gandhi',
  'Cynamonowa',
  'Dereniowa',
  'Rosoła',
  'Płaskowickiej',
  'Belgradzka',
  'Wąwozowa',
  'Pileckiego',
  'Roentgena',
  'Stryjeńskich',
  'Zaruby',
  'Relaksowa',
  'Kabacki Dukt',
  'Mielczarskiego',
  'Raabego',
  'Lokajskiego',
  'Lanciego',
  'Migdałowa',
  'Lisi Jar',
  'Małej Łąki',
  'Moczydłowska',
  'Wełniana',
  'Kiedacza',
  'Nugat',
  'Kłobucka',
  'Jurajska',
  'Trombity',
  'Gawota',
  'Gąsek',
  'Baletowa',
  'Wokalna',
  'Krasnowolska',
  'Poloneza',
  'Taneczna',
  'Pląsy',
  'Wiolinowa',
  'Surowieckiego',
  'Herbsta',
  'Romera',
  'Pięciolinii',
  'Nutki',
  'Symfonii',
  'Dembowskiego',
  'Puszczyka',
  'Kopcińskiego',
  'Szolca-Rogozińskiego',
  'Hirszfelda',
  'Beli Bartoka',
  'Jastrzębowskiego',
  'Kazury',
  'Na Uboczu',
  'Warchałowskiego',
  'Rzymowskiego',
  'Puławska',
  'Nowoursynowska',
  'Ciszewskiego',
  'Pasaż Ursynowski',
  'Przy Bażantarni',
  'Kulczyńskiego',
  'Jeżewskiego',
  'Alternatywy',
  'Roentgena',
  'Służby Polsce',
  'Makolągwy',
  'Łukaszewicza',
  'Szumiąca',
  'Kormoranów',
  'Kądziołeczki',
  'Bociania',
  'Raniuszka',
  'Pustułeczki',
  'Mysikrólika',
  'Bogatki',
  'Głuszca',
  'Bielika',
  'Cietrzewia',
  'Rudzika',
  'Czapli',
  'Perkoza',
  'Jerzyka',
  'Kulczyka',
  'Łabędzia',
  'Rybitwy',
  'Bekasa',
  'Bataliona',
  'Mewy',
  'Rycyka',
  'Kwika',
  'Gęsia',
  'Sójki',
  'Derdowskiego',
  'Pachnąca',
  'Dzierzby',
  'Ruczaj',
  'Opieńki',
  'Prawdziwka',
  'Kani',
  'Kurki',
  'Rydza',
  'Maślaka',
  'Mleczna',
  'Kokosowa',
  'Orszady',
  'Imbirowa',
  'Anyżowa',
  'Arbuzowa',
  'Braci Wagów',
  'Sengera',
  'Meander',
  'Kazubów',
  'Mandarynki',
  'Laskowa',
  'Boczniaków',
  'Karczunkowska',
  'Korbońskiego',
  'Syta',
  'Zaściankowa',
  'Bruzdowa',
  'Vogla',
  'Gubinowska',
  'Bielawska',
  'Ruczajowa',
  'Pielgrzymów',
  'Muchomora',
];

const generateSlug = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

const hashSlug = (slug) =>
  slug.split('').reduce((acc, char) => (acc * 33 + char.charCodeAt(0)) >>> 0, 17);

const buildLocation = (name, landmark) => {
  const slug = generateSlug(name);
  const hash = hashSlug(slug);
  const latOffset = ((hash % 400) - 200) / 10000;
  const lngOffset = ((((hash / 400) | 0) % 400) - 200) / 10000;

  return {
    slug,
    nazwa_lokalizacji: name,
    klinika: config.clinic,
    czas_dojazdu: 'zależnie od lokalizacji',
    punkt_orientacyjny: landmark,
    komunikacja: 'Najwygodniejsza organizacja wizyty jest ustalana podczas kontaktu zwrotnego.',
    parking: 'Szczegóły organizacyjne wizyty są potwierdzane podczas kontaktu zwrotnego.',
    lat: Number((52.1509 + latOffset).toFixed(6)),
    lng: Number((21.0485 + lngOffset).toFixed(6)),
    searchVolume: 200 + (hash % 800),
    hubSlug: 'ursynow',
    hubName: config.district,
    displayName: name,
  };
};

const locations = [
  ...config.areas.map((area) => buildLocation(area, config.landmarks[0])),
  ...ursynowStreets.map((street, index) =>
    buildLocation(`ul. ${street}`, config.landmarks[index % config.landmarks.length]),
  ),
];

const uniqueLocations = Array.from(new Map(locations.map((item) => [item.slug, item])).values());

fs.writeFileSync('./src/data/locations.json', `${JSON.stringify(uniqueLocations, null, 2)}\n`);
console.log(`Wygenerowano ${uniqueLocations.length} lokalizacji Ursynowa.`);

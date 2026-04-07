const fs = require('fs');

// Baza naszych Fazy 1 - Główne dzielnice i sypialnie Warszawy
const rawLocations = [
  // PRZYPISANE DO OCHOTY (Klinika na Pruszkowskiej)
  { name: 'Wola', nearest: 'Ochota', time: '12 minut', landmark: 'Ronda Daszyńskiego' },
  { name: 'Bemowo', nearest: 'Ochota', time: '15 minut', landmark: 'Ratusza Bemowo' },
  { name: 'Włochy', nearest: 'Ochota', time: '8 minut', landmark: 'Parku ze Stawami Cietrzewia' },
  { name: 'Śródmieście', nearest: 'Ochota', time: '14 minut', landmark: 'Dworca Centralnego' },
  { name: 'Pruszków', nearest: 'Ochota', time: '22 minuty', landmark: 'stacji PKP Pruszków' },
  { name: 'Ursus', nearest: 'Ochota', time: '16 minut', landmark: 'Factory Ursus' },
  { name: 'Rakowiec', nearest: 'Ochota', time: '2 minuty pieszo', landmark: 'Parku Zasława Malickiego' },

  // PRZYPISANE DO URSYNOWA (Klinika na KEN)
  { name: 'Mokotów', nearest: 'Ursynów', time: '10 minut', landmark: 'Galerii Mokotów' },
  { name: 'Wilanów', nearest: 'Ursynów', time: '12 minut', landmark: 'Miasteczka Wilanów' },
  { name: 'Kabaty', nearest: 'Ursynów', time: '5 minut', landmark: 'stacji Metro Kabaty' },
  { name: 'Metro Imielin', nearest: 'Ursynów', time: '1 minuta pieszo', landmark: 'Multikina Ursynów' },
  { name: 'Piaseczno', nearest: 'Ursynów', time: '18 minut', landmark: 'stacji PKP Piaseczno' },
  { name: 'Konstancin-Jeziorna', nearest: 'Ursynów', time: '20 minut', landmark: 'Parku Zdrojowego' },
  { name: 'Góra Kalwaria', nearest: 'Ursynów', time: '35 minut', landmark: 'rynku miejskiego' }
];

const generateSlug = (text) => {
  return text.toLowerCase()
    .replace(/[ł]/g, 'l')
    .replace(/[ś]/g, 's')
    .replace(/[ć]/g, 'c')
    .replace(/[ń]/g, 'n')
    .replace(/[ó]/g, 'o')
    .replace(/[żź]/g, 'z')
    .replace(/[ą]/g, 'a')
    .replace(/[ę]/g, 'e')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '');
};

const processedLocations = rawLocations.map(loc => {
  const isOchota = loc.nearest === 'Ochota';
  return {
    slug: generateSlug(loc.name),
    nazwa_lokalizacji: loc.name,
    klinika: isOchota ? 'Pruszkowska 6b' : 'KEN 96',
    czas_dojazdu: loc.time,
    punkt_orientacyjny: loc.landmark
  };
});

// Zapisz do pliku
const outputPath = './src/data/locations.json';
fs.writeFileSync(outputPath, JSON.stringify(processedLocations, null, 2));

console.log(`✅ Wygenerowano ${processedLocations.length} unikalnych lokalizacji! Zapisano w: ${outputPath}`);
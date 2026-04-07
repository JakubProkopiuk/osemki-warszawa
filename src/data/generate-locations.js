const fs = require('fs');

const config = {
  ochota: {
    clinic: 'Pruszkowska 6b',
    district: 'Ochota',
    landmarks: ['Pola Mokotowskiego', 'Parku Szczęśliwickiego', 'Hali Kopińskiej', 'Placu Narutowicza', 'Dworca Zachodniego'],
    areas: ['Rakowiec', 'Szczęśliwice', 'Włochy', 'Wola', 'Pruszków', 'Ursus', 'Bemowo', 'Śródmieście']
  },
  ursynow: {
    clinic: 'KEN 96',
    district: 'Ursynów',
    landmarks: ['Metra Imielin', 'Lasu Kabackiego', 'Multikina Ursynów', 'SGGW', 'Alei KEN'],
    areas: ['Mokotów', 'Wilanów', 'Kabaty', 'Natolin', 'Stokłosy', 'Piaseczno', 'Konstancin']
  }
};

const generateSlug = (text) => {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[ł]/g, 'l').replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
};

let locations = [];

// Tu możesz wkleić listę 1000 ulic z Warszawy, a skrypt je przemieli
const baseStreets = ['Grójecka', 'Puławska', 'Banacha', 'Żwirki i Wigury', 'Dickensa', 'Indiry Gandhi', 'Cynamonowa'];

// 1. Generujemy Dzielnice
Object.entries(config).forEach(([key, val]) => {
  val.areas.forEach(area => {
    locations.push({
      slug: generateSlug(area),
      nazwa_lokalizacji: area,
      klinika: val.clinic,
      czas_dojazdu: `${Math.floor(Math.random() * 15) + 2} minut`,
      landmark: val.landmarks[Math.floor(Math.random() * val.landmarks.length)]
    });
  });
});

// 2. Generujemy Ulice (Skalowanie)
baseStreets.forEach(street => {
  const isUrsynow = street.includes('KEN') || street.includes('Gandhi');
  const context = isUrsynow ? config.ursynow : config.ochota;
  
  locations.push({
    slug: generateSlug(`ulica-${street}`),
    nazwa_lokalizacji: `ul. ${street}`,
    klinika: context.clinic,
    czas_dojazdu: `${Math.floor(Math.random() * 8) + 3} minuty`,
    landmark: context.landmarks[0]
  });
});

fs.writeFileSync('./src/data/locations.json', JSON.stringify(locations, null, 2));
console.log(`✅ Wygenerowano ${locations.length} unikalnych ścieżek!`);
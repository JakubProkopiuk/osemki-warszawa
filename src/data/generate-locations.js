const fs = require('fs');

const config = {
  ochota: {
    clinic: 'Pruszkowska 6b',
    district: 'Ochota',
    landmarks: ['Pola Mokotowskiego', 'Parku Szczęśliwickiego', 'Hali Kopińskiej', 'Placu Narutowicza', 'Atrium Reduta'],
    // Dodałem 'Ochota' tutaj:
    areas: ['Ochota', 'Rakowiec', 'Szczęśliwice', 'Włochy', 'Wola', 'Pruszków', 'Ursus', 'Bemowo', 'Śródmieście']
  },
  ursynow: {
    clinic: 'KEN 96',
    district: 'Ursynów',
    landmarks: ['Metra Imielin', 'Lasu Kabackiego', 'Multikina Ursynów', 'Alei KEN', 'Galerii Ursynów'],
    // Dodałem 'Ursynów' tutaj:
    areas: ['Ursynów', 'Mokotów', 'Wilanów', 'Kabaty', 'Natolin', 'Stokłosy', 'Piaseczno']
  }
};

const reviewPool = [
  { author: "Marek W.", text: "Pełen profesjonalizm. Ósemka usunięta w 15 minut, bez żadnego bólu. Polecam!", rating: 5 },
  { author: "Katarzyna Z.", text: "Bardzo bałam się zabiegu, ale dr Sturska ma niesamowite podejście.", rating: 5 },
  { author: "Tomasz R.", text: "Najlepszy chirurg w Warszawie. Szybko, konkretnie i bezboleśnie.", rating: 5 },
  { author: "Magdalena L.", text: "Gabinet na najwyższym poziomie. Nowoczesny sprzęt i świetna atmosfera.", rating: 5 }
];

const generateSlug = (text) => {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, 'l').replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
};

const getRandomReviews = (pool, count) => {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const baseStreets = [
  'Grójecka', 'Żwirki i Wigury', 'Banacha', 'Dickensa', 'Korotyńskiego', 'Bitwy Warszawskiej', 'Al. Jerozolimskie', 
  'Al. KEN', 'Indiry Gandhi', 'Cynamonowa', 'Dereniowa', 'Rosoła', 'Puławska', 'Belgradzka', 'Wąwozowa'
];

let locations = [];

// 1. GENERUJEMY OBSZARY (Super krótkie czasy)
Object.entries(config).forEach(([key, val]) => {
  val.areas.forEach(area => {
    locations.push({
      slug: generateSlug(area),
      nazwa_lokalizacji: area === 'Ochota' || area === 'Ursynów' ? `Klinika ${area}` : area,
      klinika: val.clinic,
      // Dla samej dzielnicy/bliskiego osiedla dajemy 1-3 minuty
      czas_dojazdu: `${Math.floor(Math.random() * 3) + 1} minuty`, 
      punkt_orientacyjny: val.landmarks[0],
      reviews: getRandomReviews(reviewPool, 3)
    });
  });
});

// 2. GENERUJEMY ULICE (Realistyczne czasy 4-8 min)
baseStreets.forEach(street => {
  const isUrsynow = ['KEN', 'Gandhi', 'Cynamonowa', 'Belgradzka', 'Wąwozowa', 'Rosoła'].some(kw => street.includes(kw));
  const context = isUrsynow ? config.ursynow : config.ochota;
  
  locations.push({
    slug: generateSlug(`ulica-${street}`),
    nazwa_lokalizacji: `ul. ${street}`,
    klinika: context.clinic,
    czas_dojazdu: `${Math.floor(Math.random() * 5) + 4} minut`, 
    punkt_orientacyjny: context.landmarks[Math.floor(Math.random() * context.landmarks.length)],
    reviews: getRandomReviews(reviewPool, 3)
  });
});

fs.writeFileSync('./src/data/locations.json', JSON.stringify(locations, null, 2));
console.log(`✅ Wygenerowano ${locations.length} lokalizacji.`);
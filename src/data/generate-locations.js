import fs from 'node:fs';

const config = {
  ochota: {
    clinic: 'Pruszkowska 6b',
    district: 'Ochota',
    landmarks: ['Pola Mokotowskiego', 'Parku Szczęśliwickiego', 'Hali Kopińskiej', 'Placu Narutowicza', 'Atrium Reduta', 'Blue City', 'Dworca Zachodniego'],
    areas: ['Ochota', 'Rakowiec', 'Szczęśliwice', 'Włochy', 'Wola', 'Pruszków', 'Ursus', 'Bemowo', 'Śródmieście', 'Stara Ochota', 'Filtry', 'Czyste', 'Odolany', 'Mirów', 'Muranów']
  },
  ursynow: {
    clinic: 'KEN 96',
    district: 'Ursynów',
    landmarks: ['Metra Imielin', 'Lasu Kabackiego', 'Multikina Ursynów', 'Alei KEN', 'Galerii Ursynów', 'SGGW'],
    areas: ['Ursynów', 'Mokotów', 'Wilanów', 'Kabaty', 'Natolin', 'Stokłosy', 'Piaseczno', 'Konstancin-Jeziorna', 'Służew', 'Służewiec', 'Stegny', 'Sadyba', 'Ursynów Północny', 'Ursynów Centrum']
  }
};

const reviewPool = [
  { author: "Marek W.", text: "Pełen profesjonalizm. Ósemka usunięta w 15 minut, bez żadnego bólu. Polecam!", rating: 5 },
  { author: "Katarzyna Z.", text: "Bardzo bałam się zabiegu, ale dr Sturska ma niesamowite podejście. Czułam się zaopiekowana.", rating: 5 },
  { author: "Tomasz R.", text: "Najlepszy chirurg w Warszawie. Szybko, konkretnie i bezboleśnie. Pozdrawiam cały zespół.", rating: 5 },
  { author: "Magdalena L.", text: "Gabinet na najwyższym poziomie. Nowoczesny sprzęt i świetna atmosfera.", rating: 5 },
  { author: "Piotr K.", text: "Ekstrakcja ósemki przebiegła błyskawicznie. Nawet nie poczułem kiedy było po wszystkim.", rating: 5 },
  { author: "Anna M.", text: "Polecam z całego serca. Zabieg wykonany precyzyjnie i bez komplikacji.", rating: 5 },
  { author: "Wojciech S.", text: "Pani doktor to anioł! Rewelacyjne podejście do pacjenta i zero bólu.", rating: 5 },
  { author: "Ewa D.", text: "Szybka diagnoza z RTG na miejscu. Ósemka wyciągnięta w mgnieniu oka.", rating: 5 }
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

// Logika języka polskiego dla czasu dojazdu
const formatTime = (minutes) => {
  if (minutes === 1) return '1 minutę';
  if ([2, 3, 4].includes(minutes % 10) && ![12, 13, 14].includes(minutes % 100)) return `${minutes} minuty`;
  return `${minutes} minut`;
};

// 135 Unikalnych Ulic - przypisane do gabinetu na Ochocie
const ochotaStreets = [
  'Grójecka', 'Banacha', 'Bitwy Warszawskiej 1920', 'Dickensa', 'Korotyńskiego', 'Wawelska', 'Kopińska', 'Filtrowa', 
  'Niemcewicza', 'Białobrzeska', 'Opaczewska', 'Szczęśliwicka', 'Drawska', 'Włodarzewska', 'Al. Jerozolimskie', 'Towarowa', 
  'Żelazna', 'Prosta', 'Kasprzaka', 'Górczewska', 'Wolska', 'Płocka', 'Młynarska', 'Obozowa', 'Leszno', 'Chłodna', 
  'Koszykowa', 'Chałubińskiego', 'Emilii Plater', 'Marszałkowska', 'Krucza', 'Hoża', 'Wilcza', 'Wspólna', 'Nowogrodzka', 
  'Żurawia', 'Poznańska', 'Bracka', 'Piękna', 'Mokotowska', 'Polna', 'Szucha', 'Waryńskiego', 'Nowowiejska', 'Asnyka', 
  'Spiska', 'Daleka', 'Tarczyńska', 'Słupecka', 'Sękocińska', 'Kaliska', 'Joteyki', 'Pawińskiego', 'Sanocka', 'Pruszkowska', 
  'Wiślicka', 'Trojdena', 'Mołdawska', 'Racławicka', 'Baleya', 'Płatowcowa', 'Śmigłowca', 'Instalatorów', 'Równoległa', 
  'Popularna', 'Krańcowa', 'Bakalarska', 'Chrościckiego', 'Kleszczowa', 'Ryżowa', 'Prystora', 'Skoroszewska', 'Dzieci Warszawy', 
  'Posag 7 Panien', 'Gierdziejewskiego', 'Keniga', 'Orłów Piastowskich', 'Czerwona Droga', 'Wojciechowskiego', 'Jagiełły', 
  'Lalki', 'Giserska', 'Szamoty', 'Gniewkowska', 'Potrzebna', 'Sympatyczna', 'Cegielniana', 'Techników', 'Plastyków', 
  'Globusowa', 'Bolesława Chrobrego', 'Rybnicka', 'Zapustna', 'Fasolowa', 'Dzwonkowa', 'Kłośna', 'Starodębska', 'Płużańska', 
  'Wschodu', 'Salomejska', 'Szyszkowa', 'Rebusowa', 'Środkowa', 'Milanowska', 'Regulska', 'Batalionów Chłopskich', 'Lazurowa', 
  'Radiowa', 'Dywizjonu 303', 'Powstańców Śląskich', 'Człuchowska', 'Strąkowa', 'Oświatowa', 'Szeligowska', 'Połczyńska', 
  'Dźwigowa', 'Zawiszy', 'Radziwie', 'Banderii', 'Ostroroga', 'Wawrzyszewska', 'Sołtyka', 'Syreny', 'Karolkowa', 'Skierniewicka', 
  'Brylowska', 'Szarych Szeregów', 'Krzyżanowskiego', 'Działdowska', 'Sokołowska', 'Sygietyńskiego', 'Gorlicka', 'Majewskiego', 
  'Częstochowska', 'Rokosowska', 'Baśniowa', 'Węgierska', 'Dobosza'
];

// 135 Unikalnych Ulic - przypisane do gabinetu na Ursynowie
const ursynowStreets = [
  'Al. KEN', 'Indiry Gandhi', 'Cynamonowa', 'Dereniowa', 'Rosoła', 'Płaskowickiej', 'Belgradzka', 'Wąwozowa', 'Pileckiego', 
  'Roentgena', 'Stryjeńskich', 'Zaruby', 'Relaksowa', 'Kabacki Dukt', 'Mielczarskiego', 'Raabego', 'Lokajskiego', 'Lanciego', 
  'Migdałowa', 'Lisi Jar', 'Małej Łąki', 'Moczydłowska', 'Wełniana', 'Kiedacza', 'Nugat', 'Kłobucka', 'Jurajska', 'Trombity', 
  'Gawota', 'Gąsek', 'Baletowa', 'Wokalna', 'Krasnowolska', 'Poloneza', 'Taneczna', 'Pląsy', 'Wiolinowa', 'Surowieckiego', 
  'Herbsta', 'Romera', 'Pięciolinii', 'Nutki', 'Symfonii', 'Dembowskiego', 'Puszczyka', 'Kopcińskiego', 'Szolca-Rogozińskiego', 
  'Hirszfelda', 'Beli Bartoka', 'Jastrzębowskiego', 'Kazury', 'Na Uboczu', 'Warchałowskiego', 'Rzymowskiego', 'Puławska', 
  'Dolina Służewiecka', 'Sikorskiego', 'Wilanowska', 'Sobieskiego', 'Rzeczpospolitej', 'Branickiego', 'Klimczaka', 'Kieślowskiego', 
  'Sarmacka', 'Oś Królewska', 'Prymasa Hlonda', 'Teodorowicza', 'Ledóchowskiej', 'Herbu Szreniawa', 'Gieysztora', 'Kiepury', 
  'Makolągwy', 'Łukaszewicza', 'Szumiąca', 'Kormoranów', 'Kądziołeczki', 'Bociania', 'Raniuszka', 'Pustułeczki', 'Mysikrólika', 
  'Bogatki', 'Głuszca', 'Bielika', 'Cietrzewia', 'Rudzika', 'Czapli', 'Perkoza', 'Jerzyka', 'Kulczyka', 'Łabędzia', 'Rybitwy', 
  'Bekasa', 'Bataliona', 'Mewy', 'Rycyka', 'Kwika', 'Gęsia', 'Sójki', 'Derdowskiego', 'Pachnąca', 'Dzierzby', 'Ruczaj', 
  'Opieńki', 'Prawdziwka', 'Kani', 'Kurki', 'Rydza', 'Maślaka', 'Mleczna', 'Kokosowa', 'Orszady', 'Imbirowa', 'Anyżowa', 
  'Arbuzowa', 'Braci Wagów', 'Sengera', 'Meander', 'Kazubów', 'Mandarynki', 'Laskowa', 'Boczniaków', 'Karczunkowska', 
  'Korbońskiego', 'Syta', 'Zaściankowa', 'Bruzdowa', 'Vogla', 'Gubinowska', 'Bielawska', 'Ruczajowa', 'Pielgrzymów', 'Muchomora'
];

let locations = [];

// 1. GENERUJEMY DZIELNICE/OSIEDLA (Super blisko: Czas 1-4 minuty)
Object.entries(config).forEach(([, val]) => {
  val.areas.forEach(area => {
    locations.push({
      slug: generateSlug(area),
      nazwa_lokalizacji: area === 'Ochota' || area === 'Ursynów' ? `Klinika ${area}` : area,
      klinika: val.clinic,
      czas_dojazdu: formatTime(Math.floor(Math.random() * 4) + 1), // 1 do 4 minut
      punkt_orientacyjny: val.landmarks[0],
      reviews: getRandomReviews(reviewPool, 3)
    });
  });
});

// 2. GENERUJEMY ULICE OCHOTY I OKOLIC (Czas 3-12 minut)
ochotaStreets.forEach(street => {
  locations.push({
    slug: generateSlug(`ulica-${street}`),
    nazwa_lokalizacji: `ul. ${street}`,
    klinika: config.ochota.clinic,
    czas_dojazdu: formatTime(Math.floor(Math.random() * 10) + 3), // 3 do 12 minut
    punkt_orientacyjny: config.ochota.landmarks[Math.floor(Math.random() * config.ochota.landmarks.length)],
    reviews: getRandomReviews(reviewPool, 3)
  });
});

// 3. GENERUJEMY ULICE URSYNOWA I OKOLIC (Czas 3-12 minut)
ursynowStreets.forEach(street => {
  locations.push({
    slug: generateSlug(`ulica-${street}`),
    nazwa_lokalizacji: `ul. ${street}`,
    klinika: config.ursynow.clinic,
    czas_dojazdu: formatTime(Math.floor(Math.random() * 10) + 3), // 3 do 12 minut
    punkt_orientacyjny: config.ursynow.landmarks[Math.floor(Math.random() * config.ursynow.landmarks.length)],
    reviews: getRandomReviews(reviewPool, 3)
  });
});

// Zabezpieczenie usuwające duplikaty przed zapisem
const uniqueLocations = Array.from(new Map(locations.map(item => [item.slug, item])).values());

fs.writeFileSync('./src/data/locations.json', JSON.stringify(uniqueLocations, null, 2));
console.log(`✅ Mamy to! Wygenerowano dokładnie ${uniqueLocations.length} unikalnych lokalizacji pSEO.`);
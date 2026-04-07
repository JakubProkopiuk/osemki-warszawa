import { notFound } from 'next/navigation';
import LocationClient from './LocationClient';
import locations from '../../data/locations.json';

// 1. TYPY DANYCH - Zgodne z naszym nowym skryptem generatora
type LocationData = {
  slug: string;
  nazwa_lokalizacji: string;
  klinika: string;
  czas_dojazdu: string;
  punkt_orientacyjny: string; // To jest nasz klucz do unikalności SEO
  dzielnica?: string;
};

// 2. GENEROWANIE METADANYCH DLA GOOGLE (Dynamiczne SEO)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const location = (locations as LocationData[]).find((l) => l.slug === resolvedParams.slug);

  if (!location) return { title: 'Lokalizacja nie znaleziona' };

  const isOchota = location.klinika.includes('Pruszkowska');
  const dzielnicaGlowna = isOchota ? 'Ochota' : 'Ursynów';
  
  // Tworzymy unikalny tytuł, który przyciąga wzrok w wyszukiwarce
  return {
    title: `Usuwanie Ósemek ${location.nazwa_lokalizacji} | Bezboleśnie | Chirurgia ${dzielnicaGlowna}`,
    description: `Boli Cię ząb mądrości w okolicy: ${location.nazwa_lokalizacji}? Profesjonalna chirurgia blisko ${location.punkt_orientacyjny}. Sprawdź wolne terminy i dotrzyj do nas w ${location.czas_dojazdu}!`,
    alternates: {
      canonical: `https://www.osemki-warszawa.pl/${location.slug}`,
    },
    // Meta tagi dla social media, żeby linki na FB wyglądały pro
    openGraph: {
      title: `Chirurgiczne Usuwanie Ósemek - ${location.nazwa_lokalizacji}`,
      description: `Bezbolesne zabiegi blisko ${location.punkt_orientacyjny}. Zapisz się już dziś!`,
      url: `https://www.osemki-warszawa.pl/${location.slug}`,
      siteName: 'Ochota na Uśmiech',
      locale: 'pl_PL',
      type: 'website',
    },
  };
}

// 3. GENEROWANIE STATYCZNYCH ŚCIEŻEK (Dla szybkości Vercela)
export async function generateStaticParams() {
  return locations.map((loc) => ({
    slug: loc.slug,
  }));
}

// 4. KOMPONENT STRONY
export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const locationData = (locations as LocationData[]).find((loc) => loc.slug === resolvedParams.slug);

  if (!locationData) {
    return notFound();
  }

  // Przekazujemy dane do LocationClient, który zajmie się wyglądem
  return <LocationClient locationData={locationData} />;
}
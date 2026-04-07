import { notFound } from 'next/navigation';
import LocationClient from './LocationClient';
import locations from '../../data/locations.json';

// 1. DEFINIUJEMY TYP DANYCH (To uciszy błąd TypeScripta)
type LocationData = {
  slug: string;
  nazwa_lokalizacji: string;
  klinika: string;
  czas_dojazdu: string;
  punkt_orientacyjny: string;
  dzielnica?: string; // Opcjonalne, w razie gdyby został stary wpis
};

// 2. TWORZYMY UNIKALNE TYTUŁY DLA GOOGLE
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // Wymuszamy na TypeScripcie użycie naszego typu
  const locationData = locations.find((loc) => loc.slug === resolvedParams.slug) as LocationData | undefined;

  if (!locationData) return {};

  // Zabezpieczenie: jeśli brakuje punktu orientacyjnego, użyj nazwy lokalizacji
  const punkt = locationData.punkt_orientacyjny || locationData.nazwa_lokalizacji;

  return {
    title: `Usuwanie Ósemek Warszawa ${locationData.nazwa_lokalizacji} | Chirurg Stomatolog`,
    description: `Szukasz chirurga blisko ${punkt}? Profesjonalne i bezbolesne usuwanie ósemek. Dojazd z ${locationData.nazwa_lokalizacji} w ${locationData.czas_dojazdu}.`,
  };
}

// 3. GENERUJEMY ŚCIEŻKI
export async function generateStaticParams() {
  return locations.map((loc) => ({
    slug: loc.slug,
  }));
}

// 4. GŁÓWNY WIDOK STRONY
export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // Wymuszamy na TypeScripcie użycie naszego typu
  const locationData = locations.find((loc) => loc.slug === resolvedParams.slug) as LocationData | undefined;

  if (!locationData) {
    return notFound();
  }

  return <LocationClient locationData={locationData} />;
}
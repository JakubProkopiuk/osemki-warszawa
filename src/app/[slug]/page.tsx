import locations from '../../data/locations.json';
import LocationClient from './LocationClient';
import { Metadata } from 'next';

// Funkcja generująca parametry dla statycznego budowania stron
export async function generateStaticParams() {
  return locations.map((location) => ({
    slug: location.slug,
  }));
}

// Funkcja generująca dynamiczne metadane (SEO)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const location = locations.find((l) => l.slug === slug);
  
  return {
    title: `Usuwanie Ósemek Warszawa ${location?.nazwa_lokalizacji} | Ochota na Uśmiech`,
    description: `Szukasz chirurga na ${location?.nazwa_lokalizacji}? Bezbolesne usuwanie ósemek. Sprawdź wolne terminy i dojedź do nas w ${location?.czas_dojazdu}.`,
  };
}

// Główna strona jako Server Component
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locationData = locations.find((l) => l.slug === slug);

  if (!locationData) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans text-slate-400 uppercase tracking-widest">
        Nie znaleziono lokalizacji
      </div>
    );
  }

  // Przekazujemy dane do komponentu klienckiego
  return <LocationClient locationData={locationData} />;
}
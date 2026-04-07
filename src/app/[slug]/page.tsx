import locations from '../../data/locations.json';
import LocationClient from './LocationClient';

// Tego Next.js wymaga na Serwerze
export async function generateStaticParams() {
  return locations.map((location) => ({
    slug: location.slug,
  }));
}

// Główna strona jako Server Component
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locationData = locations.find((l) => l.slug === slug);

  if (!locationData) {
    return <div>Nie znaleziono lokalizacji</div>;
  }

  // Przekazujemy dane do komponentu klienckiego
  return <LocationClient locationData={locationData} />;
}
import { notFound } from 'next/navigation';
import LocationClient from './LocationClient';
import locations from '../../data/locations.json';

export async function generateStaticParams() {
  return locations.map((loc) => ({
    slug: loc.slug,
  }));
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const locationData = locations.find((loc) => loc.slug === resolvedParams.slug);

  if (!locationData) {
    return notFound();
  }

  return <LocationClient locationData={locationData} />;
}
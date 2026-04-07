import { notFound } from 'next/navigation';
import LocationClient from './LocationClient';
import locations from '../../data/locations.json';

export async function generateStaticParams() {
  return locations.map((loc) => ({
    slug: loc.slug,
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const locationData = locations.find((l) => l.slug === params.slug);

  if (!locationData) {
    notFound();
  }

  return <LocationClient locationData={locationData} />;
}
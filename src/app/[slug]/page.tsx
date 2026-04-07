import { notFound } from 'next/navigation';
import LocationClient from './LocationClient';
import locations from '../../data/locations.json';

export async function generateStaticParams() {
  return locations.map((loc) => ({
    slug: loc.slug,
  }));
}

export default function LocationPage({ params }: { params: { slug: string } }) {
  const locationData = locations.find((loc) => loc.slug === params.slug);

  if (!locationData) {
    return notFound();
  }

  const isOchota = locationData.klinika.includes('Pruszkowska');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          "name": "Ochota na Uśmiech",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": locationData.klinika,
            "addressLocality": "Warszawa",
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "347"
          }
        })}}
      />
      <LocationClient locationData={locationData} />
    </>
  );
}
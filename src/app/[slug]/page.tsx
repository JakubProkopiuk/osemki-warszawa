import { notFound } from 'next/navigation';
import LocationClient from './LocationClient';
import locations from '../../data/locations.json';

type LocationData = {
  slug: string;
  nazwa_lokalizacji: string;
  klinika: string;
  czas_dojazdu: string;
  punkt_orientacyjny: string;
  reviews: any[];
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const location = (locations as LocationData[]).find((l) => l.slug === params.slug);
  if (!location) return { title: 'Lokalizacja nie znaleziona' };

  return {
    title: `Usuwanie Ósemek ${location.nazwa_lokalizacji} | Bezboleśnie | Ochota na Uśmiech`,
    description: `Boli Cię ząb mądrości w okolicy: ${location.nazwa_lokalizacji}? Profesjonalna chirurgia blisko ${location.punkt_orientacyjny}. Sprawdź wolne terminy!`,
  };
}

export async function generateStaticParams() {
  return locations.map((loc) => ({
    slug: loc.slug,
  }));
}

export default function LocationPage({ params }: { params: { slug: string } }) {
  const locationData = (locations as LocationData[]).find((loc) => loc.slug === params.slug);

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
          "name": "Ochota na Uśmiech - Chirurgia Ósemek",
          "image": "https://www.osemki-warszawa.pl/logo.png",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": locationData.klinika,
            "addressLocality": "Warszawa",
            "postalCode": isOchota ? "02-118" : "02-777",
            "addressCountry": "PL"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "347"
          },
          "url": `https://www.osemki-warszawa.pl/${locationData.slug}`,
          "telephone": "+48794766575"
        })}}
      />
      <LocationClient locationData={locationData} />
    </>
  );
}
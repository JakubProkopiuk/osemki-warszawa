import { notFound } from 'next/navigation';
import LocationClient from './LocationClient';
import locations from '../../data/locations.json';
import { generateMedicalSchema } from '@/lib/generateSchema';
import { getClinicProfile, getLocationSearchVolume, type LocationRecord } from '@/lib/clinic';
import { getCanonical } from '@/lib/getCanonical';

export const revalidate = 2_592_000;
export const dynamicParams = true;

type LocationData = LocationRecord;

const allLocations = locations as LocationData[];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const location = allLocations.find((l) => l.slug === resolvedParams.slug);

  if (!location) return { title: 'Lokalizacja nie znaleziona' };

  const isOchota = location.klinika.includes('Pruszkowska');
  const dzielnicaGlowna = isOchota ? 'Ochota' : 'Ursynów';
  const canonical = getCanonical(location, allLocations);
  const landmark = location.punkt_orientacyjny ?? `okolicy ${dzielnicaGlowna}`;
  const travelTime = location.czas_dojazdu || 'kilkanaście minut';
  
  return {
    title: `Usuwanie Ósemek ${location.nazwa_lokalizacji} | Bezboleśnie | Chirurgia ${dzielnicaGlowna}`,
    description: `Boli Cię ząb mądrości w okolicy: ${location.nazwa_lokalizacji}? Profesjonalna chirurgia blisko ${landmark}. Sprawdź wolne terminy i dotrzyj do nas w ${travelTime}!`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `Chirurgiczne Usuwanie Ósemek - ${location.nazwa_lokalizacji}`,
      description: `Bezbolesne zabiegi blisko ${location.punkt_orientacyjny}. Zapisz się już dziś!`,
      url: canonical,
      siteName: 'Ochota na Uśmiech',
      locale: 'pl_PL',
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  const topLocations = [...allLocations]
    .sort((a, b) => getLocationSearchVolume(b) - getLocationSearchVolume(a))
    .slice(0, 200);

  return topLocations.map((loc) => ({
    slug: loc.slug,
  }));
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const locationData = allLocations.find((loc) => loc.slug === resolvedParams.slug);

  if (!locationData) {
    return notFound();
  }

  const clinicProfile = getClinicProfile(locationData.klinika);
  const enrichedLocation: LocationData = {
    ...locationData,
    hubSlug: locationData.hubSlug ?? clinicProfile.hubSlug,
    hubName: locationData.hubName ?? clinicProfile.hubName,
    displayName: locationData.displayName ?? locationData.nazwa_lokalizacji,
  };

  const schema = generateMedicalSchema(enrichedLocation, clinicProfile);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <LocationClient locationData={enrichedLocation} />
    </>
  );
}

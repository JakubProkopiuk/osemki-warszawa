import { notFound } from 'next/navigation';
import LocationClient from './LocationClient';
import TriageSeoContent from '@/components/TriageSeoContent';
import locations from '../../data/locations.json';
import { generateMedicalSchema } from '@/lib/generateSchema';
import { getClinicProfile, getLocationSearchVolume, type LocationRecord } from '@/lib/clinic';
import { getCanonical } from '@/lib/getCanonical';
import { TRIAGE_FAQ_ITEMS } from '@/lib/triageFaq';

export const revalidate = 2_592_000;
export const dynamicParams = true;

type LocationData = LocationRecord;

const allLocations = locations as LocationData[];
const INDEXED_URSYNOW_LOCATION_LIMIT = 60;
const isUrsynowLocation = (loc: LocationData) => loc.hubSlug === 'ursynow';
const indexedUrsynowLocations = [...allLocations]
  .filter(isUrsynowLocation)
  .sort((a, b) => getLocationSearchVolume(b) - getLocationSearchVolume(a))
  .slice(0, INDEXED_URSYNOW_LOCATION_LIMIT);
const indexedUrsynowSlugs = new Set(indexedUrsynowLocations.map((loc) => loc.slug));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const location = allLocations.find((l) => l.slug === resolvedParams.slug);

  if (!location) return { title: 'Lokalizacja nie znaleziona' };

  if (!isUrsynowLocation(location)) {
    return {
      title: 'Lokalizacja niedostępna',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  if (!indexedUrsynowSlugs.has(location.slug)) {
    return {
      title: `Kwalifikacja ósemki ${location.nazwa_lokalizacji}`,
      robots: {
        index: false,
        follow: true,
      },
      alternates: {
        canonical: getCanonical(location, allLocations),
      },
    };
  }

  const canonical = getCanonical(location, allLocations);
  const travelTime = location.czas_dojazdu || 'kilkanaście minut';
  
  if (location.slug === 'ursynow') {
    return {
      title: 'Boli ósemka na Ursynowie? Kwalifikacja online',
      description:
        'Odpowiedz na kilka pytań o ból, opuchliznę i RTG. Przygotujemy kontakt zwrotny z gabinetu stomatologicznego w rejonie Metra Ursynów.',
      alternates: {
        canonical,
      },
      openGraph: {
        title: 'Boli ósemka na Ursynowie? Kwalifikacja online',
        description:
          'Krótka kwalifikacja objawów ósemki: ból, RTG, opuchlizna, pilność kontaktu i kolejny sensowny krok.',
        url: canonical,
        siteName: 'Ósemki Ursynów',
        locale: 'pl_PL',
        type: 'website',
      },
    };
  }

  return {
    title: `Problem z ósemką ${location.nazwa_lokalizacji}? Kwalifikacja Ursynów`,
    description: `Sprawdź, jak pilny może być problem z ósemką w okolicy ${location.nazwa_lokalizacji}. Krótka kwalifikacja objawów, RTG i kontakt zwrotny z rejonu Metra Ursynów. Dojazd: ${travelTime}.`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `Kwalifikacja problemu z ósemką - ${location.nazwa_lokalizacji}`,
      description: `Sprawdź objawy i pilność kontaktu przy problemie z ósemką blisko ${location.punkt_orientacyjny}.`,
      url: canonical,
      siteName: 'Ósemki Ursynów',
      locale: 'pl_PL',
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  return indexedUrsynowLocations.map((loc) => ({
    slug: loc.slug,
  }));
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const locationData = allLocations.find((loc) => loc.slug === resolvedParams.slug);

  if (!locationData) {
    return notFound();
  }

  if (!isUrsynowLocation(locationData)) {
    return notFound();
  }

  const clinicProfile = getClinicProfile();
  const enrichedLocation: LocationData = {
    ...locationData,
    hubSlug: locationData.hubSlug ?? clinicProfile.hubSlug,
    hubName: locationData.hubName ?? clinicProfile.hubName,
    displayName: locationData.displayName ?? locationData.nazwa_lokalizacji,
  };

  const popularLocations = indexedUrsynowLocations.filter((loc) => loc.slug !== locationData.slug).slice(0, 18);

  const schema = generateMedicalSchema({
    ...enrichedLocation,
    faq: TRIAGE_FAQ_ITEMS,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <LocationClient locationData={enrichedLocation} />
      <TriageSeoContent location={enrichedLocation} popularLocations={popularLocations} />
    </>
  );
}

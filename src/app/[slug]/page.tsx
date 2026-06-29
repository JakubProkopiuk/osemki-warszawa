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
const INDEXED_URSYNOW_LOCATION_LIMIT = 60;
const indexedUrsynowLocations = [...allLocations]
  .filter((loc) => loc.klinika.includes('KEN'))
  .sort((a, b) => getLocationSearchVolume(b) - getLocationSearchVolume(a))
  .slice(0, INDEXED_URSYNOW_LOCATION_LIMIT);
const indexedUrsynowSlugs = new Set(indexedUrsynowLocations.map((loc) => loc.slug));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const location = allLocations.find((l) => l.slug === resolvedParams.slug);

  if (!location) return { title: 'Lokalizacja nie znaleziona' };

  if (location.klinika.toLowerCase().includes('pruszkowska')) {
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
      title: 'Boli ósemka na Ursynowie? Szybka kwalifikacja online',
      description:
        'Sprawdź w 30 sekund, czy przy bólu ósemki na Ursynowie warto umówić konsultację chirurgiczną, RTG lub pilniejszy kontakt telefoniczny.',
      alternates: {
        canonical,
      },
      openGraph: {
        title: 'Boli ósemka na Ursynowie? Szybka kwalifikacja online',
        description:
          'Krótka kwalifikacja problemu z ósemką: objawy, RTG, pilność kontaktu i kolejny sensowny krok.',
        url: canonical,
        siteName: 'Ósemki Ursynów',
        locale: 'pl_PL',
        type: 'website',
      },
    };
  }

  return {
    title: `Boli ósemka ${location.nazwa_lokalizacji}? Kwalifikacja Ursynów`,
    description: `Boli Cię ząb mądrości w okolicy: ${location.nazwa_lokalizacji}? Sprawdź, czy sensowna jest konsultacja, RTG lub pilniejszy kontakt z gabinetem na Ursynowie. Dojazd: ${travelTime}.`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `Chirurgiczne Usuwanie Ósemek - ${location.nazwa_lokalizacji}`,
      description: `Kwalifikacja problemu z ósemką blisko ${location.punkt_orientacyjny}.`,
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

  if (locationData.klinika.toLowerCase().includes('pruszkowska')) {
    return notFound();
  }

  const clinicProfile = getClinicProfile(locationData.klinika);
  const enrichedLocation: LocationData = {
    ...locationData,
    hubSlug: locationData.hubSlug ?? clinicProfile.hubSlug,
    hubName: locationData.hubName ?? clinicProfile.hubName,
    displayName: locationData.displayName ?? locationData.nazwa_lokalizacji,
  };

  const faqItems = [
    {
      question: 'Czy zabieg będzie bolesny?',
      answer:
        'Podczas konsultacji lekarz omawia znieczulenie miejscowe i przebieg wizyty. Celem jest zaplanowanie leczenia w możliwie komfortowych warunkach.',
    },
    {
      question: 'Czy muszę mieć skierowanie lub RTG?',
      answer:
        'Skierowanie zwykle nie jest konieczne. Jeśli nie masz aktualnego zdjęcia, podczas kontaktu ustalimy, czy diagnostyka będzie potrzebna.',
    },
    {
      question: 'Co po zabiegu? Czy dostanę zwolnienie (L4)?',
      answer:
        'Powrót do codziennych obowiązków zależy od sytuacji klinicznej i zakresu zabiegu. Zalecenia są omawiane indywidualnie po konsultacji.',
    },
    {
      question: 'Jakie są koszty usunięcia ósemki?',
      answer:
        'Koszt jest ustalany indywidualnie na podstawie konsultacji, diagnostyki i stopnia trudności. Przed decyzją pacjent otrzymuje informację o dalszym planie.',
    },
  ];

  const schema = generateMedicalSchema({
    ...enrichedLocation,
    faq: faqItems.map((item) => ({ question: item.question, answer: item.answer })),
  });

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

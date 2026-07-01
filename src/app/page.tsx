import type { Metadata } from 'next';
import TriageSeoContent from '@/components/TriageSeoContent';
import TriageFlowClient from '@/components/TriageFlowClient';
import locations from '@/data/locations.json';
import { generateMedicalSchema } from '@/lib/generateSchema';
import { getLocationSearchVolume, type LocationRecord } from '@/lib/clinic';

export const metadata: Metadata = {
  title: 'Sprawdź pilność problemu z ósemką na Ursynowie',
  description:
    'Krótka kwalifikacja objawów ósemki: ból, opuchlizna, RTG i kontakt zwrotny z gabinetu stomatologicznego w rejonie Metra Ursynów.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sprawdź pilność problemu z ósemką na Ursynowie',
    description:
      'Odpowiedz na kilka pytań o ból, opuchliznę i RTG. Przygotujemy kontakt zwrotny w rejonie Metra Ursynów.',
    url: 'https://www.osemki-warszawa.pl/',
    siteName: 'Ósemki Ursynów',
    locale: 'pl_PL',
    type: 'website',
  },
};

const allLocations = locations as LocationRecord[];
const popularLocations = [...allLocations]
  .filter((loc) => loc.hubSlug === 'ursynow')
  .sort((a, b) => getLocationSearchVolume(b) - getLocationSearchVolume(a))
  .slice(0, 18);

const homeLocation: LocationRecord = {
  slug: 'home',
  nazwa_lokalizacji: 'Ursynów',
  klinika: 'rejon Metra Ursynów',
  czas_dojazdu: 'zależnie od lokalizacji',
  punkt_orientacyjny: 'Metro Ursynów',
  hubSlug: 'ursynow',
  hubName: 'Ursynów',
  displayName: 'Ursynów',
};

export default function HomePage() {
  const schema = generateMedicalSchema(homeLocation);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <TriageFlowClient localArea="Ursynów" slug="home" />
      <TriageSeoContent location={homeLocation} popularLocations={popularLocations} />
    </>
  );
}

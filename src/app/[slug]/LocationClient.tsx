'use client';

import TriageFlowClient from '@/components/TriageFlowClient';

type LocationData = {
  slug: string;
  nazwa_lokalizacji: string;
  klinika: string;
};

export default function LocationClient({ locationData }: { locationData: LocationData }) {
  return <TriageFlowClient localArea={locationData.nazwa_lokalizacji} slug={locationData.slug} />;
}

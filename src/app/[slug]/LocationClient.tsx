'use client';

import ConversationalFlow from '@/components/ConversationalFlow';
import { wisdomTeethFlow } from '@/lib/flows/wisdomTeethFlow';

type LocationData = {
  slug: string;
  nazwa_lokalizacji: string;
  klinika: string;
};

export default function LocationClient({ locationData }: { locationData: LocationData }) {
  return (
    <ConversationalFlow
      config={wisdomTeethFlow}
      localArea={locationData.nazwa_lokalizacji}
      slug={locationData.slug}
    />
  );
}

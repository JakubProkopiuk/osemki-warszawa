'use client';

import ConversationalFlow from '@/components/ConversationalFlow';
import { wisdomTeethFlow } from '@/lib/flows/wisdomTeethFlow';

export default function HomePage() {
  return <ConversationalFlow config={wisdomTeethFlow} localArea="Ursynów" slug="home" />;
}

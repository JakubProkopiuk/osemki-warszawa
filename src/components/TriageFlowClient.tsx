'use client';

import ConversationalFlow from '@/components/ConversationalFlow';
import { wisdomTeethFlow } from '@/lib/flows/wisdomTeethFlow';

type TriageFlowClientProps = {
  localArea: string;
  slug: string;
};

export default function TriageFlowClient({ localArea, slug }: TriageFlowClientProps) {
  return <ConversationalFlow config={wisdomTeethFlow} localArea={localArea} slug={slug} />;
}

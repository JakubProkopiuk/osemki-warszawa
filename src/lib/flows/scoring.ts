import type { LeadScoringResult, TriageAnswers } from './types';

const isSwellingSignal = (value?: string) =>
  value === 'Jest opuchlizna' ||
  value === 'Tak, jest opuchlizna' ||
  value === 'Tak, trudno otworzyć usta';

export function calculateWisdomTeethLead(answers: TriageAnswers): LeadScoringResult {
  let leadScore = 0;

  if (answers.symptom === 'Jest opuchlizna') leadScore += 35;
  else if (answers.symptom === 'Boli') leadScore += 25;
  else if (answers.symptom === 'Nie wiem, ale coś jest nie tak') leadScore += 15;
  else if (answers.symptom === 'Mam zalecenie od ortodonty') leadScore += 10;
  else if (answers.symptom === 'Chcę sprawdzić ósemki') leadScore += 5;

  if (answers.pain_score <= 3) leadScore += 5;
  else if (answers.pain_score <= 6) leadScore += 20;
  else if (answers.pain_score <= 8) leadScore += 35;
  else leadScore += 45;

  if (answers.tooth_area === 'Lewa dół' || answers.tooth_area === 'Prawa dół') leadScore += 10;
  else if (answers.tooth_area === 'Lewa góra' || answers.tooth_area === 'Prawa góra') leadScore += 5;
  else if (answers.tooth_area === 'Nie wiem') leadScore += 5;

  if (answers.swelling_or_limited_opening === 'Tak, jest opuchlizna') leadScore += 30;
  else if (answers.swelling_or_limited_opening === 'Tak, trudno otworzyć usta') leadScore += 30;
  else if (answers.swelling_or_limited_opening === 'Nie wiem') leadScore += 10;

  if (answers.has_rtg === 'Mam' || answers.has_rtg === 'Mam skierowanie') leadScore += 5;

  if (answers.preferred_contact_time === 'Jak najszybciej') leadScore += 15;
  else if (answers.preferred_contact_time === 'Dziś') leadScore += 10;
  else if (answers.preferred_contact_time === 'Jutro') leadScore += 5;

  const forcedUrgent =
    answers.pain_score >= 7 ||
    isSwellingSignal(answers.symptom) ||
    isSwellingSignal(answers.swelling_or_limited_opening);

  const urgencyBand = forcedUrgent || leadScore >= 70 ? 'high' : leadScore >= 35 ? 'medium' : 'low';

  return {
    leadScore,
    urgencyBand,
    leadPriority: urgencyBand,
    urgentLabel: urgencyBand === 'high' ? 'PILNE' : null,
  };
}

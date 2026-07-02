import type { LeadScoringResult, TriageAnswers } from './types';

const isSwellingSignal = (value?: string) =>
  value === 'Jest opuchlizna' ||
  value === 'Tak, jest opuchlizna' ||
  value === 'Tak, trudno otworzyć usta' ||
  value === 'Sprawa wydaje się pilna';

export function calculateWisdomTeethLead(answers: TriageAnswers): LeadScoringResult {
  let leadScore = 0;

  if (answers.symptom === 'Sprawa wydaje się pilna') leadScore += 35;
  else if (answers.symptom === 'Mam RTG lub CBCT i chcę omówić dalszy krok') leadScore += 25;
  else if (answers.symptom === 'Mam zalecenie lub skierowanie') leadScore += 25;
  else if (answers.symptom === 'Chcę skonsultować ósemkę') leadScore += 20;
  else if (answers.symptom === 'Chcę zapytać o możliwy termin') leadScore += 15;

  if (answers.swelling_or_limited_opening === 'Tak, jest opuchlizna') leadScore += 30;
  else if (answers.swelling_or_limited_opening === 'Tak, trudno otworzyć usta') leadScore += 30;
  else if (answers.swelling_or_limited_opening === 'Nie wiem') leadScore += 10;

  if (answers.has_rtg === 'Mam' || answers.has_rtg === 'Mam skierowanie') leadScore += 10;

  if (answers.preferred_contact_time === 'Jak najszybciej') leadScore += 15;
  else if (answers.preferred_contact_time === 'Dziś') leadScore += 10;
  else if (answers.preferred_contact_time === 'Jutro') leadScore += 5;

  const forcedUrgent =
    isSwellingSignal(answers.symptom) ||
    isSwellingSignal(answers.swelling_or_limited_opening) ||
    answers.preferred_contact_time === 'Jak najszybciej';

  const urgencyBand = forcedUrgent || leadScore >= 70 ? 'high' : leadScore >= 35 ? 'medium' : 'low';

  return {
    leadScore,
    urgencyBand,
    leadPriority: urgencyBand,
    urgentLabel: urgencyBand === 'high' ? 'PILNE' : null,
  };
}

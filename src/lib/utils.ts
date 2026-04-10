import { differenceInMonths } from 'date-fns';

export function getProcedureCount(openedDate: Date): number {
  const monthsOpen = Math.max(differenceInMonths(new Date(), openedDate), 1);
  const estimated = monthsOpen * 87;
  return Math.floor(estimated / 100) * 100;
}


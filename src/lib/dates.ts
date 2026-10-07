import { differenceInCalendarDays } from "date-fns";

export const OCTOBER = 9; // zero-based month index

/** The October to show: this year's, or next year's once Halloween has passed. */
export function calendarYear(today: Date): number {
  return today.getMonth() > OCTOBER ? today.getFullYear() + 1 : today.getFullYear();
}

export const octoberDate = (year: number, day: number) => new Date(year, OCTOBER, day);

/** Nights until Oct 31 of the displayed year, or null outside October. */
export function nightsUntilHalloween(today: Date): number | null {
  if (today.getMonth() !== OCTOBER) return null;
  return differenceInCalendarDays(octoberDate(today.getFullYear(), 31), today);
}

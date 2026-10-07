import { matches } from "./filters";
import type { Filters, Movie } from "./types";

export const DAYS_IN_OCTOBER = 31;
export const HALLOWEEN_PIN_ID = "halloween-1978";

/** Day of October (1–31) → movie, or null when the filters leave that night empty. */
export type Schedule = Map<number, Movie | null>;

/** Small deterministic string hash (FNV-1a), so the plan is stable across reloads. */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Pick `count` items spread evenly across a sorted list, keeping both ends. */
function spreadPick<T>(items: T[], count: number): T[] {
  if (count >= items.length) return items;
  if (count === 1) return [items[items.length - 1]];
  return Array.from({ length: count }, (_, i) =>
    items[Math.round((i * (items.length - 1)) / (count - 1))],
  );
}

/** Evenly spaced days for `n` movies, always ending on Oct 31. */
export function placementDays(n: number): number[] {
  if (n <= 0) return [];
  if (n >= DAYS_IN_OCTOBER) return Array.from({ length: DAYS_IN_OCTOBER }, (_, i) => i + 1);
  if (n === 1) return [DAYS_IN_OCTOBER];
  return Array.from({ length: n }, (_, i) =>
    Math.round(DAYS_IN_OCTOBER - ((n - 1 - i) * (DAYS_IN_OCTOBER - 1)) / (n - 1)),
  );
}

/**
 * Plan one movie per night of October. Matches are ordered from gentlest to most
 * intense so the month builds up to Halloween; ties are shuffled by a year-seeded hash.
 * Halloween (1978) is pinned to Oct 31 whenever it matches the filters.
 */
export function buildSchedule(movies: Movie[], filters: Filters, year: number): Schedule {
  const matching = movies.filter((m) => matches(m, filters));
  const pinned = matching.find((m) => m.id === HALLOWEEN_PIN_ID);
  const rest = matching
    .filter((m) => m !== pinned)
    .sort(
      (a, b) =>
        a.intensity - b.intensity || hash(`${year}:${a.id}`) - hash(`${year}:${b.id}`),
    );

  const slots = pinned ? DAYS_IN_OCTOBER - 1 : DAYS_IN_OCTOBER;
  const picked = spreadPick(rest, slots);
  if (pinned) picked.push(pinned);

  const schedule: Schedule = new Map();
  for (let day = 1; day <= DAYS_IN_OCTOBER; day++) schedule.set(day, null);
  placementDays(picked.length).forEach((day, i) => schedule.set(day, picked[i]));
  return schedule;
}

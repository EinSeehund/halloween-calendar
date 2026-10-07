import { describe, expect, it } from "vitest";
import { MOVIES } from "../data";
import { filtersFromSearch, filtersToSearch, matches } from "./filters";
import { buildSchedule, HALLOWEEN_PIN_ID, placementDays } from "./schedule";
import { EMPTY_FILTERS, type Filters, type Movie } from "./types";

const fake = (n: number, intensity: Movie["intensity"] = 3): Movie[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `fake-${i}-2000`,
    title: `Fake ${i}`,
    year: 2000,
    director: "Nobody",
    runtime: 90,
    country: "Nowhere",
    continent: "Europe",
    subgenres: ["slasher"],
    intensity,
    plot: "",
    whyWatch: "",
  }));

const filled = (s: Map<number, Movie | null>) =>
  [...s.entries()].filter(([, m]) => m !== null).map(([d]) => d);

describe("placementDays", () => {
  it.each([
    [0, []],
    [1, [31]],
    [2, [1, 31]],
    [5, [1, 9, 16, 24, 31]],
  ])("places %i movies on %j", (n, expected) => {
    expect(placementDays(n)).toEqual(expected);
  });

  it("fills every day for 31+ movies and spreads 30 without collisions", () => {
    expect(placementDays(31)).toHaveLength(31);
    const days = placementDays(30);
    expect(new Set(days).size).toBe(30);
    expect(days.at(-1)).toBe(31);
    expect(Math.min(...days)).toBe(1);
  });
});

describe("buildSchedule", () => {
  it("fills all 31 nights with unique movies when unfiltered", () => {
    const s = buildSchedule(MOVIES, EMPTY_FILTERS, 2026);
    expect(s.size).toBe(31);
    const ids = [...s.values()].map((m) => m!.id);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(31);
  });

  it("is deterministic for the same inputs", () => {
    const a = buildSchedule(MOVIES, EMPTY_FILTERS, 2026);
    const b = buildSchedule(MOVIES, EMPTY_FILTERS, 2026);
    expect([...a.values()].map((m) => m?.id)).toEqual([...b.values()].map((m) => m?.id));
  });

  it("pins Halloween (1978) to October 31 when it matches", () => {
    expect(buildSchedule(MOVIES, EMPTY_FILTERS, 2026).get(31)?.id).toBe(HALLOWEEN_PIN_ID);
    const slashers: Filters = { ...EMPTY_FILTERS, subgenres: ["slasher"] };
    expect(buildSchedule(MOVIES, slashers, 2026).get(31)?.id).toBe(HALLOWEEN_PIN_ID);
  });

  it("only schedules movies that match the filters", () => {
    const f: Filters = { subgenres: ["zombie", "creature"], decades: [], continents: ["Asia"] };
    for (const m of buildSchedule(MOVIES, f, 2026).values()) {
      if (m) expect(matches(m, f)).toBe(true);
    }
  });

  it("builds up in intensity towards Halloween", () => {
    const movies = [...buildSchedule(MOVIES, EMPTY_FILTERS, 2026).values()] as Movie[];
    const levels = movies.slice(0, 30).map((m) => m.intensity);
    expect(levels).toEqual([...levels].sort((a, b) => a - b));
  });

  it.each([0, 1, 5, 30])("leaves gaps when only %i movies match", (n) => {
    const s = buildSchedule(fake(n), EMPTY_FILTERS, 2026);
    expect(s.size).toBe(31);
    expect(filled(s)).toEqual(placementDays(n));
  });

  it("returns an empty month when nothing matches", () => {
    const f: Filters = { subgenres: ["soft-horror"], decades: [1920], continents: [] };
    expect(filled(buildSchedule(MOVIES, f, 2026))).toEqual([]);
  });
});

describe("filter URL serialization", () => {
  it("round-trips and drops unknown values", () => {
    const f: Filters = { subgenres: ["slasher", "zombie"], decades: [1980], continents: ["Asia"] };
    expect(filtersFromSearch(filtersToSearch(f))).toEqual(f);
    expect(filtersFromSearch("?sub=bogus,slasher&dec=1985,abc&cont=Mars")).toEqual({
      subgenres: ["slasher"],
      decades: [],
      continents: [],
    });
  });
});

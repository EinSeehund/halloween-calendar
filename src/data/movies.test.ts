import { describe, expect, it } from "vitest";
import { z } from "zod";
import { decadeOf } from "../lib/filters";
import { CONTINENTS, SUBGENRES } from "../lib/types";
import movies from "./movies.json";

const MovieSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+-\d{4}$/),
  title: z.string().min(1),
  year: z.number().int().min(1900).max(2026),
  director: z.string().min(1),
  runtime: z.number().int().min(40).max(240),
  country: z.string().min(1),
  continent: z.enum(CONTINENTS),
  subgenres: z.array(z.enum(SUBGENRES)).min(1).max(3),
  intensity: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  plot: z.string().min(60).max(400),
  whyWatch: z.string().min(10).max(160),
});

describe("movies.json", () => {
  it("every entry matches the schema", () => {
    for (const m of movies) {
      const result = MovieSchema.safeParse(m);
      expect(result.success, `${m.id}: ${result.error?.message}`).toBe(true);
    }
  });

  it("ids are unique and end with the release year", () => {
    const ids = movies.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const m of movies) expect(m.id.endsWith(`-${m.year}`), m.id).toBe(true);
  });

  it("has no duplicate subgenres within a movie", () => {
    for (const m of movies) expect(new Set(m.subgenres).size, m.id).toBe(m.subgenres.length);
  });

  it("covers every subgenre with enough films to fill a good chunk of the month", () => {
    for (const s of SUBGENRES) {
      expect(movies.filter((m) => m.subgenres.includes(s)).length, s).toBeGreaterThanOrEqual(8);
    }
  });

  it("covers every continent", () => {
    for (const c of CONTINENTS) {
      expect(movies.filter((m) => m.continent === c).length, c).toBeGreaterThanOrEqual(5);
    }
  });

  it("covers every decade from the 1920s to the 2020s", () => {
    for (let d = 1920; d <= 2020; d += 10) {
      expect(movies.some((m) => decadeOf(m.year) === d), `${d}s`).toBe(true);
    }
  });

  it("has enough films to fill October unfiltered", () => {
    expect(movies.length).toBeGreaterThanOrEqual(100);
  });
});

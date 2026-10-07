import { CONTINENTS, SUBGENRES, type Continent, type Filters, type Movie, type Subgenre } from "./types";

export const decadeOf = (year: number) => Math.floor(year / 10) * 10;

export const decadesIn = (movies: Movie[]) =>
  [...new Set(movies.map((m) => decadeOf(m.year)))].sort((a, b) => a - b);

export const isEmpty = (f: Filters) =>
  f.subgenres.length === 0 && f.decades.length === 0 && f.continents.length === 0;

/** OR within a category, AND across categories; an empty category matches everything. */
export function matches(movie: Movie, f: Filters): boolean {
  return (
    (f.subgenres.length === 0 || movie.subgenres.some((s) => f.subgenres.includes(s))) &&
    (f.decades.length === 0 || f.decades.includes(decadeOf(movie.year))) &&
    (f.continents.length === 0 || f.continents.includes(movie.continent))
  );
}

export function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

// --- URL query (de)serialization: ?sub=slasher,zombie&dec=1980&cont=Asia ---

const split = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

export function filtersFromSearch(search: string): Filters {
  const params = new URLSearchParams(search);
  return {
    subgenres: split(params.get("sub")).filter((s): s is Subgenre =>
      (SUBGENRES as readonly string[]).includes(s),
    ),
    decades: split(params.get("dec"))
      .map(Number)
      .filter((d) => Number.isInteger(d) && d % 10 === 0),
    continents: split(params.get("cont")).filter((c): c is Continent =>
      (CONTINENTS as readonly string[]).includes(c),
    ),
  };
}

export function filtersToSearch(f: Filters): string {
  const params = new URLSearchParams();
  if (f.subgenres.length) params.set("sub", f.subgenres.join(","));
  if (f.decades.length) params.set("dec", [...f.decades].sort().join(","));
  if (f.continents.length) params.set("cont", f.continents.join(","));
  const s = params.toString();
  return s ? `?${s}` : "";
}

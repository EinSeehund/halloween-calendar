export const SUBGENRES = [
  "slasher",
  "paranormal",
  "supernatural",
  "psychological",
  "creature",
  "zombie",
  "folk-horror",
  "body-horror",
  "found-footage",
  "horror-comedy",
  "soft-horror",
] as const;
export type Subgenre = (typeof SUBGENRES)[number];

export const SUBGENRE_LABELS: Record<Subgenre, string> = {
  slasher: "Slasher",
  paranormal: "Paranormal",
  supernatural: "Supernatural",
  psychological: "Psychological",
  creature: "Creature",
  zombie: "Zombie",
  "folk-horror": "Folk horror",
  "body-horror": "Body horror",
  "found-footage": "Found footage",
  "horror-comedy": "Horror comedy",
  "soft-horror": "Soft horror",
};

export const CONTINENTS = [
  "North America",
  "South America",
  "Europe",
  "Asia",
  "Africa",
  "Oceania",
] as const;
export type Continent = (typeof CONTINENTS)[number];

export type Intensity = 1 | 2 | 3 | 4 | 5;

export interface Movie {
  id: string;
  title: string;
  year: number;
  director: string;
  runtime: number;
  country: string;
  continent: Continent;
  subgenres: Subgenre[];
  intensity: Intensity;
  plot: string;
  whyWatch: string;
}

export interface Filters {
  subgenres: Subgenre[];
  decades: number[];
  continents: Continent[];
}

export const EMPTY_FILTERS: Filters = { subgenres: [], decades: [], continents: [] };

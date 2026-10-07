import type { Movie } from "../lib/types";
import raw from "./movies.json";

// Shape is enforced by src/data/movies.test.ts (zod schema).
export const MOVIES = raw as Movie[];

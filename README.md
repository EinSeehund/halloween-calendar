# 🎃 Halloween Calendar

One popular horror movie for every night of October, building up to Halloween.
Filter by subgenre, decade and continent; click a night to see the plot and details.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm test          # data validation, scheduling logic, UI smoke tests
npm run build     # type-check + static build into dist/
```

`dist/` is a plain static site — deploy it to Netlify, Vercel, GitHub Pages, etc.

## Stack

Vite · React 18 · TypeScript · Tailwind CSS v4 · Radix Dialog · date-fns · Vitest + Testing Library · zod (data schema test)

## How the calendar is planned

`src/lib/schedule.ts`:

1. **Filter**: options within a group are OR'ed, groups are AND'ed, an empty group means "all".
2. **Order** matches from gentlest to most intense (🎃 1–5), so the month escalates toward Halloween. Ties are shuffled by a hash seeded with the year, so the plan is stable across reloads.
3. **Pick** 31 evenly across the intensity range when more match.
4. **Place**: with fewer than 31 matches, films are spread evenly over the month, always ending on Oct 31; the remaining nights show "No match tonight".
5. *Halloween* (1978) is pinned to Oct 31 whenever it matches.

Filters are stored in the URL (`?sub=slasher,zombie&dec=1980&cont=Asia`), so a selection can be shared as a link.

## Adding or editing movies

Edit `src/data/movies.json`. Each entry:

| field       | notes                                                                 |
| ----------- | --------------------------------------------------------------------- |
| `id`        | `kebab-title-YEAR`, unique                                            |
| `continent` | `North America`, `South America`, `Europe`, `Asia`, `Africa`, `Oceania` |
| `subgenres` | 1–3 of the values in `SUBGENRES` (`src/lib/types.ts`)                 |
| `intensity` | 1 cozy · 2 spooky · 3 scary · 4 terrifying · 5 brutal                 |
| `plot`      | 2–3 spoiler-free sentences                                            |

Run `npm test` afterward — the schema test catches typos and missing fields.
